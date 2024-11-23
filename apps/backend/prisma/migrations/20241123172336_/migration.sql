/*
  Warnings:

  - A unique constraint covering the columns `[event_id,user_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_event_id_user_id_key" ON "events"."users"("event_id", "user_id");
