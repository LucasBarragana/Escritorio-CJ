'use client';

import AdvogadoProcessosCard from '@/app/components/Home/controleadv';
import { useState, useEffect } from 'react';

interface Especialidade {
  id: string;
  nome: string;
  backgroundColor: string;
}

interface Advogado {
  id: string;
  nome: string;
  especialidadeId: string;
}

interface ContratoFechado {
  id: string;
  nome: string;
  contratoFechadoId: string;
  backgroundColor: string;
}

interface Processo {
  id: string;
  nomeLead: string;
  telefone: string;
  data: string; // Assume que a data está no formato ISO (YYYY-MM-DD)
  advogadoId: string;
  fechamentoId: string;
  especialidadeId: string;
  status: string;
  contratoFechadoId: string;
}

export default function Home() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [contratos, setContratos] = useState<ContratoFechado[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [processosRes, advogadosRes, especialidadesRes,contratosRes] = await Promise.all([
          fetch('/api/processos'),
          fetch('/api/advogados'),
          fetch('/api/especialidades'),
          fetch('/api/contratos'),
        ]);

        const [processosData, advogadosData, especialidadesData, contratosData] = await Promise.all([
          processosRes.json(),
          advogadosRes.json(),
          especialidadesRes.json(),
          contratosRes.json(),
        ]);

        setProcessos(processosData);
        setAdvogados(advogadosData);
        setEspecialidades(especialidadesData);
        setContratos(contratosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  // Função para obter os processos do mês atual
  const getProcessosMesAtual = () => {
    const today = new Date();
    return processos.filter((processo) => {
      const processoDate = new Date(processo.data);
      return (
        processoDate.getFullYear() === today.getFullYear() &&
        processoDate.getMonth() === today.getMonth()
      );
    });
  };

  const processosMesAtual = getProcessosMesAtual();


  // Processos do mês atual e do mês anterior
  const totalProcessosMesAtual = processosMesAtual.length;


// Formatação da data
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
    };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Dashboard de Processos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total de Leads */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Total de Leads</h3>
          <p className="text-xs mb-4">Últimos 30 dias</p>
          <p className="text-2xl font-bold">{totalProcessosMesAtual}</p>
        </div>

        {/* Card 2: Contratos Fechados */}

      </div>

      <div className="flex justify-between gap-20">
        <div>
          <h3 className="text-xl font-semibold mb-4">Processos Deste Mês</h3>
          <table className="min-w-full table-auto border-collapse mb-6">
            <thead>
              <tr>
                <th className="px-4 py-2">Nome do Lead</th>
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Negociador</th>
                <th className="px-4 py-2">Responsável</th>
                <th className="px-4 py-2">Área</th>
                <th className="px-4 py-2">Contrato</th>
              </tr>
            </thead>
            <tbody>
              {processosMesAtual.map((processo) => (
                <tr key={processo.id}>
                  <td className="border-t border-t-[#771A1D] px-4 py-2">{processo.nomeLead}</td>
                  <td className="border-t border-t-[#771A1D] px-4 py-2">{formatDate(processo.data)}</td>
                  <td className="border-t border-t-[#771A1D] px-4 py-2">
                    {advogados.find((advogado) => advogado.id === processo.advogadoId)?.nome || 'N/A'}
                  </td>
                  <td className="border-t border-t-[#771A1D] px-4 py-2">
                    {advogados.find((advogado) => advogado.id === processo.fechamentoId)?.nome || 'N/A'}
                  </td>
                  <td className="border-t border-t-[#771A1D] px-4 py-2">
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: especialidades.find((e) => e.id === processo.especialidadeId)
                          ?.backgroundColor || '#ffffff',
                      }}
                    >
                      {especialidades.find((e) => e.id === processo.especialidadeId)?.nome || 'N/A'}
                    </span>
                  </td>
                  <td className="border-t border-t-[#771A1D] px-4 py-2">
                <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: contratos.find((e) => e.id === processo.contratoFechadoId)
                          ?.backgroundColor || '#ffffff',
                      }}
                    >
                      {contratos.find((e) => e.id === processo.contratoFechadoId)?.nome || 'N/A'}
                </span>
              </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdvogadoProcessosCard />
      </div>
    </div>
  );
}
