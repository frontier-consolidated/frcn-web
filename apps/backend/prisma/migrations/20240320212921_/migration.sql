-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_channel_id_fkey";

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "channel_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "event_channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
