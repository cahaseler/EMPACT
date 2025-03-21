"use server"

import type { PrismaClient } from "@/lib/db"

import { db } from "@/lib/db"

// This file simply re-exports the Prisma functions as server actions which allows them to be safely called client side
// In the future, appropriate role level permissions checks can be added here.

// Other Prisma functions like createMany, etc, exist and can be added here as needed

// This file should be copied for table/prisma model in our database.

export async function findMany(args: PrismaClient.Prisma.PartFindManyArgs) {
  return await db.part.findMany(args)
}

export async function findUnique(args: PrismaClient.Prisma.PartFindUniqueArgs) {
  return await db.part.findUnique(args)
}

export async function create(args: PrismaClient.Prisma.PartCreateArgs) {
  return await db.part.create(args)
}

export async function update(args: PrismaClient.Prisma.PartUpdateArgs) {
  return await db.part.update(args)
}

export async function upsert(args: PrismaClient.Prisma.PartUpsertArgs) {
  return await db.part.upsert(args)
}

export async function delete_(args: PrismaClient.Prisma.PartDeleteArgs) {
  return await db.part.delete(args)
}
