"use server"

import { db } from "@/lib/db"
import type { PrismaClient } from "@/lib/db"


// This file simply re-exports the Prisma functions as server actions which allows them to be safely called client side
// In the future, appropriate role level permissions checks can be added here.

// Other Prisma functions like createMany, etc, exist and can be added here as needed

// This file should be copied for table/prisma model in our database.

export async function findMany(args: PrismaClient.Prisma.AttributeFindManyArgs) {
    return await db.attribute.findMany(args)
}

export async function findUnique(args: PrismaClient.Prisma.AttributeFindUniqueArgs) {
    return await db.attribute.findUnique(args)
}

export async function create(args: PrismaClient.Prisma.AttributeCreateArgs) {
    return await db.attribute.create(args)
}

export async function update(args: PrismaClient.Prisma.AttributeUpdateArgs) {
    return await db.attribute.update(args)
}

export async function upsert(args: PrismaClient.Prisma.AttributeUpsertArgs) {
    return await db.attribute.upsert(args)
}

export async function delete_(args: PrismaClient.Prisma.AttributeDeleteArgs) {
    return await db.attribute.delete(args)
}

