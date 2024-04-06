-- DropForeignKey
ALTER TABLE "events"."voice_channels" DROP CONSTRAINT "voice_channels_channel_id_fkey";

-- AddForeignKey
ALTER TABLE "events"."voice_channels" ADD CONSTRAINT "voice_channels_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "events"."channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
