// app/api/advogados/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const advogados = await prisma.advogado.findMany();
  return NextResponse.json(advogados);
}

export async function POST(request: Request) {
  const { nome, especialidade } = await request.json();
  const advogado = await prisma.advogado.create({
    data: {
      nome,
      especialidade,
    },
  });
  return NextResponse.json(advogado);
}

export async function PUT(request: Request) {
  const { id, nome, especialidade } = await request.json();
  const advogado = await prisma.advogado.update({
    where: { id },
    data: { nome, especialidade },
  });
  return NextResponse.json(advogado);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.advogado.delete({
    where: { id },
  });
  return NextResponse.json({ message: 'Advogado excluído com sucesso!' });
}
