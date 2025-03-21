"use server"

import type { PrismaClient } from "@/lib/db"

import { db } from "@/lib/db"

// This file simply re-exports the Prisma functions as server actions which allows them to be safely called client side
// In the future, appropriate role level permissions checks can be added here.

// Other Prisma functions like createMany, etc, exist and can be added here as needed

// This file should be copied for table/prisma model in our database.

export async function findMany(
  args: PrismaClient.Prisma.AssessmentUserGroupFindManyArgs
) {
  return await db.assessmentUserGroup.findMany(args)
}

export async function findUnique(
  args: PrismaClient.Prisma.AssessmentUserGroupFindUniqueArgs
) {
  return await db.assessmentUserGroup.findUnique(args)
}

export async function create(
  args: PrismaClient.Prisma.AssessmentUserGroupCreateArgs
) {
  return await db.assessmentUserGroup.create(args)
}

export async function update(
  args: PrismaClient.Prisma.AssessmentUserGroupUpdateArgs
) {
  return await db.assessmentUserGroup.update(args)
}

export async function upsert(
  args: PrismaClient.Prisma.AssessmentUserGroupUpsertArgs
) {
  return await db.assessmentUserGroup.upsert(args)
}

export async function delete_(
  args: PrismaClient.Prisma.AssessmentUserGroupDeleteArgs
) {
  return await db.assessmentUserGroup.delete(args)
}
