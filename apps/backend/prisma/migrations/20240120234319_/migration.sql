/*
  Warnings:

  - You are about to alter the column `description` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(4096)`.
  - You are about to drop the column `streamerMode` on the `UserSettings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[discordId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discordId]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `avatarUrl` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "description" SET DATA TYPE VARCHAR(4096);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "streamerMode";

-- CreateTable
CREATE TABLE "UserSession" (
    "sid" TEXT NOT NULL,
    "data" VARCHAR(4096) NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_userId_key" ON "UserSession"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_discordId_key" ON "UserRole"("discordId");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
