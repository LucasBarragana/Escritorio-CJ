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
  data: string;
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
  const [contratoSelecionado, setContratoSelecionado] = useState<string | null>(null);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [processosRes, advogadosRes, especialidadesRes, contratosRes] = await Promise.all([
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

  const contarProcessosPorContrato = () => {
    const contratoCount: { [key: string]: number } = {};

    processosMesAtual.forEach((processo) => {
      const contratoId = processo.contratoFechadoId;
      if (contratoCount[contratoId]) {
        contratoCount[contratoId]++;
      } else {
        contratoCount[contratoId] = 1;
      }
    });

    return contratoCount;
  };

  const processosPorContrato = contarProcessosPorContrato();

  const contarProcessosPorEspecialidade = () => {
    const especialidadeCount: { [key: string]: number } = {};

    processosMesAtual.forEach((processo) => {
      const especialidadeId = processo.especialidadeId;
      if (especialidadeCount[especialidadeId]) {
        especialidadeCount[especialidadeId]++;
      } else {
        especialidadeCount[especialidadeId] = 1;
      }
    });

    return especialidadeCount;
  };

  const processosPorEspecialidade = contarProcessosPorEspecialidade();

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  const processosFiltrados = contratoSelecionado
    ? processosMesAtual.filter((processo) => processo.contratoFechadoId === contratoSelecionado)
    : especialidadeSelecionada
    ? processosMesAtual.filter((processo) => processo.especialidadeId === especialidadeSelecionada)
    : processosMesAtual;

  const resetFiltros = () => {
    setContratoSelecionado(null);
    setEspecialidadeSelecionada(null);
  };

  return (
    <div className="p-8 w-full min-h-screen">
      <div className=''>
        <h2 className="text-2xl font-semibold mb-6">Dashboard de Processos</h2>
        <div className="grid grid-cols-3 gap-10 mb-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Total de Leads</h3>
            <p className="text-xs mb-4">Este Mês</p>
            <p className="text-2xl font-bold">{processosMesAtual.length}</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className='flex justify-between '>
              <h3 className="text-xl font-semibold">Situação Contratual</h3>
              <button
                className="text-xs t-4 bg-red-500 text-white py-1 px-2 rounded"
                onClick={resetFiltros}
              >
                x
              </button>
            </div> 
            <p className="text-xs mb-4">Este Mês</p>
            <ul className="space-y-2">
              {Object.keys(processosPorContrato).map((contratoId) => {
                const contrato = contratos.find((c) => c.id === contratoId);
                return (
                  <li
                    key={contratoId}
                    className="flex justify-between cursor-pointer"
                    onClick={() => setContratoSelecionado(contratoId)}
                  >
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: contrato?.backgroundColor || '#ffffff',
                      }}
                    >
                      {contrato?.nome || 'Contrato Não Encontrado'}
                    </span>
                    <span className="font-bold">{processosPorContrato[contratoId]}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className='flex  justify-between '>
              <h3 className="text-xl font-semibold">Por Especialidade</h3>
              <button
                className="text-xs t-4 bg-red-500 text-white py-1 px-2 rounded"
                onClick={resetFiltros}
              >
                x
              </button>
            </div>          
            <p className="text-xs mb-4">Este Mês</p>
            <ul className="space-y-2">
              {Object.keys(processosPorEspecialidade).map((especialidadeId) => {
                const especialidade = especialidades.find((e) => e.id === especialidadeId);
                return (
                  <li
                    key={especialidadeId}
                    className="flex justify-between cursor-pointer"
                    onClick={() => setEspecialidadeSelecionada(especialidadeId)}
                  >
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: especialidade?.backgroundColor || '#ffffff',
                      }}
                    >
                      {especialidade?.nome || 'Especialidade Não Encontrada'}
                    </span>
                    <span className="font-bold">{processosPorEspecialidade[especialidadeId]}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex justify-between gap-20">
          <div className="overflow-y-auto max-h-[calc(10*2.5rem)]">
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
                {processosFiltrados.map((processo) => (
                  <tr key={processo.id}>
                    <td className="border-t border-t-[#771A1D] px-4 py-2">{processo.nomeLead}</td>
                    <td className="border-t border-t-[#771A1D] px-4 py-2">{formatDate(processo.data)}</td>
                    <td className="border-t border-t-[#771A1D] px-4 py-2">
                      {advogados.find((advogado) => advogado.id === processo.advogadoId)?.nome}
                    </td>
                    <td className="border-t border-t-[#771A1D] px-4 py-2">
                      {advogados.find((advogado) => advogado.id === processo.fechamentoId)?.nome}
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

          <div>
            <h3 className="text-xl font-semibold mb-4">Resumo de Processos</h3>
            <AdvogadoProcessosCard />
          </div>

        </div>
      </div>

    </div>
  );
}
