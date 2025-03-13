/*
  Warnings:

  - You are about to drop the column `team_id` on the `voice_channels` table. All the data in the column will be lost.
  - The primary key for the `sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `device_id` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `sid` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `teams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events"."teams" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "events"."voice_channels" DROP COLUMN "team_id";

-- AlterTable
ALTER TABLE "user"."sessions" DROP CONSTRAINT "sessions_pkey",
DROP COLUMN "device_id",
DROP COLUMN "sid",
ADD COLUMN     "key" TEXT NOT NULL,
ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("key");

-- AlterTable
ALTER TABLE "user"."users" ADD COLUMN     "discord_access_token" TEXT,
ADD COLUMN     "discord_expires_at" TIMESTAMP(3),
ADD COLUMN     "discord_refresh_token" TEXT,
ADD COLUMN     "discord_required_scopes" TEXT[],
ADD COLUMN     "discord_token_duration" DOUBLE PRECISION,
ADD COLUMN     "discord_token_scopes" TEXT[],
ADD COLUMN     "email" TEXT NOT NULL;
