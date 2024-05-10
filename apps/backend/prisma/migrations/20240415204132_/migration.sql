-- CreateTable
CREATE TABLE "events"."ics_exports" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "only_my_events" BOOLEAN NOT NULL DEFAULT true,
    "flags" INTEGER NOT NULL,
    "access_key" TEXT NOT NULL,

    CONSTRAINT "ics_exports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "events"."ics_exports" ADD CONSTRAINT "ics_exports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
