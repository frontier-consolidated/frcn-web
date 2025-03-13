/*
  Warnings:

  - The primary key for the `container__file_uploads` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `container__file_uploads` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identifier,container_id]` on the table `container__file_uploads` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "cms"."container" ADD COLUMN     "files_order" TEXT[];

-- AlterTable
ALTER TABLE "cms"."container__file_uploads" DROP CONSTRAINT "container__file_uploads_pkey",
DROP COLUMN "id",
ADD COLUMN     "identifier" TEXT,
ADD CONSTRAINT "container__file_uploads_pkey" PRIMARY KEY ("container_id", "file_id");

-- CreateIndex
CREATE UNIQUE INDEX "container__file_uploads_identifier_container_id_key" ON "cms"."container__file_uploads"("identifier", "container_id");
