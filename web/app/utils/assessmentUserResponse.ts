"use server"

import { db } from "@/lib/db"
import type { PrismaClient } from "@/lib/db"


// This file simply re-exports the Prisma functions as server actions which allows them to be safely called client side
// In the future, appropriate role level permissions checks can be added here.

// Other Prisma functions like createMany, etc, exist and can be added here as needed

// This file should be copied for table/prisma model in our database.

export async function findMany(args: PrismaClient.Prisma.AssessmentUserResponseFindManyArgs) {
    return await db.assessmentUserResponse.findMany(args)
}

export async function findUnique(args: PrismaClient.Prisma.AssessmentUserResponseFindUniqueArgs) {
    return await db.assessmentUserResponse.findUnique(args)
}

export async function create(args: PrismaClient.Prisma.AssessmentUserResponseCreateArgs) {
    return await db.assessmentUserResponse.create(args)
}

export async function update(args: PrismaClient.Prisma.AssessmentUserResponseUpdateArgs) {
    return await db.assessmentUserResponse.update(args)
}

export async function upsert(args: PrismaClient.Prisma.AssessmentUserResponseUpsertArgs) {
    return await db.assessmentUserResponse.upsert(args)
}

export async function delete_(args: PrismaClient.Prisma.AssessmentUserResponseDeleteArgs) {
    return await db.assessmentUserResponse.delete(args)
}

