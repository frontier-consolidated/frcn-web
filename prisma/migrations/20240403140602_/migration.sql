/*
  Warnings:

  - You are about to drop the column `discord_start_message_id` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events"."events" DROP COLUMN "discord_start_message_id";
