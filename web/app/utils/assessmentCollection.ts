"use server"

import type { PrismaClient } from "@/lib/db"

import { db } from "@/lib/db"

// This file simply re-exports the Prisma functions as server actions which allows them to be safely called client side
// In the future, appropriate role level permissions checks can be added here.

// Other Prisma functions like createMany, etc, exist and can be added here as needed

// This file should be copied for table/prisma model in our database.

export async function findMany(
  args: PrismaClient.Prisma.AssessmentCollectionFindManyArgs
) {
  return await db.assessmentCollection.findMany(args)
}

export async function findUnique(
  args: PrismaClient.Prisma.AssessmentCollectionFindUniqueArgs
) {
  return await db.assessmentCollection.findUnique(args)
}

export async function create(
  args: PrismaClient.Prisma.AssessmentCollectionCreateArgs
) {
  return await db.assessmentCollection.create(args)
}

export async function update(
  args: PrismaClient.Prisma.AssessmentCollectionUpdateArgs
) {
  return await db.assessmentCollection.update(args)
}

export async function upsert(
  args: PrismaClient.Prisma.AssessmentCollectionUpsertArgs
) {
  return await db.assessmentCollection.upsert(args)
}

export async function delete_(
  args: PrismaClient.Prisma.AssessmentCollectionDeleteArgs
) {
  return await db.assessmentCollection.delete(args)
}
