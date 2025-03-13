-- DropForeignKey
ALTER TABLE "EventUser" DROP CONSTRAINT "EventUser_rsvpId_fkey";

-- AlterTable
ALTER TABLE "EventUser" ALTER COLUMN "rsvpId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EventUser" ADD CONSTRAINT "EventUser_rsvpId_fkey" FOREIGN KEY ("rsvpId") REFERENCES "EventRsvpRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
