import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const statuses = await prisma.status.findMany();
    return NextResponse.json(statuses);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao buscar status' },
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

    const status = await prisma.status.create({
      data: { nome, backgroundColor },
    });
    return NextResponse.json(status, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao criar status' },
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

    const status = await prisma.status.update({
      where: { id },
      data: { nome, backgroundColor },
    });
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao atualizar status' },
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

    await prisma.status.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Status excluído com sucesso!' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao excluir status' },
      { status: 500 }
    );
  }
}
