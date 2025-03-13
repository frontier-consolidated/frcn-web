/*
  Warnings:

  - You are about to drop the column `role_order` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `role_order_migrated` on the `settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "system"."settings" DROP COLUMN "role_order",
DROP COLUMN "role_order_migrated";
