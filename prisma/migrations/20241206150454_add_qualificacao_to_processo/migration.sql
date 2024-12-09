/*
  Warnings:

  - You are about to drop the column `nomeLead` on the `Processo` table. All the data in the column will be lost.
  - You are about to drop the column `qualificacao` on the `Processo` table. All the data in the column will be lost.
  - Added the required column `precoProjeto` to the `Processo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualificacaoId` to the `Processo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusEstrelas` to the `Processo` table without a default value. This is not possible if the table is not empty.
  - Made the column `advogadoId` on table `Processo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `representanteId` on table `Processo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `especialidadeId` on table `Processo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `statusId` on table `Processo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contratoFechadoId` on table `Processo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fechamentoId` on table `Processo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Processo" DROP CONSTRAINT "Processo_advogadoId_fkey";

-- DropForeignKey
ALTER TABLE "Processo" DROP CONSTRAINT "Processo_contratoFechadoId_fkey";

-- DropForeignKey
ALTER TABLE "Processo" DROP CONSTRAINT "Processo_especialidadeId_fkey";

-- DropForeignKey
ALTER TABLE "Processo" DROP CONSTRAINT "Processo_fechamentoId_fkey";

-- DropForeignKey
ALTER TABLE "Processo" DROP CONSTRAINT "Processo_representanteId_fkey";

-- DropForeignKey
ALTER TABLE "Processo" DROP CONSTRAINT "Processo_statusId_fkey";

-- AlterTable
ALTER TABLE "Processo" DROP COLUMN "nomeLead",
DROP COLUMN "qualificacao",
ADD COLUMN     "precoProjeto" TEXT NOT NULL,
ADD COLUMN     "qualificacaoId" TEXT NOT NULL,
ADD COLUMN     "statusEstrelas" TEXT NOT NULL,
ALTER COLUMN "advogadoId" SET NOT NULL,
ALTER COLUMN "representanteId" SET NOT NULL,
ALTER COLUMN "especialidadeId" SET NOT NULL,
ALTER COLUMN "statusId" SET NOT NULL,
ALTER COLUMN "contratoFechadoId" SET NOT NULL,
ALTER COLUMN "fechamentoId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Qualificacao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,

    CONSTRAINT "Qualificacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_advogadoId_fkey" FOREIGN KEY ("advogadoId") REFERENCES "Advogado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_representanteId_fkey" FOREIGN KEY ("representanteId") REFERENCES "Representante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_contratoFechadoId_fkey" FOREIGN KEY ("contratoFechadoId") REFERENCES "ContratoFechado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_qualificacaoId_fkey" FOREIGN KEY ("qualificacaoId") REFERENCES "Qualificacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_fechamentoId_fkey" FOREIGN KEY ("fechamentoId") REFERENCES "Advogado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
