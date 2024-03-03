-- DropForeignKey
ALTER TABLE "event_rsvp_roles" DROP CONSTRAINT "event_rsvp_roles_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_settings" DROP CONSTRAINT "event_settings_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_users" DROP CONSTRAINT "event_users_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_users" DROP CONSTRAINT "event_users_user_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "events__user_roles" DROP CONSTRAINT "events__user_roles_event_id_fkey";

-- DropForeignKey
ALTER TABLE "events__user_roles" DROP CONSTRAINT "events__user_roles_role_id_fkey";

-- DropForeignKey
ALTER TABLE "resources" DROP CONSTRAINT "resources_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "users__user_roles" DROP CONSTRAINT "users__user_roles_role_id_fkey";

-- DropForeignKey
ALTER TABLE "users__user_roles" DROP CONSTRAINT "users__user_roles_user_id_fkey";

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "owner_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "resources" ALTER COLUMN "owner_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users__user_roles" ADD CONSTRAINT "users__user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users__user_roles" ADD CONSTRAINT "users__user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rsvp_roles" ADD CONSTRAINT "event_rsvp_roles_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_users" ADD CONSTRAINT "event_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_users" ADD CONSTRAINT "event_users_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_settings" ADD CONSTRAINT "event_settings_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events__user_roles" ADD CONSTRAINT "events__user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events__user_roles" ADD CONSTRAINT "events__user_roles_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
