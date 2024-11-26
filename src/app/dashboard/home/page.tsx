'use client';
import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  nome: string;
  telefone: string;
}

interface Especialidade {
  id: string;
  nome: string;
  backgroundColor: string;
}

interface Advogado {
  id: string;
  nome: string;
  especialidade: string;
}

interface SDR {
  id: string;
  nome: string;
  cargo: string;
}

interface Processo {
  id: string;
  nomeLead: string;
  telefone: string;
  data: string;
  advogado: string;
  sdr: string;
  especialidade: string;
  status: string;
  contratoFechado: string;
  qualificacao: string;
  fechamento: string;
}

export default function Home() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [lastMonthProcessos, setLastMonthProcessos] = useState<Processo[]>([]);
  const [currentMonthProcessos, setCurrentMonthProcessos] = useState<Processo[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);

  // Função para normalizar datas (somente ano e mês são relevantes)
  const getNormalizedDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  useEffect(() => {
    const storedProcessos = localStorage.getItem('processos');
    const storedAdvogados = localStorage.getItem('advogados');

    // Carregar dados do localStorage
    if (storedProcessos) setProcessos(JSON.parse(storedProcessos));
    if (storedAdvogados) setAdvogados(JSON.parse(storedAdvogados));
  }, []); // Apenas executa uma vez ao montar o componente

  useEffect(() => {
    // Referência fixa para a data atual (pode ser alterada para fins de teste)
    const referenceDate = getNormalizedDate(new Date());
    const currentMonth = referenceDate.getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = referenceDate.getFullYear();

    // Filtrar processos do mês atual
    const currentMonthProcessosFiltered = processos.filter((processo) => {
      const processoDate = getNormalizedDate(new Date(processo.data));
      return (
        processoDate.getFullYear() === currentYear &&
        processoDate.getMonth() === currentMonth
      );
    });

    // Filtrar processos do mês anterior
    const lastMonthProcessosFiltered = processos.filter((processo) => {
      const processoDate = getNormalizedDate(new Date(processo.data));
      return (
        processoDate.getFullYear() === currentYear &&
        processoDate.getMonth() === lastMonth
      );
    });

    setCurrentMonthProcessos(currentMonthProcessosFiltered);
    setLastMonthProcessos(lastMonthProcessosFiltered);
  }, [processos]);

  const calculatePercentageChange = (currentMonth: number, lastMonth: number) => {
    if (lastMonth === 0) return 100;
    const change = ((currentMonth - lastMonth) / lastMonth) * 100;
    return change;
  };

  //Card de Processos Fechado
  const processContratoFechadoCount = processos.filter(
    (processo) => processo.contratoFechado === 'Fechado'
  ).length;

  //Card de Processos Fechado
  const processContratoFechadoNegociandoCount = processos.filter(
    (processo) => processo.contratoFechado === 'Negociando'
  ).length;

  const advogadosProcessosCount = advogados.map((advogado) => {
    const processosFechamento = processos.filter(
      (processo) => processo.fechamento === advogado.nome
    );
    const processosNegociacao = processos.filter(
      (processo) => processo.advogado === advogado.nome
    );
    return {
      advogado,
      fechamentoCount: processosFechamento.length,
      negociacaoCount: processosNegociacao.length,
    };
  });

  const lastFiveProcessosFechado = processos
    .filter((processo) => processo.contratoFechado === 'Fechado')
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

      // Função para obter a cor do status selecionado
      const getEspecialidadeBackgroundColor = (especialidadeName: string) => {
        const especialidade = especialidades.find((item) => item.nome === especialidadeName);
        return especialidade ? especialidade.backgroundColor : '#ffffff';
      };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Dashboard de Processos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            Total de Leads Cadastrados <p className="text-sm font-normal">Últimos 30 dias</p>
          </h3>
          <p className="text-2xl font-bold">{currentMonthProcessos.length}</p>
          <p
            className={`text-lg ${
              calculatePercentageChange(
                currentMonthProcessos.length,
                lastMonthProcessos.length
              ) >= 0
                ? 'text-green-500'
                : 'text-red-500'
            }`}
          >
            {calculatePercentageChange(
              currentMonthProcessos.length,
              lastMonthProcessos.length
            ).toFixed(2)}
            %{' '}
            {calculatePercentageChange(
              currentMonthProcessos.length,
              lastMonthProcessos.length
            ) >= 0
              ? '↑'
              : '↓'}{' '}
            comparado ao mês anterior
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            Contratos Fechados <p className="text-sm font-normal">Últimos 30 dias</p>
          </h3>
          <p className="text-2xl font-bold">{processContratoFechadoCount}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">
            Contratos em Negociação <p className="text-sm font-normal">Últimos 30 dias</p>
          </h3>
          <p className="text-2xl font-bold">{processContratoFechadoNegociandoCount}</p>
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-4">Últimos Processos Fechados</h3>
          <div className='w-full h-[4px] bg-red-900'></div>
          <table className="min-w-full table-auto border-collapse mb-6">
            <thead>
              <tr>
                <th className="px-4 py-2">Nome do Lead</th>
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Negociador</th>
                <th className="px-4 py-2">Responsável</th>
                <th className="px-4 py-2">Área</th>
              </tr>
            </thead>
            <tbody>
              {lastFiveProcessosFechado.map((processo) => (
                <tr key={processo.id}>
                  <td className="border-t border-t-[#771A1D] px-4 py-2 text-sm">{processo.nomeLead}</td>
                  <td className="border-t border-t-[#771A1D] px-4 py-2 text-sm">{processo.data}</td>
                  <td className="border-t border-t-[#771A1D] px-4 py-2 text-sm">{processo.advogado}</td>
                  <td className="border-t border-t-[#771A1D] px-4 py-2 text-sm">{processo.fechamento}</td>
                  <td className="border-t border-t-[#771A1D] px-4 py-2">
                    <p                  
                      className="flex justify-center px-2 py-1 rounded text-xs font-semibold"
                      style={{ backgroundColor: getEspecialidadeBackgroundColor(processo.status) }}
                    >
                      {processo.especialidade}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='w-full h-[4px] bg-red-900'></div>
        </div>

        <div
          className="bg-cover bg-center text-white p-6 rounded-lg shadow-custom-red"
          style={{ backgroundImage: "url('/imgs/fundo1.jpg')" }}
        >
          <h1 className="font-semibold text-lg mb-4">Controle de Contratos por Adv.</h1>
          {advogadosProcessosCount.map(({ advogado, fechamentoCount, negociacaoCount }) => (
            <div
              key={advogado.id}
              className="flex justify-between gap-4 backdrop-blur-lg bg-white/20 mb-2 p-2 rounded shadow-md"
            >
              <h3 className="text-md font-semibold text-white p-2">
                {advogado.nome} <p className="text-xs">Mensal</p>
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-semibold">Responsável:
                  </p>
                  <p className="rounded-full bg-white text-[#751B1E] px-2 font-semibold">{fechamentoCount}</p>
                </div>
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-semibold">Negociador:</p>
                  <p className="rounded-full bg-white text-[#751B1E] px-2 font-semibold">{negociacaoCount}</p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
