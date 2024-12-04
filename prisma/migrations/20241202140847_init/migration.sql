-- CreateTable
CREATE TABLE "Advogado" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,

    CONSTRAINT "Advogado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Representante" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,

    CONSTRAINT "Representante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Especialidade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,

    CONSTRAINT "Especialidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContratoFechado" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,

    CONSTRAINT "ContratoFechado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Processo" (
    "id" TEXT NOT NULL,
    "nomeLead" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "advogadoId" TEXT,
    "representanteId" TEXT,
    "especialidadeId" TEXT,
    "statusId" TEXT,
    "contratoFechadoId" TEXT,
    "qualificacao" TEXT,
    "fechamentoId" TEXT,

    CONSTRAINT "Processo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_advogadoId_fkey" FOREIGN KEY ("advogadoId") REFERENCES "Advogado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_representanteId_fkey" FOREIGN KEY ("representanteId") REFERENCES "Representante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_especialidadeId_fkey" FOREIGN KEY ("especialidadeId") REFERENCES "Especialidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_contratoFechadoId_fkey" FOREIGN KEY ("contratoFechadoId") REFERENCES "ContratoFechado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Processo" ADD CONSTRAINT "Processo_fechamentoId_fkey" FOREIGN KEY ("fechamentoId") REFERENCES "Advogado"("id") ON DELETE SET NULL ON UPDATE CASCADE;
