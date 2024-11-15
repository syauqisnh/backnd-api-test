/*
  Warnings:

  - You are about to alter the column `updated_at` on the `courses` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `courses` MODIFY `updated_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `updated_at` TIMESTAMP NULL,
    MODIFY `token` TEXT NULL;
