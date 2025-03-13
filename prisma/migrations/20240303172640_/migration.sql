/*
  Warnings:

  - You are about to drop the column `allow_crew_switching` on the `event_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event_settings" DROP COLUMN "allow_crew_switching";
