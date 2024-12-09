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
  especialidade: { id: number; nome: string; background: string };
  status: { id: number; nome: string; background: string };
  contratoFechado: { id: number; nome: string; background: string };
  qualificacao: { id: number; nome: string; background: string };
  data: string; // Formato ISO (YYYY-MM-DD)
}

export default function AdvogadoProcessosGraficos() {
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredProcessos, setFilteredProcessos] = useState<Processo[]>([]);

  const chartRefs = useRef<HTMLCanvasElement[]>([]);
  const chartInstances = useRef<Chart[]>([]);
  const mainChartRef = useRef<HTMLCanvasElement | null>(null);
  const mainChartInstance = useRef<Chart | null>(null);

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

  const createChart = (ctx: HTMLCanvasElement, data: ChartConfiguration['data'], title: string) => {
    return new Chart(ctx, {
      type: 'bar',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: title,
          },
        },
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true },
        },
      },
    });
  };

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

      const mainChartData: ChartConfiguration = {
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

      if (mainChartInstance.current) {
        mainChartInstance.current.destroy();
      }

      if (mainChartRef.current) {
        mainChartInstance.current = new Chart(mainChartRef.current, mainChartData);
      }

      const advogadosComStatus = advogados.map((advogado) => {
        const statusCounts: { [key: string]: number } = {};
        filteredProcessos
          .filter((processo) => processo.advogadoId === advogado.id)
          .forEach((processo) => {
            const statusName = processo.status.nome;
            statusCounts[statusName] = (statusCounts[statusName] || 0) + 1;
          });
        return { nome: advogado.nome, statusCounts };
      });

      const advogadosComContrato = advogados.map((advogado) => {
        const contratoCounts: { [key: string]: number } = {};
        filteredProcessos
          .filter((processo) => processo.advogadoId === advogado.id)
          .forEach((processo) => {
            const contratoName = processo.contratoFechado.nome;
            contratoCounts[contratoName] = (contratoCounts[contratoName] || 0) + 1;
          });
        return { nome: advogado.nome, contratoCounts };
      });

      const statusLabels = Array.from(
        new Set(filteredProcessos.map((processo) => processo.status.nome))
      );

      const contratoLabels = Array.from(
        new Set(filteredProcessos.map((processo) => processo.contratoFechado.nome))
      );

      const statusData: ChartConfiguration['data'] = {
        labels: advogados.map((advogado) => advogado.nome),
        datasets: statusLabels.map((status, i) => ({
          label: status,
          data: advogados.map(
            (advogado) => advogadosComStatus.find((a) => a.nome === advogado.nome)?.statusCounts[status] || 0
          ),
          backgroundColor: `hsl(${(i * 360) / statusLabels.length}, 70%, 50%)`,
        })),
      };

      const contratoData: ChartConfiguration['data'] = {
        labels: advogados.map((advogado) => advogado.nome),
        datasets: contratoLabels.map((contrato, i) => ({
          label: contrato,
          data: advogados.map(
            (advogado) => advogadosComContrato.find((a) => a.nome === advogado.nome)?.contratoCounts[contrato] || 0
          ),
          backgroundColor: `hsl(${(i * 360) / contratoLabels.length}, 70%, 50%)`,
        })),
      };

      chartInstances.current.forEach((chart) => chart.destroy());
      chartInstances.current = [];

      if (chartRefs.current[0]) {
        chartInstances.current[0] = createChart(chartRefs.current[0], statusData, '');
      }
      if (chartRefs.current[1]) {
        chartInstances.current[1] = createChart(chartRefs.current[1], contratoData, '');
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
      <h1 className="text-3xl font-semibold mb-4">Análise de Relatórios</h1>
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

      <div className="">
        <h1 className="text-2xl font-semibold mt-10 mb-6">Processos por Advogado</h1>
        <div className='flex justify-between'>
          <div>
            <h1 className="text-xl font-semibold mt-6">Por Responsabilidade</h1>
            <canvas ref={mainChartRef}></canvas>
          </div>
          <div>
            <h1 className="text-xl font-semibold mt-6">Por Status</h1>
            <canvas
            ref={(el) => {
              if (el) chartRefs.current[0] = el;
            }}
          ></canvas>
          </div>
          <div>
            <h1 className="text-xl font-semibold mt-6">Por Situação Contratual</h1>
            <canvas
              ref={(el) => {
                if (el) chartRefs.current[1] = el;
              }}
            ></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
