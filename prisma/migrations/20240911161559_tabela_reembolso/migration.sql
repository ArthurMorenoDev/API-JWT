-- CreateTable
CREATE TABLE `reembolso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_incio` DATETIME(3) NOT NULL,
    `data_fim` DATETIME(3) NOT NULL,
    `tipo_rota` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `valor` DOUBLE NOT NULL,
    `obs` VARCHAR(191) NOT NULL,
    `usuario_solicitante` VARCHAR(191) NOT NULL,
    `data_aprovacao_regional` DATETIME(3) NOT NULL,
    `data_aprovacao_financeiro` DATETIME(3) NOT NULL,
    `data_credito` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
