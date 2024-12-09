import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma'; 

export async function GET() {
  try {
    const advogados = await prisma.advogado.findMany();
    return NextResponse.json(advogados);
  } catch (error) {
    console.error('Erro ao buscar advogados:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar advogados.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { nome, especialidade } = await request.json();

    if (!nome || !especialidade) {
      return NextResponse.json(
        { message: 'Nome e especialidade são obrigatórios.' },
        { status: 400 }
      );
    }

    const advogado = await prisma.advogado.create({
      data: {
        nome,
        especialidade,
      },
    });

    return NextResponse.json(advogado, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar advogado:', error);
    return NextResponse.json(
      { message: 'Erro ao criar advogado.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, nome, especialidade } = await request.json();

    if (!id || !nome || !especialidade) {
      return NextResponse.json(
        { message: 'ID, nome e especialidade são obrigatórios.' },
        { status: 400 }
      );
    }

    const advogado = await prisma.advogado.update({
      where: { id },
      data: { nome, especialidade },
    });

    return NextResponse.json(advogado);
  } catch (error) {
    console.error('Erro ao atualizar advogado:', error);
    return NextResponse.json(
      { message: 'Erro ao atualizar advogado.' },
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

    await prisma.advogado.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Advogado excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir advogado:', error);
    return NextResponse.json(
      { message: 'Erro ao excluir advogado.' },
      { status: 500 }
    );
  }
}
