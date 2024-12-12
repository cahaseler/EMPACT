"use server"

import { db } from "@/lib/db"
import type { PrismaClient } from "@/lib/db"


// This file simply re-exports the Prisma functions as server actions which allows them to be safely called client side
// In the future, appropriate role level permissions checks can be added here.

// Other Prisma functions like createMany, etc, exist and can be added here as needed

// This file should be copied for table/prisma model in our database.

export async function findMany(args: PrismaClient.Prisma.SectionFindManyArgs) {
    return await db.section.findMany(args)
}

export async function findUnique(args: PrismaClient.Prisma.SectionFindUniqueArgs) {
    return await db.section.findUnique(args)
}

export async function create(args: PrismaClient.Prisma.SectionCreateArgs) {
    return await db.section.create(args)
}

export async function update(args: PrismaClient.Prisma.SectionUpdateArgs) {
    return await db.section.update(args)
}

export async function upsert(args: PrismaClient.Prisma.SectionUpsertArgs) {
    return await db.section.upsert(args)
}

export async function delete_(args: PrismaClient.Prisma.SectionDeleteArgs) {
    return await db.section.delete(args)
}

