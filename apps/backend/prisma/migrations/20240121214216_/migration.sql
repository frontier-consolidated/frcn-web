/*
  Warnings:

  - You are about to drop the column `discordChannelId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `defaultDiscordChannelId` on the `SystemSettings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[defaultEventChannelId]` on the table `SystemSettings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `channelId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultEventChannelId` to the `SystemSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "discordChannelId",
ADD COLUMN     "channelId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SystemSettings" DROP COLUMN "defaultDiscordChannelId",
ADD COLUMN     "defaultEventChannelId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "EventChannel" (
    "id" SERIAL NOT NULL,
    "discordId" TEXT NOT NULL,

    CONSTRAINT "EventChannel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventChannel_discordId_key" ON "EventChannel"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSettings_defaultEventChannelId_key" ON "SystemSettings"("defaultEventChannelId");

-- AddForeignKey
ALTER TABLE "SystemSettings" ADD CONSTRAINT "SystemSettings_defaultEventChannelId_fkey" FOREIGN KEY ("defaultEventChannelId") REFERENCES "EventChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "EventChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
