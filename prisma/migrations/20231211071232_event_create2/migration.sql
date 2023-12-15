/*
  Warnings:

  - Changed the type of `eventType` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "eventType",
ADD COLUMN     "eventType" BOOLEAN NOT NULL;
