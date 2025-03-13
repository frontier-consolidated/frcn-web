/*
  Warnings:

  - You are about to drop the column `end_reminder_sent` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events"."events" DROP COLUMN "end_reminder_sent";
