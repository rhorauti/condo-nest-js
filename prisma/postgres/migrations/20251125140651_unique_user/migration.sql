/*
  Warnings:

  - You are about to drop the column `birthDate` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "UQ_user_name";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "birthDate";
