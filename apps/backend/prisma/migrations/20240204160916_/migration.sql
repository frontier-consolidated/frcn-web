/*
  Warnings:

  - Added the required column `shortDescription` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "shortDescription" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[];
