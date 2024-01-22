-- DropForeignKey
ALTER TABLE "UserSession" DROP CONSTRAINT "UserSession_userId_fkey";

-- DropIndex
DROP INDEX "UserSession_userId_key";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "accessRoleId" TEXT,
ALTER COLUMN "eventType" DROP NOT NULL,
ALTER COLUMN "startAt" DROP NOT NULL,
ALTER COLUMN "endedAt" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserSession" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_accessRoleId_fkey" FOREIGN KEY ("accessRoleId") REFERENCES "UserRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
