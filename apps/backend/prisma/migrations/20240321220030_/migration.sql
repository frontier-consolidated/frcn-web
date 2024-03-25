/*
  Warnings:

  - Made the column `file_name` on table `file_uploads` required. This step will fail if there are existing NULL values in that column.
  - Made the column `file_size_kb` on table `file_uploads` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "file_uploads" ALTER COLUMN "file_name" SET NOT NULL,
ALTER COLUMN "file_size_kb" SET NOT NULL;
