/*
  Warnings:

  - You are about to drop the column `long_description` on the `Level` table. All the data in the column will be lost.
  - You are about to drop the column `short_description` on the `Level` table. All the data in the column will be lost.
  - You are about to drop the column `assessmentTypesId` on the `Part` table. All the data in the column will be lost.
  - Added the required column `assessmentTypeId` to the `AssessmentCollection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `AssessmentType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longDescription` to the `Level` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `Level` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assessmentTypeId` to the `Part` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AssessmentCollection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "assessmentTypeId" INTEGER NOT NULL,
    CONSTRAINT "AssessmentCollection_assessmentTypeId_fkey" FOREIGN KEY ("assessmentTypeId") REFERENCES "AssessmentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AssessmentCollection" ("id", "name") SELECT "id", "name" FROM "AssessmentCollection";
DROP TABLE "AssessmentCollection";
ALTER TABLE "new_AssessmentCollection" RENAME TO "AssessmentCollection";
CREATE UNIQUE INDEX "AssessmentCollection_name_key" ON "AssessmentCollection"("name");
CREATE TABLE "new_AssessmentType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_AssessmentType" ("id", "name") SELECT "id", "name" FROM "AssessmentType";
DROP TABLE "AssessmentType";
ALTER TABLE "new_AssessmentType" RENAME TO "AssessmentType";
CREATE UNIQUE INDEX "AssessmentType_name_key" ON "AssessmentType"("name");
CREATE TABLE "new_AssessmentUserResponse" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "assessmentId" INTEGER NOT NULL,
    "attributeId" TEXT NOT NULL,
    "levelId" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    CONSTRAINT "AssessmentUserResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AssessmentUserResponse_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AssessmentUserResponse_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "AssessmentUserResponse_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AssessmentUserResponse" ("assessmentId", "attributeId", "id", "levelId", "notes", "userId") SELECT "assessmentId", "attributeId", "id", "levelId", "notes", "userId" FROM "AssessmentUserResponse";
DROP TABLE "AssessmentUserResponse";
ALTER TABLE "new_AssessmentUserResponse" RENAME TO "AssessmentUserResponse";
CREATE TABLE "new_Level" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "attributeId" TEXT NOT NULL,
    CONSTRAINT "Level_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Level" ("attributeId", "id", "level", "weight") SELECT "attributeId", "id", "level", "weight" FROM "Level";
DROP TABLE "Level";
ALTER TABLE "new_Level" RENAME TO "Level";
CREATE TABLE "new_Part" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assessmentTypeId" INTEGER NOT NULL,
    CONSTRAINT "Part_assessmentTypeId_fkey" FOREIGN KEY ("assessmentTypeId") REFERENCES "AssessmentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Part" ("description", "id", "name") SELECT "description", "id", "name" FROM "Part";
DROP TABLE "Part";
ALTER TABLE "new_Part" RENAME TO "Part";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
