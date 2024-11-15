/*
  Warnings:

  - You are about to alter the column `updated_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `updated_at` TIMESTAMP NULL;

-- CreateTable
CREATE TABLE `courses` (
    `id_course` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid_course` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `instructorUuid` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP NULL,

    UNIQUE INDEX `courses_uuid_course_key`(`uuid_course`),
    PRIMARY KEY (`id_course`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_instructorUuid_fkey` FOREIGN KEY (`instructorUuid`) REFERENCES `users`(`uuid_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
