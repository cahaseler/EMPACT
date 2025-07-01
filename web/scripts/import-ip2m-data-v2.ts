import { PrismaClient } from '../prisma/mssql/generated/client'
import * as XLSX from 'xlsx'
import { parseArgs } from 'node:util'

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
})

interface ExcelAssessment {
  id: number
  project_id: string
  name: string
  type_id: number
  type: string
  location: string
  date: number
  manager: string
  description: string
  hide_description: boolean
  status: string
  has_maturity: boolean
  has_environment: boolean
  maturity_score: number
  current_progress: string
  percent_completed: number
  maturity_progress: string
  env_progress: string
  is_env_anonymous: boolean
  lock_env: boolean
  internal_assessment_status: string
  factor_facilitator_answers: boolean
  environment_score: number
}

interface ExcelUserResponse {
  id: number
  user_id: number
  attribute_id: string
  level_id: number
  notes: string
  section_id: string
  is_facilitator_response: boolean
  'attributes.name': string
  'attributes.description': string
  'levels.short_description': string
  'levels.long_description': string
  'levels.level_number': number
  'levels.weight': number
  'sections.name': string
  'sections.description': string
}

const options = {
  file: { type: 'string' as const },
  dryRun: { type: 'boolean' as const },
}

async function main() {
  const {
    values: { file, dryRun },
  } = parseArgs({ options })

  if (!file) {
    console.error('Please provide a file path with --file parameter')
    process.exit(1)
  }

  console.log(`\n📊 Starting IP2M METRR Data Import`)
  console.log(`File: ${file}`)
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE IMPORT'}`)
  console.log('─'.repeat(50))

  try {
    // Read Excel file
    const workbook = XLSX.readFile(file)
    const assessmentSheet = workbook.Sheets['assessment']
    const responseSheet = workbook.Sheets['assessment_user_responses']

    const assessmentData = XLSX.utils.sheet_to_json<ExcelAssessment>(assessmentSheet)
    const responseData = XLSX.utils.sheet_to_json<ExcelUserResponse>(responseSheet)

    console.log(`\n📋 Found ${assessmentData.length} assessment(s)`)
    console.log(`📝 Found ${responseData.length} responses`)

    // Pre-validate all data before starting transaction
    const assessmentType = await prisma.assessmentType.findFirst({
      where: { name: 'IP2M METRR' },
      include: { parts: true }
    })

    if (!assessmentType) {
      throw new Error('IP2M METRR assessment type not found in database.')
    }

    console.log(`\n✅ IP2M METRR Assessment type found (ID: ${assessmentType.id})`)

    // Get all attributes for validation
    const attributes = await prisma.attribute.findMany()
    const attributeMap = new Map(attributes.map(a => [a.id, a]))

    // Validate all attribute IDs exist
    const uniqueAttributeIds = [...new Set(responseData.map(r => r.attribute_id))]
    const missingAttributes = uniqueAttributeIds.filter(id => !attributeMap.has(id))
    
    if (missingAttributes.length > 0) {
      console.error(`\n❌ Missing attributes in EMPACT database: ${missingAttributes.join(', ')}`)
      throw new Error('Some attributes from Excel do not exist in EMPACT database')
    }

    console.log(`✅ All ${uniqueAttributeIds.length} attributes validated`)

    // Map legacy level IDs to EMPACT level IDs
    const levels = await prisma.level.findMany()
    const levelMap = new Map<string, number>()
    
    // Create mapping key: attributeId + levelNumber -> levelId
    levels.forEach(level => {
      const key = `${level.attributeId}-${level.level}`
      levelMap.set(key, level.id)
    })


    if (dryRun) {
      console.log('\n🔍 DRY RUN - No changes will be made to the database')
      console.log('\nPlanned actions:')
      
      for (const excelAssessment of assessmentData) {
        console.log(`\n📁 Processing assessment: ${excelAssessment.name}`)
        const assessmentDate = new Date(excelAssessment.date)
        
        console.log(`  - Would create assessment collection: "Import - ${excelAssessment.name}"`)
        console.log(`  - Would create assessment with:`)
        console.log(`    - Project ID: ${excelAssessment.project_id}`)
        console.log(`    - Name: ${excelAssessment.name}`)
        console.log(`    - Location: ${excelAssessment.location}`)
        console.log(`    - Status: ${mapStatus(excelAssessment.status)}`)
        
        // Get unique users from ALL responses (no filter)
        const uniqueUserIds = [...new Set(responseData.map(r => r.user_id))]
        console.log(`  - Would create/use ${uniqueUserIds.length} users`)
        console.log(`  - Would create 1 assessment user group for all imported users`)
        console.log(`  - Would import ${responseData.length} responses`)
      }
      
      console.log('\n✅ Dry run completed. Run without --dryRun to perform actual import.')
      return
    }

    // Execute import in transaction
    await prisma.$transaction(async (tx) => {
      // Process each assessment
      for (const excelAssessment of assessmentData) {
        console.log(`\n📁 Processing assessment: ${excelAssessment.name}`)
        
        const assessmentDate = new Date(excelAssessment.date)
        const isCompleted = excelAssessment.status === 'COMPLETED'
        
        // Create assessment collection
        const collection = await tx.assessmentCollection.create({
          data: {
            name: `Import - ${excelAssessment.name}`,
            assessmentTypeId: assessmentType.id,
          }
        })

        // Create assessment
        const assessment = await tx.assessment.create({
          data: {
            projectId: excelAssessment.project_id,
            name: excelAssessment.name,
            location: excelAssessment.location,
            description: cleanHtml(excelAssessment.description || ''),
            status: mapStatus(excelAssessment.status),
            completedDate: isCompleted ? assessmentDate : null,
            assessmentCollectionId: collection.id,
          }
        })

        console.log(`  ✅ Created assessment (ID: ${assessment.id})`)

        // Create assessment parts
        const createdParts = []
        for (const part of assessmentType.parts) {
          const assessmentPart = await tx.assessmentPart.create({
            data: {
              assessmentId: assessment.id,
              partId: part.id,
              status: 'Active',
              date: assessmentDate,
            }
          })
          createdParts.push(assessmentPart)
        }

        console.log(`  ✅ Created ${assessmentType.parts.length} assessment parts`)

        // Add all attributes to assessment
        const assessmentAttributes = uniqueAttributeIds.map(attributeId => ({
          assessmentId: assessment.id,
          attributeId: attributeId,
        }))

        await tx.assessmentAttribute.createMany({
          data: assessmentAttributes,
        })

        console.log(`  ✅ Added ${assessmentAttributes.length} attributes to assessment`)

        // Create a single user group for all imported users
        const userGroup = await tx.assessmentUserGroup.create({
          data: {
            name: 'Imported Participants',
            assessmentId: assessment.id,
            status: 'Active'
          }
        })

        console.log(`  ✅ Created user group for imported participants`)

        // Get unique users from ALL responses (removed filter)
        const uniqueUserIds = [...new Set(responseData.map(r => r.user_id))]

        // Create or find users
        const userMap = new Map<number, number>()
        
        for (const legacyUserId of uniqueUserIds) {
          const email = `imported_ip2m_user_${legacyUserId}@doe.gov`
          
          let user = await tx.user.findUnique({
            where: { email }
          })

          if (!user) {
            user = await tx.user.create({
              data: {
                email,
                firstName: 'IP2M',
                lastName: `User ${legacyUserId}`,
              }
            })
            console.log(`  ✅ Created user: ${email}`)
          }

          userMap.set(legacyUserId, user.id)

          // Add user to assessment - no permissions needed for imported users
          try {
            await tx.assessmentUser.create({
              data: {
                assessmentId: assessment.id,
                userId: user.id,
                role: 'Participant',
                assessmentUserGroupId: userGroup.id,
                // Connect to all assessment parts for participants
                participantParts: {
                  connect: createdParts.map(p => ({ id: p.id }))
                }
              }
            })
          } catch (error: any) {
            if (error.code === 'P2002') {
              // Unique constraint violation - user already exists for this assessment
              console.log(`  ℹ️  User ${email} already assigned to assessment`)
            } else {
              console.error(`  ⚠️  Error creating assessment user for ${email}:`, error.message)
            }
          }
        }

        console.log(`  ✅ Processed ${uniqueUserIds.length} users`)

        // Import ALL responses
        let successCount = 0
        let errorCount = 0

        for (const response of responseData) {
          const empactUserId = userMap.get(response.user_id)
          if (!empactUserId) {
            console.error(`  ⚠️  Cannot find user mapping for legacy user ${response.user_id}`)
            errorCount++
            continue
          }

          // Map level ID
          const levelKey = `${response.attribute_id}-${response['levels.level_number']}`
          const empactLevelId = levelMap.get(levelKey)
          
          if (!empactLevelId) {
            console.error(`  ⚠️  Cannot find level mapping for ${levelKey}`)
            errorCount++
            continue
          }

          try {
            await tx.assessmentUserResponse.create({
              data: {
                assessmentId: assessment.id,
                userId: empactUserId,
                attributeId: response.attribute_id,
                levelId: empactLevelId,
                notes: cleanHtml(response.notes || ''),
              }
            })
            successCount++
          } catch (error: any) {
            console.error(`  ⚠️  Error importing response: ${error.message}`)
            errorCount++
          }
        }

        console.log(`  ✅ Imported ${successCount} responses`)
        if (errorCount > 0) {
          console.log(`  ⚠️  Failed to import ${errorCount} responses`)
        }

        // Skip score summaries - schema mismatch with database
        if (excelAssessment.maturity_score || excelAssessment.environment_score) {
          console.log(`  ℹ️  Skipping score summaries (database schema mismatch)`)
        }
      }
    }, {
      timeout: 60000 // 60 second timeout for large imports
    })

    console.log('\n🎉 Import completed successfully!')

  } catch (error) {
    console.error('\n❌ Import failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

function mapStatus(excelStatus: string): string {
  // Map Excel statuses to EMPACT statuses
  const statusMap: Record<string, string> = {
    'STARTED': 'Active',
    'COMPLETED': 'Final',
    'NOT_STARTED': 'Inactive',
    'ACTIVE': 'Active',
    'INACTIVE': 'Inactive',
    'FINAL': 'Final',
    'ARCHIVED': 'Archived'
  }
  return statusMap[excelStatus.toUpperCase()] || 'Active'
}

function cleanHtml(html: string): string {
  // Basic HTML tag removal
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&amp;/g, '&')
    .trim()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})