import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma'; // Importa o Prisma Client de um módulo gerenciado


export async function GET() {
  try {
    const processos = await prisma.processo.findMany({
      include: {
        advogado: true,
        representante: true,
        especialidade: true,
        status: true,
        contratoFechado: true,
        qualificacao: true, // Incluindo a relação com Qualificacao
      },
    });
    return NextResponse.json(processos, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar processos:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar processos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      nomeLead,
      telefone,
      data,
      advogadoId,
      representanteId,
      especialidadeId,
      statusId,
      contratoFechadoId,
      qualificacaoId, // Usando qualificacaoId como referência
      fechamentoId,
      precoProjeto,
    } = await request.json();

    if (!nomeLead || !telefone || !data) {
      return NextResponse.json(
        { message: 'Nome do lead, telefone e data são obrigatórios.' },
        { status: 400 }
      );
    }

    // Ajustando a data para garantir que seja salva corretamente
    const adjustedDate = new Date(data + 'T00:00:00');

    const novoProcesso = await prisma.processo.create({
      data: {
        nomeLead,
        telefone,
        data: adjustedDate,
        advogadoId,
        representanteId,
        especialidadeId,
        statusId,
        contratoFechadoId,
        qualificacaoId, 
        fechamentoId,
        precoProjeto,
      },
    });

    return NextResponse.json(novoProcesso, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar processo:', error);
    return NextResponse.json(
      { message: 'Erro ao criar processo' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const {
      id,
      nomeLead,
      telefone,
      data,
      advogadoId,
      representanteId,
      especialidadeId,
      statusId,
      contratoFechadoId,
      qualificacaoId, // Incluindo qualificacaoId
      fechamentoId,
      precoProjeto,
    } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'ID do processo é obrigatório para atualização.' },
        { status: 400 }
      );
    }

    // Ajustando a data para garantir que seja salva corretamente
    const adjustedDate = new Date(data + 'T00:00:00');

    const processo = await prisma.processo.update({
      where: { id },
      data: {
        nomeLead,
        telefone,
        data: adjustedDate,
        advogadoId,
        representanteId,
        especialidadeId,
        statusId,
        contratoFechadoId,
        qualificacaoId, // Atualizando qualificacaoId
        fechamentoId,
        precoProjeto,
      },
    });

    return NextResponse.json(processo, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar processo:', error);
    return NextResponse.json(
      { message: 'Erro ao atualizar processo' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'ID é obrigatório para exclusão.' },
        { status: 400 }
      );
    }

    await prisma.processo.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Processo excluído com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao excluir processo:', error);
    return NextResponse.json(
      { message: 'Erro ao excluir processo' },
      { status: 500 }
    );
  }
}
