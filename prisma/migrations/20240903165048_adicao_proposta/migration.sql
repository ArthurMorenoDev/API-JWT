/*
  Warnings:

  - A unique constraint covering the columns `[proposta]` on the table `data` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `proposta` to the `data` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `data` ADD COLUMN `proposta` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `data_proposta_key` ON `data`(`proposta`);
