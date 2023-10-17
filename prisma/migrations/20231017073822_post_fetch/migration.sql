/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Event";

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "schedule" TIMESTAMP(3) NOT NULL,
    "maxMembers" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "pendingUser" INTEGER[],
    "confirmedUser" INTEGER[],

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
