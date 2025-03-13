/*
  Warnings:

  - You are about to alter the column `content` on the `container` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.

*/
-- AlterTable
ALTER TABLE "cms"."container" ALTER COLUMN "content" SET DATA TYPE VARCHAR(2048);
