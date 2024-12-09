'use client';

import { useEffect, useRef } from 'react';
import Chart, { ChartType, ChartConfiguration } from 'chart.js/auto';

interface Processo {
  id: string;
  advogadoId: string;
  fechamentoId: string;
  especialidade:  { id: number; nome: string; background: string };
  status:  { id: number; nome: string; background: string };
  contratoFechado:  { id: number; nome: string; background: string };
  qualificacao: { id: number; nome: string; background: string };
  data: string; // Formato ISO (YYYY-MM-DD)
}

interface Props {
  startDate: string;
  endDate: string;
  processos: Processo[];
}

export default function Graficos({ processos }: Props) {
  const chartRefs = {
    especialidade: useRef<HTMLCanvasElement | null>(null),
    status: useRef<HTMLCanvasElement | null>(null),
    contratoFechado: useRef<HTMLCanvasElement | null>(null),
    qualificacao: useRef<HTMLCanvasElement | null>(null),
  };

  const chartInstances = useRef<{
    [key: string]: Chart | null;
  }>({
    especialidadeChart: null,
    statusChart: null,
    contratoFechadoChart: null,
    qualificacaoChart: null,
  });

  useEffect(() => {
    if (processos.length > 0) {
      const createChart = (
        chartId: string,
        chartRef: React.RefObject<HTMLCanvasElement>,
        type: ChartType,
        labels: string[],
        data: number[],
        label: string,
        colors: string[]
      ) => {
        if (chartInstances.current[chartId]) {
          chartInstances.current[chartId]?.destroy();
        }

        if (chartRef.current) {
          const config: ChartConfiguration = {
            type,
            data: {
              labels,
              datasets: [
                {
                  label,
                  data,
                  backgroundColor: colors,
                  hoverBackgroundColor: colors,
                },
              ],
            },
            options: {
              responsive: true,
              scales: type === 'bar' ? { x: { beginAtZero: true }, y: { beginAtZero: true } } : {},
            },
          };

          chartInstances.current[chartId] = new Chart(chartRef.current, config);
        }
      };

      const colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#f56942'];

      const especialidades = [...new Set(processos.map((p) => p.especialidade.nome))];
      const countEspecialidade = especialidades.map((especialidade) =>
        processos.filter((p) => p.especialidade.nome === especialidade).length
      );

      const statuses = [...new Set(processos.map((p) => p.status.nome))];
      const countStatus = statuses.map((status) =>
        processos.filter((p) => p.status.nome === status).length
      );

      const contratos = [...new Set(processos.map((p) => p.contratoFechado.nome))];
      const countContratos = contratos.map((contrato) =>
        processos.filter((p) => p.contratoFechado.nome === contrato).length
      );

      const qualificacaoDisponiveis = [...new Set(processos.map((p) => p.qualificacao.nome))];
      const countqualificacaoDisponiveis = qualificacaoDisponiveis.map((qualificacao) =>
        processos.filter((p) => p.qualificacao.nome === qualificacao).length
      );

      createChart(
        'especialidadeChart',
        chartRefs.especialidade,
        'pie',
        especialidades,
        countEspecialidade,
        'Por Especialidade',
        colors
      );
      createChart(
        'statusChart',
        chartRefs.status,
        'pie',
        statuses,
        countStatus,
        'Por Status',
        colors
      );
      createChart(
        'contratoFechadoChart',
        chartRefs.contratoFechado,
        'pie',
        contratos,
        countContratos,
        'Por Contrato Fechado',
        colors
      );
      createChart(
        'qualificacaoChart',
        chartRefs.qualificacao,
        'pie',
        qualificacaoDisponiveis,
        countqualificacaoDisponiveis,
        'Por Contrato Fechado',
        colors
      );
    }
  }, [processos,chartRefs.contratoFechado, chartRefs.especialidade,chartRefs.qualificacao, chartRefs.status]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mt-10 mb-6">Processos por Categoria</h1>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h2 className="text-lg font-semibold">Por Especialidade</h2>
            <canvas ref={chartRefs.especialidade}></canvas>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Por Status</h2>
            <canvas ref={chartRefs.status}></canvas>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Por Situação Contratual</h2>
            <canvas ref={chartRefs.contratoFechado}></canvas>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Por Qualificação</h2>
            <canvas ref={chartRefs.qualificacao}></canvas>
          </div>
        </div>
      </div>
    </div>

  );
}