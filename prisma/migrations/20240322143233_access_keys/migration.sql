-- CreateTable
CREATE TABLE "system"."access_keys" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "hashed_key" TEXT NOT NULL,
    "permissions" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "access_keys_hashed_key_key" ON "system"."access_keys"("hashed_key");
