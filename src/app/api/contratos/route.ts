import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const contratos = await prisma.contratoFechado.findMany();
    return NextResponse.json(contratos);
  } catch {
    return NextResponse.json(
      { message: 'Erro ao buscar contratos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { nome, backgroundColor } = await request.json();

    if (!nome || !backgroundColor) {
      return NextResponse.json(
        { message: 'Nome e cor de fundo são obrigatórios.' },
        { status: 400 }
      );
    }

    const contrato = await prisma.contratoFechado.create({
      data: { nome, backgroundColor },
    });
    return NextResponse.json(contrato, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: 'Erro ao criar contrato' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, nome, backgroundColor } = await request.json();

    if (!id || !nome || !backgroundColor) {
      return NextResponse.json(
        { message: 'ID, nome e cor de fundo são obrigatórios.' },
        { status: 400 }
      );
    }

    const contrato = await prisma.contratoFechado.update({
      where: { id },
      data: { nome, backgroundColor },
    });
    return NextResponse.json(contrato);
  } catch {
    return NextResponse.json(
      { message: 'Erro ao atualizar contrato' },
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

    await prisma.contratoFechado.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Contrato excluído com sucesso!' });
  } catch {
    return NextResponse.json(
      { message: 'Erro ao excluir contrato' },
      { status: 500 }
    );
  }
}
