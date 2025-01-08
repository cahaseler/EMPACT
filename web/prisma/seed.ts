import { parseArgs } from "node:util"
import { PrismaClient as MssqlPrismaClient } from "./mssql/generated/client"
//import { PrismaClient as PostgresPrismaClient } from "./postgres/generated/client"
import { PrismaClient as SqlitePrismaClient } from "./sqlite/generated/client"
import { testAccounts } from "../tests/e2e/test-accounts"

const prismaMssql = new MssqlPrismaClient({
  log: ["info", "warn", "error"],
})

/* const prismaPostgres = new PostgresPrismaClient({
  log: ["info", "warn", "error"],
}) */
const prismaSqlite = new SqlitePrismaClient({
  log: ["info", "warn", "error"],
})

import fs from "node:fs"

const options = {
  schema: { type: "string" as const },
}

async function main() {
  const {
    values: { schema },
  } = parseArgs({ options })

  switch (schema) {
    case "prisma/mssql/schema.prisma":
      console.log("Seeding initial data to mssql database")
      await seedMssql(prismaMssql)
      break
    // case "prisma/postgres/schema.prisma":
    //console.log("Seeding initial data to postgres database")
    //await seedPostgres(prismaPostgres)
    //break
    case "prisma/sqlite/schema.prisma":
      console.log("Seeding initial data to sqlite database")
      await seedSqlite(prismaSqlite)
      break
    default:
      console.error(
        "Please specify a valid schema argument with the --schema parameter, such as `npx prisma db seed -- --schema prisma/mssql/schema.prisma`"
      )
      break
  }
}

main().catch(async (e) => {
  console.error(e)
  process.exit(1)
})

type PrismaClientType = MssqlPrismaClient | SqlitePrismaClient

async function seedTestUsers(prisma: PrismaClientType) {
  console.log("Seeding test users and roles...")

  // Create Admin system role
  const adminRole = await (prisma.systemRole.upsert as any)({
    where: { name: "Admin" },
    create: { name: "Admin" },
    update: {},
  })

  // Create test users
  for (const [role, email] of Object.entries(testAccounts)) {
    const [firstName, lastName] = email
      .split("@")[0]
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))

    await (prisma.user.upsert as any)({
      where: { email },
      create: {
        firstName,
        lastName,
        email,
        // Only assign admin role to the admin user
        ...(role === "admin" && {
          systemRoles: {
            connect: [{ id: adminRole.id }],
          },
        }),
      },
      update: {},
    })
  }
}

async function seedTestAssessments(prisma: PrismaClientType) {
  console.log("Seeding test collection and assessment...")

  // Get the IP2M METRR Assessment type
  const assessmentType = await prisma.assessmentType.findUnique({
    where: { name: "IP2M METRR Assessment" },
  })

  if (!assessmentType) {
    throw new Error("IP2M METRR Assessment type not found")
  }

  // Create test collection
  const testCollection = await (prisma.assessmentCollection.upsert as any)({
    where: { name: "Test Collection" },
    create: {
      name: "Test Collection",
      assessmentTypeId: assessmentType.id,
    },
    update: {},
  })

  // Find or create test assessment
  let testAssessment = await prisma.assessment.findFirst({
    where: { projectId: "TEST-001" },
  })

  if (!testAssessment) {
    testAssessment = await (prisma.assessment.create as any)({
      data: {
        projectId: "TEST-001",
        name: "Test Assessment One",
        location: "Test Location",
        date: new Date(),
        description: "A test assessment for automated testing",
        status: "Active",
        assessmentCollectionId: testCollection.id,
      },
    })
  }

  if (!testAssessment) {
    throw new Error("Failed to create test assessment")
  }

  // Get users
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: Object.values(testAccounts),
      },
    },
  })

  const usersByEmail = users.reduce((acc, user) => {
    acc[user.email] = user
    return acc
  }, {} as Record<string, typeof users[0]>)

  // Assign collection manager role
  const existingCollectionUser = await prisma.assessmentCollectionUser.findFirst({
    where: {
      assessmentCollectionId: testCollection.id,
      userId: usersByEmail[testAccounts.collectionManager].id,
    },
  })

  if (!existingCollectionUser) {
    await (prisma.assessmentCollectionUser.create as any)({
      data: {
        assessmentCollectionId: testCollection.id,
        userId: usersByEmail[testAccounts.collectionManager].id,
        role: "Collection Manager",
      },
    })
  }

  // Assign assessment roles
  const assessmentRoles = [
    { email: testAccounts.leadFacilitator, role: "Lead Facilitator" },
    { email: testAccounts.facilitator, role: "Facilitator" },
    { email: testAccounts.participant, role: "Participant" },
  ]

  for (const { email, role } of assessmentRoles) {
    const existingAssessmentUser = await prisma.assessmentUser.findFirst({
      where: {
        assessmentId: testAssessment.id,
        userId: usersByEmail[email].id,
      },
    })

    if (!existingAssessmentUser) {
      await (prisma.assessmentUser.create as any)({
        data: {
          assessmentId: testAssessment.id,
          userId: usersByEmail[email].id,
          role,
        },
      })
    }
  }
}

