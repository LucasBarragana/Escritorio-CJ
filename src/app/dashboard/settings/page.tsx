'use client';
import { useState } from 'react';
import Advogados from '@/app/components/advogados';
import SDRPage from '@/app/components/sdr';

export default function Settings() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  return (
    <div className='p-10'>
      <h1 className="text-2xl font-bold">Configurações</h1>
      
      <div className="mt-6 flex gap-6">
        <div className="flex flex-col space-y-4 ">
          <button
            onClick={() => setSelectedComponent('advogados')}
            className="p-4 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Gerenciar Equipe de Advogados
          </button>
          <button
            onClick={() => setSelectedComponent('sdr')}
            className="p-4 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Gerenciar Equipe SDR
          </button>
          <button
            onClick={() => setSelectedComponent('areas')}
            className="p-4 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Gerenciar Áreas de Atuação
          </button>
          <button
            onClick={() => setSelectedComponent('status')}
            className="p-4 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Gerenciar Status
          </button>
          <button
            onClick={() => setSelectedComponent('situacaoContrato')}
            className="p-4 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Gerenciar Situação de Contrato
          </button>
        </div>

        {/* Renderiza o formulário do componente selecionado */}
        <div className="p-4  border-gray-300 rounded-md">
          {selectedComponent === 'advogados' && <Advogados />}
          {selectedComponent === 'sdr' && <SDRPage />}
          {selectedComponent === 'areas' && <div>Gerenciar Áreas de Atuação</div>}
          {selectedComponent === 'status' && <div>Gerenciar Status</div>}
          {selectedComponent === 'situacaoContrato' && <div>Gerenciar Situação de Contrato</div>}
        </div>
      </div>
    </div>
  );
}
