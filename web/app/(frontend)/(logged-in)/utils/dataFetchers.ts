import { db } from "@/lib/db"
import { 
  User,
  SystemRole,
  AssessmentType, 
  AssessmentCollection,
  AssessmentCollectionUser,
  Assessment, 
  AssessmentUser, 
  Permission,
  Part, 
  Section, 
  Attribute, 
  Level
} from "@/prisma/mssql/generated/client"
import * as assessmentType from "@/app/utils/assessmentType"
import * as assessmentCollection from "@/app/utils/assessmentCollection"
import * as assessment from "@/app/utils/assessment"
import * as part from "@/app/utils/part"
import * as section from "@/app/utils/section"
import * as attribute from "@/app/utils/attribute"
import * as level from "@/app/utils/level"

export async function fetchUsers(): Promise<(User & { 
  systemRoles: SystemRole[],
  assessmentUser: AssessmentUser[],
  assessmentCollectionUser: AssessmentCollectionUser[]
})[]> {
  return await db.user.findMany({include: { 
    systemRoles: true,
    assessmentUser: true,
    assessmentCollectionUser: true,
  }})
}

export async function fetchAssessmentTypes(): Promise<AssessmentType[]> {
  return await assessmentType.findMany({})
}

export async function fetchAssessmentType(typeid: string): Promise<AssessmentType | null> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return null
  }

  return await assessmentType.findUnique({ where: { id: idAsInteger } })
}

export async function fetchAssessmentCollections(typeid: string): Promise<AssessmentCollection[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }

  return await assessmentCollection.findMany({ where: { assessmentTypeId: idAsInteger } })
}

export async function fetchAllAssessments(): Promise<Assessment[]> {
  return await assessment.findMany({})
}

// Returns assessments in collections of given type
export async function fetchAssessments(typeid: string): Promise<Assessment[]> {
  const collections = await fetchAssessmentCollections(typeid)
  const collectionIds = collections.map((collection: AssessmentCollection) => collection.id)

  return await assessment.findMany({ where: { assessmentCollectionId: { in: collectionIds } } })
}

export async function fetchAssessment(assessmentId: string): Promise<Assessment | null> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return null
  }

  return await assessment.findUnique({ where: { id: idAsInteger } })
}

export async function fetchAssessmentUsers(assessmentId: string): Promise<(AssessmentUser & { user: User })[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(assessmentId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }

  return await db.assessmentUser.findMany({ where: { assessmentId: idAsInteger }, include: { user: true } })
}

export async function fetchAssessmentUsersWithPermissions(userId: string): Promise<(AssessmentUser & { permissions: Permission[] })[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(userId, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }
  return await db.assessmentUser.findMany({ where: { userId: idAsInteger }, include: { permissions: true } })
}

export async function fetchAssessmentUserWithPermissions(assessmentUserId: number): Promise<AssessmentUser & { permissions: Permission[] } | null> {
  return await db.assessmentUser.findUnique({ where: { id: assessmentUserId }, include: { permissions: true } })
}

export async function fetchParts(typeid: string): Promise<Part[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }

  return await part.findMany({ where: { assessmentTypeId: idAsInteger } })
}

export async function fetchPart(typeid: string, partName: string): Promise<Part | null> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return null
  }
  const parts = await part.findMany({ where: { assessmentTypeId: idAsInteger } })
  const uniquePart = parts.find(part => part.name === partName)
  if (uniquePart === undefined) {
    return null
  }
  return uniquePart
}
  
export async function fetchSections(typeid: string, partName: string): Promise<Section[]> {
  // Since the id is coming from the url, it's a string, so we need to convert it to an integer
  const idAsInteger = parseInt(typeid, 10)
  // Technically, users could put anything into a URL, so we need to make sure it's a number
  if(isNaN(idAsInteger)) {
    return []
  }
  const parts = await part.findMany({ where: { assessmentTypeId: idAsInteger } })
  const uniquePart = parts.find(part => part.name === partName)
  if (uniquePart === undefined) {
    return []
  }
  return await section.findMany({ where: { partId: uniquePart.id } })
}

export async function fetchSection(sectionId: string): Promise<Section | null> {
  return await section.findUnique({ where: { id: sectionId } })
}

export async function fetchAttributes(sectionId: string): Promise<Attribute[]> {
  return await attribute.findMany({ where: { sectionId: sectionId } })
}

export async function fetchAttribute(attributeId: string): Promise<Attribute | null> {
  return await attribute.findUnique({ where: { id: attributeId } })
}

export async function fetchLevels(attributeId: string): Promise<Level[]> {
  return await level.findMany({ where: { attributeId: attributeId } })
}