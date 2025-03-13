/*
  Warnings:

  - You are about to drop the column `file_attached` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `file_name` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `file_size_kb` on the `resources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "resources" DROP COLUMN "file_attached",
DROP COLUMN "file_name",
DROP COLUMN "file_size_kb",
ADD COLUMN     "fileId" TEXT;

-- CreateTable
CREATE TABLE "file_uploads" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "owner_id" TEXT,
    "file_name" TEXT,
    "file_size_kb" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_container" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "children_order" TEXT[],
    "parent_id" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cms_container_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms_container__file_link" (
    "id" SERIAL NOT NULL,
    "containerId" INTEGER NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "cms_container__file_link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cms_container_identifier_key" ON "cms_container"("identifier");

-- AddForeignKey
ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file_uploads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_container" ADD CONSTRAINT "cms_container_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "cms_container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_container__file_link" ADD CONSTRAINT "cms_container__file_link_containerId_fkey" FOREIGN KEY ("containerId") REFERENCES "cms_container"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms_container__file_link" ADD CONSTRAINT "cms_container__file_link_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file_uploads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
