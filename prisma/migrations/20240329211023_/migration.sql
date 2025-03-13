-- DropForeignKey
ALTER TABLE "user"."sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user"."settings" DROP CONSTRAINT "settings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user"."statuses" DROP CONSTRAINT "statuses_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."settings" ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."statuses" ADD CONSTRAINT "statuses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
