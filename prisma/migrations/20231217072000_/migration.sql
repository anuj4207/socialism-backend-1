/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_number_key" ON "users"("number");
