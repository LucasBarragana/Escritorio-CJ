import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma'; // Importa o Prisma Client de um módulo gerenciado


export async function GET() {
  try {
    const qualificacoes = await prisma.qualificacao.findMany();
    return NextResponse.json(qualificacoes);
  } catch {
    return NextResponse.json(
      { message: 'Erro ao buscar qualificações' },
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

    const qualificacao = await prisma.qualificacao.create({
      data: { nome, backgroundColor },
    });
    return NextResponse.json(qualificacao, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: 'Erro ao criar qualificação' },
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

    const qualificacao = await prisma.qualificacao.update({
      where: { id },
      data: { nome, backgroundColor },
    });
    return NextResponse.json(qualificacao);
  } catch {
    return NextResponse.json(
      { message: 'Erro ao atualizar qualificação' },
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

    await prisma.qualificacao.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Qualificação excluída com sucesso!' });
  } catch {
    return NextResponse.json(
      { message: 'Erro ao excluir qualificação' },
      { status: 500 }
    );
  }
}
