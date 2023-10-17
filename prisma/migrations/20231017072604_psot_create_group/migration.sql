-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_groupId_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "groupId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
