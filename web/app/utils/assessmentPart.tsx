"use server"

import { db } from "@/lib/db"
import type { PrismaClient } from "@/lib/db"


// This file simply re-exports the Prisma functions as server actions which allows them to be safely called client side
// In the future, appropriate role level permissions checks can be added here.

// Other Prisma functions like createMany, etc, exist and can be added here as needed

// This file should be copied for table/prisma model in our database.

export async function findMany(args: PrismaClient.Prisma.AssessmentPartFindManyArgs) {
    return await db.assessmentPart.findMany(args)
}

export async function findUnique(args: PrismaClient.Prisma.AssessmentPartFindUniqueArgs) {
    return await db.assessmentPart.findUnique(args)
}

export async function create(args: PrismaClient.Prisma.AssessmentPartCreateArgs) {
    return await db.assessmentPart.create(args)
}

export async function update(args: PrismaClient.Prisma.AssessmentPartUpdateArgs) {
    return await db.assessmentPart.update(args)
}

export async function upsert(args: PrismaClient.Prisma.AssessmentPartUpsertArgs) {
    return await db.assessmentPart.upsert(args)
}

export async function delete_(args: PrismaClient.Prisma.AssessmentPartDeleteArgs) {
    return await db.assessmentPart.delete(args)
}

