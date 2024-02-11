/*
  Warnings:

  - You are about to drop the column `discordMentions` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "discordMentions",
ADD COLUMN     "discord_mentions" TEXT[];
