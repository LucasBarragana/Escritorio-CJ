import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const processos = await prisma.processo.findMany({
      include: {
        advogado: true,
        representante: true,
        especialidade: true,
        status: true,
        contratoFechado: true,
      },
    });
    return NextResponse.json(processos);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao buscar processos'},
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
      qualificacao,
      fechamentoId,
    } = await request.json();

    if (!nomeLead || !telefone || !data) {
      return NextResponse.json(
        { message: 'Nome do lead, telefone e data são obrigatórios.' },
        { status: 400 }
      );
    }

    const novoProcesso = await prisma.processo.create({
      data: {
        nomeLead,
        telefone,
        data: new Date(data),
        advogadoId, // Foreign key
        representanteId, // Foreign key
        especialidadeId, // Foreign key
        statusId, // Foreign key
        contratoFechadoId, // Foreign key
        qualificacao,
        fechamentoId, // Foreign key
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
    const { id, ...data } = await request.json();

    const processoAtualizado = await prisma.processo.update({
      where: { id },
      data,
    });

    return NextResponse.json(processoAtualizado);
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
    return NextResponse.json({ message: 'Processo excluído com sucesso!' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao excluir processo'},
      { status: 500 }
    );
  }
}
