-- DropForeignKey
ALTER TABLE "events"."users" DROP CONSTRAINT "users_user_id_fkey";

-- AlterTable
ALTER TABLE "events"."users" ADD COLUMN     "kicked" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "pending" SET DEFAULT false,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "events"."users" ADD CONSTRAINT "users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
