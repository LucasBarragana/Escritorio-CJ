import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const representantes = await prisma.representante.findMany();
    return NextResponse.json(representantes);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao buscar Representantes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, cargo } = await request.json();

    if (!nome || !cargo) {
      return NextResponse.json(
        { message: 'Nome e cargo são obrigatórios.' },
        { status: 400 }
      );
    }

    const newRepresentante = await prisma.representante.create({
      data: { nome, cargo },
    });
    return NextResponse.json(newRepresentante, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao criar Representante' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, nome, cargo } = await request.json();

    if (!id || !nome || !cargo) {
      return NextResponse.json(
        { message: 'ID, nome e cargo são obrigatórios.' },
        { status: 400 }
      );
    }

    const updatedRepresentante = await prisma.representante.update({
      where: { id },
      data: { nome, cargo },
    });
    return NextResponse.json(updatedRepresentante);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao atualizar Representante' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'ID é obrigatório para exclusão.' },
        { status: 400 }
      );
    }

    await prisma.representante.delete({ where: { id } });
    return NextResponse.json({ message: 'Representante excluído com sucesso!' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao excluir Representante' },
      { status: 500 }
    );
  }
}
