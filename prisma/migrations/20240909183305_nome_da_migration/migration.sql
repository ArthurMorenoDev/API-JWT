/*
  Warnings:

  - Added the required column `codigo` to the `tabulacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `tabulacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tabulacao` ADD COLUMN `codigo` VARCHAR(191) NOT NULL,
    ADD COLUMN `usuarioId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `tabulacao` ADD CONSTRAINT `tabulacao_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
