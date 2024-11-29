import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const especialidades = await prisma.especialidade.findMany();
    return NextResponse.json(especialidades);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao buscar especialidades' },
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

    const especialidade = await prisma.especialidade.create({
      data: { nome, backgroundColor },
    });
    return NextResponse.json(especialidade, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao criar especialidade' },
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

    const especialidade = await prisma.especialidade.update({
      where: { id },
      data: { nome, backgroundColor },
    });
    return NextResponse.json(especialidade);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao atualizar especialidade' },
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

    await prisma.especialidade.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Especialidade excluída com sucesso!' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao excluir especialidade' },
      { status: 500 }
    );
  }
}
