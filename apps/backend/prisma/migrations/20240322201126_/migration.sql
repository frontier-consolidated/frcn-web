/*
  Warnings:

  - The primary key for the `container` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `container__file_uploads` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "cms"."container" DROP CONSTRAINT "container_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "cms"."container__file_uploads" DROP CONSTRAINT "container__file_uploads_container_id_fkey";

-- AlterTable
ALTER TABLE "cms"."container" DROP CONSTRAINT "container_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "parent_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "container_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "cms"."container__file_uploads" DROP CONSTRAINT "container__file_uploads_pkey",
ALTER COLUMN "container_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "container__file_uploads_pkey" PRIMARY KEY ("container_id", "file_id");

-- AddForeignKey
ALTER TABLE "cms"."container" ADD CONSTRAINT "container_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "cms"."container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms"."container__file_uploads" ADD CONSTRAINT "container__file_uploads_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "cms"."container"("id") ON DELETE CASCADE ON UPDATE CASCADE;
