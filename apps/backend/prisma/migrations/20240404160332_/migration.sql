/*
  Warnings:

  - Made the column `discord_category_id` on table `channels` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "events"."channels_discord_category_id_key";

-- AlterTable
ALTER TABLE "events"."channels" ALTER COLUMN "discord_category_id" SET NOT NULL;
