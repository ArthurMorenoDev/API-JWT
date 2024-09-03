/*
  Warnings:

  - Added the required column `datePay` to the `data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `data` ADD COLUMN `datePay` DATETIME(3) NOT NULL;
