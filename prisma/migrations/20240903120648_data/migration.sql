-- CreateTable
CREATE TABLE `data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `acertos` VARCHAR(191) NOT NULL,
    `banco` VARCHAR(191) NOT NULL,
    `comissao` INTEGER NOT NULL,

    UNIQUE INDEX `data_acertos_key`(`acertos`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
