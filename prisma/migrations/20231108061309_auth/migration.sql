/*
  Warnings:

  - Added the required column `number` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "number" INTEGER NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "hash" DROP NOT NULL;
