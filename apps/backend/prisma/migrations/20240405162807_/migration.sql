-- AlterTable
ALTER TABLE "events"."events" ADD COLUMN     "expired" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "posted" SET DEFAULT false;
