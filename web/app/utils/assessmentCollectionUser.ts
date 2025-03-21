"use server"

import type { PrismaClient } from "@/lib/db"

import { db } from "@/lib/db"

// This file simply re-exports the Prisma functions as server actions which allows them to be safely called client side
// In the future, appropriate role level permissions checks can be added here.

// Other Prisma functions like createMany, etc, exist and can be added here as needed

// This file should be copied for table/prisma model in our database.

export async function findMany(
  args: PrismaClient.Prisma.AssessmentCollectionUserFindManyArgs
) {
  return await db.assessmentCollectionUser.findMany(args)
}

export async function findUnique(
  args: PrismaClient.Prisma.AssessmentCollectionUserFindUniqueArgs
) {
  return await db.assessmentCollectionUser.findUnique(args)
}

export async function create(
  args: PrismaClient.Prisma.AssessmentCollectionUserCreateArgs
) {
  return await db.assessmentCollectionUser.create(args)
}

export async function update(
  args: PrismaClient.Prisma.AssessmentCollectionUserUpdateArgs
) {
  return await db.assessmentCollectionUser.update(args)
}

export async function upsert(
  args: PrismaClient.Prisma.AssessmentCollectionUserUpsertArgs
) {
  return await db.assessmentCollectionUser.upsert(args)
}

export async function delete_(
  args: PrismaClient.Prisma.AssessmentCollectionUserDeleteArgs
) {
  return await db.assessmentCollectionUser.delete(args)
}
