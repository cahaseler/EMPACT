import { parseArgs } from "node:util"
import { PrismaClient as MssqlPrismaClient } from "./mssql/generated/client"
//import { PrismaClient as PostgresPrismaClient } from "./postgres/generated/client"
import { PrismaClient as SqlitePrismaClient } from "./sqlite/generated/client"

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

async function seedMssql(prisma: MssqlPrismaClient) {
  try {
    console.log("Seeding AssessmentTypes and AssessmentParts...")

    await prisma.assessmentType.upsert({
      where: {
        name: "IP2M METRR Assessment",
      },
      create: {
        name: "IP2M METRR Assessment",
        description:
          "The Integrated Project/Program Management (IP2M) Maturity and Environment Total Risk Rating (METRR) using EVMS is a novel assessment mechanism developed as part of a DOE-sponsored joint research study led by Arizona State University and representing more than fifteen government and industry organizations. The tool assesses a spectrum of EVMS maturity and environment issues centered around the thirty-two EIA-748 EVMS Guidelines, while also referencing PMI's ANSI Standard for EVM (2019) and ISO 21508:2018 guidance. By using the IP2M METRR (pronounced “IP2M meter”) to assess both the maturity and environment of their project/program’s EVMS, project leaders and personnel can understand the efficacy of their EVMS to support integrated project/program management. It also helps identify opportunities for improvement. The ultimate goal of performing this assessment is to assure project/program participants are working with accurate, timely, and reliable information to manage their work, leading to successful project/program performance.",
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
      await prisma.section.upsert({
        where: {
          id: section.id,
        },
        create: section,
        update: {},
      })
    }

    console.log("Seeding Attributes for IP2M METRR Assessment...")

    const attributes = JSON.parse(
      fs.readFileSync("prisma/seed/ip2m_model/attributes.json").toString()
    )

    for (const attribute of attributes) {
      await prisma.attribute.upsert({
        where: {
          id: attribute.id,
        },
        create: attribute,
        update: {},
      })
    }

    console.log("Seeding Levels for IP2M METRR Assessment...")

    const levels = JSON.parse(
      fs.readFileSync("prisma/seed/ip2m_model/levels.json").toString()
    )

    for (const level of levels) {
      await prisma.level.upsert({
        where: {
          id: level.id,
        },
        create: level,
        update: {},
      })
    }
  } catch (e) {
    console.error("Error seeding database: ", e)
    prisma.$disconnect()
  }

  prisma.$disconnect()
}
/* 
async function seedPostgres(prisma: PostgresPrismaClient) {
  try {
    console.log("Seeding AssessmentTypes and AssessmentParts...")

    await prisma.assessmentType.upsert({
      where: {
        name: "IP2M METRR Assessment",
      },
      create: {
        name: "IP2M METRR Assessment",
        description:
          "The Integrated Project/Program Management (IP2M) Maturity and Environment Total Risk Rating (METRR) using EVMS is a novel assessment mechanism developed as part of a DOE-sponsored joint research study led by Arizona State University and representing more than fifteen government and industry organizations. The tool assesses a spectrum of EVMS maturity and environment issues centered around the thirty-two EIA-748 EVMS Guidelines, while also referencing PMI’s ANSI Standard for EVM (2019) and ISO 21508:2018 guidance. By using the IP2M METRR (pronounced “IP2M meter”) to assess both the maturity and environment of their project/program’s EVMS, project leaders and personnel can understand the efficacy of their EVMS to support integrated project/program management. It also helps identify opportunities for improvement. The ultimate goal of performing this assessment is to assure project/program participants are working with accurate, timely, and reliable information to manage their work, leading to successful project/program performance.",
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
      await prisma.section.upsert({
        where: {
          id: section.id,
        },
        create: section,
        update: {},
      })
    }

    console.log("Seeding Attributes for IP2M METRR Assessment...")

    const attributes = JSON.parse(
      fs.readFileSync("prisma/seed/ip2m_model/attributes.json").toString()
    )

    for (const attribute of attributes) {
      await prisma.attribute.upsert({
        where: {
          id: attribute.id,
        },
        create: attribute,
        update: {},
      })
    }

    console.log("Seeding Levels for IP2M METRR Assessment...")

    const levels = JSON.parse(
      fs.readFileSync("prisma/seed/ip2m_model/levels.json").toString()
    )

    for (const level of levels) {
      await prisma.level.upsert({
        where: {
          id: level.id,
        },
        create: level,
        update: {},
      })
    }
  } catch (e) {
    console.error("Error seeding database: ", e)
    prisma.$disconnect()
  }

  prisma.$disconnect()
}
 */
async function seedSqlite(prisma: SqlitePrismaClient) {
  try {
    console.log("Seeding AssessmentTypes and AssessmentParts...")

    await prisma.assessmentType.upsert({
      where: {
        name: "IP2M METRR Assessment",
      },
      create: {
        name: "IP2M METRR Assessment",
        description:
          "The Integrated Project/Program Management (IP2M) Maturity and Environment Total Risk Rating (METRR) using EVMS is a novel assessment mechanism developed as part of a DOE-sponsored joint research study led by Arizona State University and representing more than fifteen government and industry organizations. The tool assesses a spectrum of EVMS maturity and environment issues centered around the thirty-two EIA-748 EVMS Guidelines, while also referencing PMI’s ANSI Standard for EVM (2019) and ISO 21508:2018 guidance. By using the IP2M METRR (pronounced “IP2M meter”) to assess both the maturity and environment of their project/program’s EVMS, project leaders and personnel can understand the efficacy of their EVMS to support integrated project/program management. It also helps identify opportunities for improvement. The ultimate goal of performing this assessment is to assure project/program participants are working with accurate, timely, and reliable information to manage their work, leading to successful project/program performance.",
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
      await prisma.section.upsert({
        where: {
          id: section.id,
        },
        create: section,
        update: {},
      })
    }

    console.log("Seeding Attributes for IP2M METRR Assessment...")

    const attributes = JSON.parse(
      fs.readFileSync("prisma/seed/ip2m_model/attributes.json").toString()
    )

    for (const attribute of attributes) {
      await prisma.attribute.upsert({
        where: {
          id: attribute.id,
        },
        create: attribute,
        update: {},
      })
    }

    console.log("Seeding Levels for IP2M METRR Assessment...")

    const levels = JSON.parse(
      fs.readFileSync("prisma/seed/ip2m_model/levels.json").toString()
    )

    for (const level of levels) {
      await prisma.level.upsert({
        where: {
          id: level.id,
        },
        create: level,
        update: {},
      })
    }
  } catch (e) {
    console.error("Error seeding database: ", e)
    prisma.$disconnect()
  }

  prisma.$disconnect()
}
