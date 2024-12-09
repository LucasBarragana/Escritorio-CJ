/*
  Warnings:

  - Added the required column `nomeLead` to the `Processo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Processo" ADD COLUMN     "nomeLead" TEXT NOT NULL;
