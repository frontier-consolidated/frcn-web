/*
  Warnings:

  - Made the column `discord_id` on table `voice_channels` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "events"."voice_channels" ALTER COLUMN "discord_id" SET NOT NULL;
