"use server"

import type { PrismaClient } from "@/lib/db"

import { db } from "@/lib/db"

// This file simply re-exports the Prisma functions as server actions which allows them to be safely called client side
// In the future, appropriate role level permissions checks can be added here.

// Other Prisma functions like createMany, etc, exist and can be added here as needed

// This file should be copied for table/prisma model in our database.

export async function findMany(
  args: PrismaClient.Prisma.AssessmentTypeFindManyArgs
) {
  return await db.assessmentType.findMany(args)
}

export async function findUnique(
  args: PrismaClient.Prisma.AssessmentTypeFindUniqueArgs
) {
  return await db.assessmentType.findUnique(args)
}

export async function create(
  args: PrismaClient.Prisma.AssessmentTypeCreateArgs
) {
  return await db.assessmentType.create(args)
}

export async function update(
  args: PrismaClient.Prisma.AssessmentTypeUpdateArgs
) {
  return await db.assessmentType.update(args)
}

export async function upsert(
  args: PrismaClient.Prisma.AssessmentTypeUpsertArgs
) {
  return await db.assessmentType.upsert(args)
}

export async function delete_(
  args: PrismaClient.Prisma.AssessmentTypeDeleteArgs
) {
  return await db.assessmentType.delete(args)
}
