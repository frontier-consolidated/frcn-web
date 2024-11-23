-- AlterTable
ALTER TABLE "events"."rsvp_roles" ADD COLUMN     "discord_thread_id" TEXT;

-- AlterTable
ALTER TABLE "events"."settings" ADD COLUMN     "create_threads_for_roles" BOOLEAN NOT NULL DEFAULT false;
