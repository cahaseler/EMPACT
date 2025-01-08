/*
  Warnings:

  - The primary key for the `Level` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `firstnName` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "AssessmentCollectionUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "role" TEXT NOT NULL,
    "assessmentCollectionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "AssessmentCollectionUser_assessmentCollectionId_fkey" FOREIGN KEY ("assessmentCollectionId") REFERENCES "AssessmentCollection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AssessmentCollectionUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Level" (
    "id" INTEGER NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "attributeId" TEXT NOT NULL,
    CONSTRAINT "Level_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Level" ("attributeId", "id", "level", "longDescription", "shortDescription", "weight") SELECT "attributeId", "id", "level", "longDescription", "shortDescription", "weight" FROM "Level";
DROP TABLE "Level";
ALTER TABLE "new_Level" RENAME TO "Level";
CREATE UNIQUE INDEX "Level_id_key" ON "Level"("id");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "lastName") SELECT "email", "id", "lastName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
