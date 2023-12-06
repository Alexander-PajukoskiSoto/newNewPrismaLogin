/*
  Warnings:

  - Added the required column `shownName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Post_authorId_fkey` ON `Post`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `shownName` VARCHAR(191) NOT NULL;
