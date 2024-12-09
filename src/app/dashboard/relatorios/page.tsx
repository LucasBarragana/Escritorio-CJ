'use client';

import { useState, useEffect, useRef } from 'react';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import Graficos from '@/app/components/graficos';
import ProcessosPorMes from '@/app/components/graficoGeral';

interface Advogado {
  id: string;
  nome: string;
}

interface Processo {
  id: string;
  advogadoId: string;
  fechamentoId: string;
  especialidade:  { id: number; nome: string; background: string };
  status:  { id: number; nome: string; background: string };
  contratoFechado:  { id: number; nome: string; background: string };
  qualificacao: string;
  data: string; // Formato ISO (YYYY-MM-DD)
}

export default function AdvogadoProcessosGraficos() {
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredProcessos, setFilteredProcessos] = useState<Processo[]>([]);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [advogadosRes, processosRes] = await Promise.all([
          fetch('/api/advogados'),
          fetch('/api/processos'),
        ]);

        const [advogadosData, processosData] = await Promise.all([
          advogadosRes.json(),
          processosRes.json(),
        ]);

        setAdvogados(advogadosData);
        setProcessos(processosData);
        setFilteredProcessos(processosData); // Inicialmente exibe todos os processos
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (advogados.length > 0 && filteredProcessos.length > 0) {
      const advogadosComContagem = advogados.map((advogado) => {
        const comoAdvogado = filteredProcessos.filter(
          (processo) => processo.advogadoId === advogado.id
        ).length;
        const comoFechamento = filteredProcessos.filter(
          (processo) => processo.fechamentoId === advogado.id
        ).length;

        return {
          nome: advogado.nome,
          comoAdvogado,
          comoFechamento,
        };
      });

      const labels = advogadosComContagem.map((advogado) => advogado.nome);
      const dataComoAdvogado = advogadosComContagem.map(
        (advogado) => advogado.comoAdvogado
      );
      const dataComoFechamento = advogadosComContagem.map(
        (advogado) => advogado.comoFechamento
      );

      const chartData: ChartConfiguration = {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Negociador',
              data: dataComoAdvogado,
              backgroundColor: '#36a2eb',
            },
            {
              label: 'Responsável',
              data: dataComoFechamento,
              backgroundColor: '#ff6384',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true },
          },
        },
      };

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      if (chartRef.current) {
        chartInstance.current = new Chart(chartRef.current, chartData);
      }
    }
  }, [advogados, filteredProcessos]);

  const handleFilter = () => {
    if (startDate && endDate) {
      setFilteredProcessos(
        processos.filter((processo) => processo.data >= startDate && processo.data <= endDate)
      );
    }
  };

  return (
    <div className="p-12">
      <h1 className='text-3xl font-semibold mb-4'>Análise de Relatórios</h1>
      <ProcessosPorMes />
      <div className="mb-6 mt-10">
        <label className="block font-semibold mb-2">Filtrar por intervalo de datas:</label>
        <div className="flex gap-4">
          <input
            type="date"
            className="border px-3 py-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border px-3 py-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleFilter}>
            Filtrar
          </button>
        </div>
      </div>

      <Graficos startDate={startDate} endDate={endDate} processos={filteredProcessos} />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        <div>
          <h1 className="text-xl font-semibold mt-6">Processos por Advogado</h1>
          <canvas ref={chartRef}></canvas>
        </div>
        <div></div>
      </div>

    </div>
  );
}