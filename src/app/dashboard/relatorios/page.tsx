'use client';
import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Importando diretamente o Chart.js

type Processo = {
  id: number;
  lead: string;
  status: string;
  area: string;
  responsavelAtendimento: string;
  responsavelFechamento: string;
};

export default function Relatorios() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const chartRefArea = useRef<HTMLCanvasElement | null>(null);
  const chartRefStatus = useRef<HTMLCanvasElement | null>(null);
  const chartRefAtendimento = useRef<HTMLCanvasElement | null>(null);
  const chartRefFechamento = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const storedProcessos = localStorage.getItem('processos');
    if (storedProcessos) {
      setProcessos(JSON.parse(storedProcessos));
    }
  }, []);

  useEffect(() => {
    if (processos.length > 0) {
      const areas = [...new Set(processos.map((p) => p.area))];
      const statusList = [...new Set(processos.map((p) => p.status))];
      const responsaveisAtendimento = [...new Set(processos.map((p) => p.responsavelAtendimento))];
      const responsaveisFechamento = [...new Set(processos.map((p) => p.responsavelFechamento))];

      const countByArea = areas.map((area) => ({
        area,
        count: processos.filter((p) => p.area === area).length,
      }));

      const countByStatus = statusList.map((status) => ({
        status,
        count: processos.filter((p) => p.status === status).length,
      }));

      const countByResponsavelAtendimento = responsaveisAtendimento.map((responsavel) => ({
        responsavel,
        count: processos.filter((p) => p.responsavelAtendimento === responsavel).length,
      }));

      const countByResponsavelFechamento = responsaveisFechamento.map((responsavel) => ({
        responsavel,
        count: processos.filter((p) => p.responsavelFechamento === responsavel).length,
      }));

      const createPieChart = (chartRef: React.RefObject<HTMLCanvasElement>, labels: string[], data: number[], label: string, colors: string[]) => {
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

      const colors = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#f56942'];

      createPieChart(
        chartRefArea,
        countByArea.map((item) => item.area),
        countByArea.map((item) => item.count),
        'Processos por Área',
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
        chartRefAtendimento,
        countByResponsavelAtendimento.map((item) => item.responsavel),
        countByResponsavelAtendimento.map((item) => item.count),
        'Processos por Responsável por Atendimento',
        colors
      );

      createPieChart(
        chartRefFechamento,
        countByResponsavelFechamento.map((item) => item.responsavel),
        countByResponsavelFechamento.map((item) => item.count),
        'Processos por Responsável por Fechamento',
        colors
      );
    }
  }, [processos]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Relatórios</h1>
      <div className="my-4">
        <label className="block text-sm font-medium text-gray-700">Pesquisar por Períodos</label>
        <div className="flex gap-4">
          <input
            type="date"
            className="p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
          <input
            type="date"
            className="p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div>
          <h2 className="text-lg font-semibold">Processos por Área</h2>
          <canvas ref={chartRefArea}></canvas>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Processos por Status</h2>
          <canvas ref={chartRefStatus}></canvas>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Processos por Responsável por Atendimento</h2>
          <canvas ref={chartRefAtendimento}></canvas>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Processos por Responsável por Fechamento</h2>
          <canvas ref={chartRefFechamento}></canvas>
        </div>
      </div>
    </div>
  );
}
