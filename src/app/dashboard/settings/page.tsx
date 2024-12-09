'use client';
import { useState } from 'react';
import Advogados from '@/app/components/advogados';
import EspecialidadePage from '@/app/components/especialits';
import StatusPage from '@/app/components/status';
import ContratoFechadoPage from '@/app/components/contractdeal';
import RepresentantePage from '@/app/components/representantes';
import QualificacaoPage from '@/app/components/settings/qualificacao';

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
            onClick={() => setSelectedComponent('representantes')}
            className="p-4 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Gerenciar Equipe SDR
          </button>
          <button
            onClick={() => setSelectedComponent('especialits')}
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
            onClick={() => setSelectedComponent('contractdeal')}
            className="p-4 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Gerenciar Situação de Contrato
          </button>
          <button
            onClick={() => setSelectedComponent('qualificacao')}
              className="p-4 text-white bg-gray-500 rounded hover:bg-gray-600"
            >
              Gerenciar Qualificação
          </button>
        </div>

        {/* Renderiza o formulário do componente selecionado */}
        <div className="p-4  border-gray-300 rounded-md">
          {selectedComponent === 'advogados' && <Advogados />}
          {selectedComponent === 'representantes' && <RepresentantePage />}
          {selectedComponent === 'especialits' && <div><EspecialidadePage /></div>}
          {selectedComponent === 'status' && <div><StatusPage /></div>}
          {selectedComponent === 'contractdeal' && <div><ContratoFechadoPage /></div>}
          {selectedComponent === 'qualificacao' && <div><QualificacaoPage /></div>}
        </div>
      </div>
    </div>
  );
}