async function seedMssql(prisma: MssqlPrismaClient) {
  try {
    console.log("Seeding AssessmentTypes and AssessmentParts...")

    const assessmentType = await (prisma.assessmentType.upsert as any)({
      where: {
        name: "IP2M METRR Assessment",
      },
      create: {
        name: "IP2M METRR Assessment",
        description:
          "The Integrated Project/Program Management (IP2M) Maturity and Environment Total Risk Rating (METRR) using EVMS is a novel assessment mechanism developed as part of a DOE-sponsored joint research study led by Arizona State University and representing more than fifteen government and industry organizations. The tool assesses a spectrum of EVMS maturity and environment issues centered around the thirty-two EIA-748 EVMS Guidelines, while also referencing PMI's ANSI Standard for EVM (2019) and ISO 21508:2018 guidance. By using the IP2M METRR (pronounced IP2M meter) to assess both the maturity and environment of their project/program's EVMS, project leaders and personnel can understand the efficacy of their EVMS to support integrated project/program management. It also helps identify opportunities for improvement. The ultimate goal of performing this assessment is to assure project/program participants are working with accurate, timely, and reliable information to manage their work, leading to successful project/program performance.",
        parts: {
          create: [
            {
              name: "Environment",
              description: "Environment",
            },
            {
              name: "Maturity",
              description: "Maturity",
            },
          ],
        },
      },
      update: {},
    })

    console.log("Seeding Sections for IP2M METRR Assessment...")
    const sections = JSON.parse(
      fs.readFileSync("prisma/seed/ip2m_model/sections.json").toString()
    )

    for (const section of sections) {
      await (prisma.section.upsert as any)({
        where: { id: section.id },
        create: section,
        update: {},
      })
    }

    console.log("Seeding Attributes for IP2M METRR Assessment...")

    const attributes = JSON.parse(
      fs.readFileSync("prisma/seed/ip2m_model/attributes.json").toString()
    )

    for (const attribute of attributes) {
      await (prisma.attribute.upsert as any)({
        where: { id: attribute.id },
        create: attribute,
        update: {},
      })
    }

    console.log("Seeding Levels for IP2M METRR Assessment...")

    const levels = JSON.parse(
      fs.readFileSync("prisma/seed/ip2m_model/levels.json").toString()
    )

    for (const level of levels) {
      await (prisma.level.upsert as any)({
        where: { id: level.id },
        create: level,
        update: {},
      })
    }

    // Seed test users and assessments
    await seedTestUsers(prisma)
    await seedTestAssessments(prisma)
  } catch (e) {
    console.error("Error seeding database: ", e)
    prisma.$disconnect()
  }

  prisma.$disconnect()
}

async function seedSqlite(prisma: SqlitePrismaClient) {
  try {
    console.log("Seeding AssessmentTypes and AssessmentParts...")

    const assessmentType = await (prisma.assessmentType.upsert as any)({
      where: {
        name: "IP2M METRR Assessment",
      },
      create: {
        name: "IP2M METRR Assessment",
        description:
          "The Integrated Project/Program Management (IP2M) Maturity and Environment Total Risk Rating (METRR) using EVMS is a novel assessment mechanism developed as part of a DOE-sponsored joint research study led by Arizona State University and representing more than fifteen government and industry organizations. The tool assesses a spectrum of EVMS maturity and environment issues centered around the thirty-two EIA-748 EVMS Guidelines, while also referencing PMI's ANSI Standard for EVM (2019) and ISO 21508:2018 guidance. By using the IP2M METRR (pronounced IP2M meter) to assess both the maturity and environment of their project/program's EVMS, project leaders and personnel can understand the efficacy of their EVMS to support integrated project/program management. It also helps identify opportunities for improvement. The ultimate goal of performing this assessment is to assure project/program participants are working with accurate, timely, and reliable information to manage their work, leading to successful project/program performance.",
        parts: {
          create: [
            {
              name: "Environment",
              description: "Environment",
            },
            {
              name: "Maturity",
              description: "Maturity",
            },
          ],
        },
      },
      update: {},
    })

    console.log("Seeding Sections for IP2M METRR Assessment...")
    const sections = JSON.parse(
      fs.readFileSync("prisma/seed/ip2m_model/sections.json").toString()
    )

    for (const section of sections) {
      await (prisma.section.upsert as any)({
        where: { id: section.id },
        create: section,
        update: {},
      })
    }

    console.log("Seeding Attributes for IP2M METRR Assessment...")

    const attributes = JSON.parse(
      fs.readFileSync("prisma/seed/ip2m_model/attributes.json").toString()
    )

    for (const attribute of attributes) {
      await (prisma.attribute.upsert as any)({
        where: { id: attribute.id },
        create: attribute,
        update: {},
      })
    }

    console.log("Seeding Levels for IP2M METRR Assessment...")

    const levels = JSON.parse(
      fs.readFileSync("prisma/seed/ip2m_model/levels.json").toString()
    )

    for (const level of levels) {
      await (prisma.level.upsert as any)({
        where: { id: level.id },
        create: level,
        update: {},
      })
    }

    // Seed test users and assessments
    await seedTestUsers(prisma)
    await seedTestAssessments(prisma)
  } catch (e) {
    console.error("Error seeding database: ", e)
    prisma.$disconnect()
  }

  prisma.$disconnect()
}
