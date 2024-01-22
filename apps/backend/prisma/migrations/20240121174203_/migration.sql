/*
  Warnings:

  - You are about to drop the column `accessRoleId` on the `Event` table. All the data in the column will be lost.
  - Added the required column `accessType` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discordChannelId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultDiscordChannelId` to the `SystemSettings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_accessRoleId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "accessRoleId",
ADD COLUMN     "accessType" TEXT NOT NULL,
ADD COLUMN     "discordChannelId" TEXT NOT NULL,
ADD COLUMN     "discordMessageId" TEXT;

-- AlterTable
ALTER TABLE "SystemSettings" ADD COLUMN     "defaultDiscordChannelId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "EventsWithUserRoleForAccess" (
    "roleId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventsWithUserRoleForAccess_pkey" PRIMARY KEY ("roleId","eventId")
);

-- AddForeignKey
ALTER TABLE "EventsWithUserRoleForAccess" ADD CONSTRAINT "EventsWithUserRoleForAccess_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "UserRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsWithUserRoleForAccess" ADD CONSTRAINT "EventsWithUserRoleForAccess_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
