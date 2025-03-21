"use server"

import type { PrismaClient } from "@/lib/db"

import { db } from "@/lib/db"

// This file simply re-exports the Prisma functions as server actions which allows them to be safely called client side
// In the future, appropriate role level permissions checks can be added here.

// Other Prisma functions like createMany, etc, exist and can be added here as needed

// This file should be copied for table/prisma model in our database.

export async function findMany(args: PrismaClient.Prisma.LevelFindManyArgs) {
  return await db.level.findMany(args)
}

export async function findUnique(
  args: PrismaClient.Prisma.LevelFindUniqueArgs
) {
  return await db.level.findUnique(args)
}

export async function create(args: PrismaClient.Prisma.LevelCreateArgs) {
  return await db.level.create(args)
}

export async function update(args: PrismaClient.Prisma.LevelUpdateArgs) {
  return await db.level.update(args)
}

export async function upsert(args: PrismaClient.Prisma.LevelUpsertArgs) {
  return await db.level.upsert(args)
}

export async function delete_(args: PrismaClient.Prisma.LevelDeleteArgs) {
  return await db.level.delete(args)
}
