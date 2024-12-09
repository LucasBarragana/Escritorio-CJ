import { useEffect, useRef, useState } from 'react';
import Chart, { ChartConfiguration } from 'chart.js/auto';

interface Processo {
  id: string;
  advogadoId: string;
  fechamentoId: string;
  especialidade: { id: number; nome: string; background: string };
  status: { id: number; nome: string; background: string };
  contratoFechado: { id: number; nome: string; background: string };
  qualificacao: string;
  data: string; // Formato ISO (YYYY-MM-DD)
}

export default function ProcessosPorMes() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [processos, setProcessos] = useState<Processo[]>([]);

  useEffect(() => {
    // Buscar os dados da API
    const fetchProcessos = async () => {
      try {
        const response = await fetch('/api/processos');
        if (!response.ok) {
          throw new Error(`Erro ao buscar processos: ${response.statusText}`);
        }
        const data = await response.json();
        setProcessos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProcessos();
  }, []);

  useEffect(() => {
    if (processos.length > 0) {
      const meses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];

      // Organizar os processos por mês
      const processosPorMes: Record<string, Processo[]> = {};
      meses.forEach((_, index) => {
        processosPorMes[index + 1] = processos.filter(
          (processo) => new Date(processo.data).getMonth() + 1 === index + 1
        );
      });

      // Obter especialidades únicas
      const especialidades = [...new Set(processos.map((p) => p.especialidade.nome))];

      // Configurar dados para o gráfico
      const totalProcessosPorMes = meses.map((_, index) =>
        processosPorMes[index + 1]?.length || 0
      );

      const datasets = especialidades.map((especialidade) => {
        const data = meses.map((_, index) =>
          processosPorMes[index + 1]?.filter(
            (p) => p.especialidade.nome === especialidade
          ).length || 0
        );

        const color = `hsl(${Math.random() * 360}, 70%, 60%)`;

        return {
          label: especialidade,
          data,
          backgroundColor: color,
        };
      });

      datasets.unshift({
        label: 'Total de Processos',
        data: totalProcessosPorMes,
        backgroundColor: '#36a2eb',
      });

      // Configurar o gráfico
      const chartConfig: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: meses,
          datasets,
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

      // Renderizar o gráfico
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      if (chartRef.current) {
        chartInstance.current = new Chart(chartRef.current, chartConfig);
      }
    }
  }, [processos]);

  return (
    <div className="w-[50%]">
      <h2 className="text-lg font-semibold">Processos por Mês</h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
