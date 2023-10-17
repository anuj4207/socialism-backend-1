-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "description" TEXT,
ADD COLUMN     "tagUser" INTEGER[],
ADD COLUMN     "title" TEXT,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "tag" DROP NOT NULL;
