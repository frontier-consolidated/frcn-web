/*
  Warnings:

  - Added the required column `discordName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "discordName" TEXT NOT NULL,
ALTER COLUMN "scName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserStatus" ALTER COLUMN "activity" DROP NOT NULL,
ALTER COLUMN "ship" DROP NOT NULL;
