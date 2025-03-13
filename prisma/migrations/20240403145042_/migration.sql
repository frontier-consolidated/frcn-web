-- AlterTable
ALTER TABLE "events"."events" ADD COLUMN     "archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "archived_at" TIMESTAMP(3);
