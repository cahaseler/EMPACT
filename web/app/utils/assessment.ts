"use server"

import type { PrismaClient } from "@/lib/db"

import { db } from "@/lib/db"

// This file simply re-exports the Prisma functions as server actions which allows them to be safely called client side
// In the future, appropriate role level permissions checks can be added here.

// Other Prisma functions like createMany, etc, exist and can be added here as needed

// This file should be copied for table/prisma model in our database.

export async function findMany(
  args: PrismaClient.Prisma.AssessmentFindManyArgs
) {
  return await db.assessment.findMany(args)
}

export async function findUnique(
  args: PrismaClient.Prisma.AssessmentFindUniqueArgs
) {
  return await db.assessment.findUnique(args)
}

export async function create(args: PrismaClient.Prisma.AssessmentCreateArgs) {
  return await db.assessment.create(args)
}

export async function update(args: PrismaClient.Prisma.AssessmentUpdateArgs) {
  return await db.assessment.update(args)
}

export async function upsert(args: PrismaClient.Prisma.AssessmentUpsertArgs) {
  return await db.assessment.upsert(args)
}

export async function delete_(args: PrismaClient.Prisma.AssessmentDeleteArgs) {
  return await db.assessment.delete(args)
}
