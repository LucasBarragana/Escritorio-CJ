import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';

// Manipulador para listar, criar, atualizar e deletar processos
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const processos = await prisma.processo.findMany({
        include: {
          advogado: true,
          sdr: true,
          especialidade: true,
          status: true,
          contratoFechado: true,
        },
      });
      return res.status(200).json(processos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar processos' });
    }
  }

  if (req.method === 'POST') {
    const { nomeLead, telefone, data, advogadoId, sdrId, especialidadeId, statusId, contratoFechadoId, qualificacao, fechamentoId } = req.body;
    try {
      const newProcesso = await prisma.processo.create({
        data: {
          nomeLead,
          telefone,
          data: new Date(data), // Garantindo que a data seja um objeto Date
          advogadoId,
          sdrId,
          especialidadeId,
          statusId,
          contratoFechadoId,
          qualificacao,
          fechamentoId,
        },
      });
      return res.status(201).json(newProcesso);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar processo' });
    }
  }

  if (req.method === 'PUT') {
    const { id, nomeLead, telefone, data, advogadoId, sdrId, especialidadeId, statusId, contratoFechadoId, qualificacao, fechamentoId } = req.body;
    try {
      const updatedProcesso = await prisma.processo.update({
        where: { id },
        data: {
          nomeLead,
          telefone,
          data: new Date(data), // Garantindo que a data seja um objeto Date
          advogadoId,
          sdrId,
          especialidadeId,
          statusId,
          contratoFechadoId,
          qualificacao,
          fechamentoId,
        },
      });
      return res.status(200).json(updatedProcesso);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar processo' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    try {
      await prisma.processo.delete({
        where: { id },
      });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar processo' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
