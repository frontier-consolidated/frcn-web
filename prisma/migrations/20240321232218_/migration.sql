/*
  Warnings:

  - You are about to drop the column `containerId` on the `cms_container__file_link` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `cms_container__file_link` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `resources` table. All the data in the column will be lost.
  - Added the required column `container_id` to the `cms_container__file_link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_id` to the `cms_container__file_link` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cms_container__file_link" DROP CONSTRAINT "cms_container__file_link_containerId_fkey";

-- DropForeignKey
ALTER TABLE "cms_container__file_link" DROP CONSTRAINT "cms_container__file_link_fileId_fkey";

-- DropForeignKey
ALTER TABLE "resources" DROP CONSTRAINT "resources_fileId_fkey";

-- AlterTable
ALTER TABLE "cms_container__file_link" DROP COLUMN "containerId",
DROP COLUMN "fileId",
ADD COLUMN     "container_id" INTEGER NOT NULL,
ADD COLUMN     "file_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "resources" DROP COLUMN "fileId",
ADD COLUMN     "file_id" TEXT;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file_uploads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_container__file_link" ADD CONSTRAINT "cms_container__file_link_container_id_fkey" FOREIGN KEY ("container_id") REFERENCES "cms_container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_container__file_link" ADD CONSTRAINT "cms_container__file_link_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "file_uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
