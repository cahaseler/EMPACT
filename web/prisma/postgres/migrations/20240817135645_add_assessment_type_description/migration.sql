/*
  Warnings:

  - You are about to drop the column `assessmentTypesId` on the `Part` table. All the data in the column will be lost.
  - Added the required column `assessmentTypeId` to the `Part` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Part" DROP CONSTRAINT "Part_assessmentTypesId_fkey";

-- AlterTable
ALTER TABLE "Part" DROP COLUMN "assessmentTypesId",
ADD COLUMN     "assessmentTypeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_assessmentTypeId_fkey" FOREIGN KEY ("assessmentTypeId") REFERENCES "AssessmentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
