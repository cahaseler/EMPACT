"use server"

import type { PrismaClient } from "@/lib/db"

import { db } from "@/lib/db"

// This file simply re-exports the Prisma functions as server actions which allows them to be safely called client side
// In the future, appropriate role level permissions checks can be added here.

// Other Prisma functions like createMany, etc, exist and can be added here as needed

// This file should be copied for table/prisma model in our database.

export async function findMany(
  args: PrismaClient.Prisma.AssessmentUserReconciliationFindManyArgs
) {
  return await db.assessmentUserReconciliation.findMany(args)
}

export async function findUnique(
  args: PrismaClient.Prisma.AssessmentUserReconciliationFindUniqueArgs
) {
  return await db.assessmentUserReconciliation.findUnique(args)
}

export async function create(
  args: PrismaClient.Prisma.AssessmentUserReconciliationCreateArgs
) {
  return await db.assessmentUserReconciliation.create(args)
}

export async function update(
  args: PrismaClient.Prisma.AssessmentUserReconciliationUpdateArgs
) {
  return await db.assessmentUserReconciliation.update(args)
}

export async function upsert(
  args: PrismaClient.Prisma.AssessmentUserReconciliationUpsertArgs
) {
  return await db.assessmentUserReconciliation.upsert(args)
}

export async function delete_(
  args: PrismaClient.Prisma.AssessmentUserReconciliationDeleteArgs
) {
  return await db.assessmentUserReconciliation.delete(args)
}
