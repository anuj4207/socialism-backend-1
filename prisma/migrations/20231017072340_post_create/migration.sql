/*
  Warnings:

  - Made the column `groupId` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_groupId_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "groupId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
