/*
  Warnings:

  - Added the required column `config_name` to the `ics_exports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events"."ics_exports" ADD COLUMN     "config_name" TEXT NOT NULL;
