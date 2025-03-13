-- DropForeignKey
ALTER TABLE "SystemSettings" DROP CONSTRAINT "SystemSettings_defaultEventChannelId_fkey";

-- AlterTable
ALTER TABLE "SystemSettings" ALTER COLUMN "defaultEventChannelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SystemSettings" ADD CONSTRAINT "SystemSettings_defaultEventChannelId_fkey" FOREIGN KEY ("defaultEventChannelId") REFERENCES "EventChannel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
