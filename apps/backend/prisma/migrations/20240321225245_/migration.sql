/*
  Warnings:

  - Added the required column `content_type` to the `file_uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file_uploads" ADD COLUMN     "content_type" TEXT NOT NULL;
