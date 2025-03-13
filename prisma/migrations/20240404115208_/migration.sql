/*
  Warnings:

  - A unique constraint covering the columns `[discord_category_id]` on the table `channels` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "events"."channels" ADD COLUMN     "discord_category_id" TEXT,
ADD COLUMN     "ready_room_name" TEXT;

-- AlterTable
ALTER TABLE "events"."users" ADD COLUMN     "team_id" TEXT;

-- CreateTable
CREATE TABLE "events"."teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "voice_channel_id" INTEGER NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events"."voice_channels" (
    "id" SERIAL NOT NULL,
    "discord_id" TEXT,
    "channel_id" INTEGER NOT NULL,
    "ready_room" BOOLEAN NOT NULL DEFAULT false,
    "team_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voice_channels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teams_voice_channel_id_key" ON "events"."teams"("voice_channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "voice_channels_discord_id_key" ON "events"."voice_channels"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "channels_discord_category_id_key" ON "events"."channels"("discord_category_id");

-- AddForeignKey
ALTER TABLE "events"."users" ADD CONSTRAINT "users_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "events"."teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events"."teams" ADD CONSTRAINT "teams_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events"."teams" ADD CONSTRAINT "teams_voice_channel_id_fkey" FOREIGN KEY ("voice_channel_id") REFERENCES "events"."voice_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events"."voice_channels" ADD CONSTRAINT "voice_channels_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "events"."channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
