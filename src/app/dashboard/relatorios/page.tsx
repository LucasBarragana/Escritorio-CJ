'use client';
import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

type Processo = {
  id: number;
  especialidade: string;
  status: string;
  contratoFechado: string;
  advogado: string;
};

export default function Relatorios() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const chartRefEspecialidade = useRef<HTMLCanvasElement | null>(null);
  const chartRefStatus = useRef<HTMLCanvasElement | null>(null);
  const chartRefContratoFechado = useRef<HTMLCanvasElement | null>(null);
  const chartRefAdvogados = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const storedProcessos = localStorage.getItem('processos');
    if (storedProcessos) {
      setProcessos(JSON.parse(storedProcessos));
    }
  }, []);

  useEffect(() => {
    if (processos.length > 0) {
      // Filtrando apenas os processos abertos
      const processosAbertos = processos.filter((p) => p.status !== 'Fechado');

      // Dados para "Especialidade"
      const especialidades = [...new Set(processos.map((p) => p.especialidade))];
      const countByEspecialidade = especialidades.map((especialidade) => ({
        especialidade,
        count: processosAbertos.filter((p) => p.especialidade === especialidade).length,
      }));

      // Dados para "Status"
      const statusList = [...new Set(processos.map((p) => p.status))];
      const countByStatus = statusList.map((status) => ({
        status,
        count: processosAbertos.filter((p) => p.status === status).length,
      }));

      // Dados para "Contrato Fechado"
      const contratos = [...new Set(processos.map((p) => p.contratoFechado))];
      const countByContrato = contratos.map((contrato) => ({
        contrato,
        count: processosAbertos.filter((p) => p.contratoFechado === contrato).length,
      }));

      // Dados para "Advogados"
      const advogados = [...new Set(processos.map((p) => p.advogado))];
      const countByAdvogado = advogados.map((advogado) => ({
        advogado,
        count: processosAbertos.filter((p) => p.advogado === advogado).length,
      }));

      // Função para criar gráficos de pizza
      const createPieChart = (
        chartRef: React.RefObject<HTMLCanvasElement>,
        labels: string[],
        data: number[],
        label: string,
        colors: string[]
      ) => {
        if (chartRef.current) {
          new Chart(chartRef.current, {
            type: 'pie',
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
            },
          });
        }
      };

      // Função para criar gráfico de barras
      const createBarChart = (
        chartRef: React.RefObject<HTMLCanvasElement>,
        labels: string[],
        data: number[],
        label: string,
        colors: string[]
      ) => {
        if (chartRef.current) {
          new Chart(chartRef.current, {
            type: 'bar',
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
              scales: {
                x: { beginAtZero: true },
                y: { beginAtZero: true },
              },
            },
          });
        }
      };

      const colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#f56942'];

      // Criando os gráficos
      createPieChart(
        chartRefEspecialidade,
        countByEspecialidade.map((item) => item.especialidade),
        countByEspecialidade.map((item) => item.count),
        'Processos por Especialidade',
        colors
      );

      createPieChart(
        chartRefStatus,
        countByStatus.map((item) => item.status),
        countByStatus.map((item) => item.count),
        'Processos por Status',
        colors
      );

      createPieChart(
        chartRefContratoFechado,
        countByContrato.map((item) => item.contrato),
        countByContrato.map((item) => item.count),
        'Processos por Contrato Fechado',
        colors
      );

      createBarChart(
        chartRefAdvogados,
        countByAdvogado.map((item) => item.advogado),
        countByAdvogado.map((item) => item.count),
        'Processos por Advogado',
        colors
      );
    }
  }, [processos]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Relatórios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div>
          <h2 className="text-lg font-semibold">Processos por Especialidade</h2>
          <canvas ref={chartRefEspecialidade}></canvas>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Processos por Status</h2>
          <canvas ref={chartRefStatus}></canvas>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Processos por Contrato Fechado</h2>
          <canvas ref={chartRefContratoFechado}></canvas>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Processos por Advogado</h2>
          <canvas ref={chartRefAdvogados}></canvas>
        </div>
      </div>
    </div>
  );
}
