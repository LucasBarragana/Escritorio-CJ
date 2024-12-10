'use client'

import { useEffect, useState } from 'react';

interface Advogado {
  id: string;
  nome: string;
}

interface Processo {
  id: string;
  advogadoId: string;
  fechamentoId: string;
}

export default function AdvogadoProcessosCard() {
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);

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
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  // Mapeia os advogados e calcula a contagem de processos
  const advogadosComContagem = advogados.map((advogado) => {
    const comoAdvogado = processos.filter((processo) => processo.advogadoId === advogado.id).length;
    const comoFechamento = processos.filter((processo) => processo.fechamentoId === advogado.id).length;

    return {
      nome: advogado.nome,
      comoAdvogado,
      comoFechamento,
    };
  });

  return (
    <div className="block bg-cover bg-center text-white p-6 rounded-lg shadow-custom-red min-h-[400px] max-h-[400px] overflow-y-auto"
    style={{ backgroundImage: "url('/imgs/fundo1.jpg')" }}>
      <h1 className='color-white text-2xl font-semibold underline mb-4'>Processos por Adv.</h1>
      {advogadosComContagem.map((advogado) => (
        <div key={advogado.nome}  className="flex justify-between gap-4 backdrop-blur-lg bg-white/20 mb-2 p-2 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">{advogado.nome}</h3>
          <div className=''>
            <p className="flex justify-between gap-4 pb-2 text-xs">
                <span className="font-semibold">Negociador:</span> <span className="rounded-full bg-white text-[#751B1E] px-2 font-semibold">{advogado.comoAdvogado}</span>
            </p>
            <p className="flex justify-between gap-4  pb-2 text-xs">
                <span className="font-semibold">Responsável:</span> <span  className="rounded-full bg-white text-[#751B1E] px-2 font-semibold">{advogado.comoFechamento}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
