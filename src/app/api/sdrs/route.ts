import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const sdrs = await prisma.sdr.findMany();
    return NextResponse.json(sdrs);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao buscar SDRs' },
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

    const newSdr = await prisma.sdr.create({
      data: { nome, cargo },
    });
    return NextResponse.json(newSdr, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao criar SDR' },
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

    const updatedSdr = await prisma.sdr.update({
      where: { id },
      data: { nome, cargo },
    });
    return NextResponse.json(updatedSdr);
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao atualizar SDR' },
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

    await prisma.sdr.delete({ where: { id } });
    return NextResponse.json({ message: 'SDR excluído com sucesso!' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao excluir SDR' },
      { status: 500 }
    );
  }
}
