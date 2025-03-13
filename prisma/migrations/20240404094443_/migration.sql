/*
  Warnings:

  - You are about to drop the column `allow_team_switching` on the `settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events"."settings" DROP COLUMN "allow_team_switching";
