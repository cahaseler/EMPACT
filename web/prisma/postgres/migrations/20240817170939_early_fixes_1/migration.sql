/*
  Warnings:

  - You are about to drop the column `long_description` on the `Level` table. All the data in the column will be lost.
  - You are about to drop the column `short_description` on the `Level` table. All the data in the column will be lost.
  - Added the required column `assessmentTypeId` to the `AssessmentCollection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `AssessmentType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longDescription` to the `Level` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortDescription` to the `Level` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssessmentCollection" ADD COLUMN     "assessmentTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "AssessmentType" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Level" DROP COLUMN "long_description",
DROP COLUMN "short_description",
ADD COLUMN     "longDescription" TEXT NOT NULL,
ADD COLUMN     "shortDescription" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AssessmentCollection" ADD CONSTRAINT "AssessmentCollection_assessmentTypeId_fkey" FOREIGN KEY ("assessmentTypeId") REFERENCES "AssessmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
