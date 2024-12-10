'use client';
import { useState } from 'react';
import Advogados from '@/app/components/advogados';
import EspecialidadePage from '@/app/components/especialits';
import StatusPage from '@/app/components/status';
import ContratoFechadoPage from '@/app/components/contractdeal';
import RepresentantePage from '@/app/components/representantes';
import QualificacaoPage from '@/app/components/settings/qualificacao';

function SettingsDesktop() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <div className="mt-6 flex gap-6">
        <div className="flex flex-col space-y-4">
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

        <div className="p-4 border-gray-300 rounded-md">
          {selectedComponent === 'advogados' && <Advogados />}
          {selectedComponent === 'representantes' && <RepresentantePage />}
          {selectedComponent === 'especialits' && <EspecialidadePage />}
          {selectedComponent === 'status' && <StatusPage />}
          {selectedComponent === 'contractdeal' && <ContratoFechadoPage />}
          {selectedComponent === 'qualificacao' && <QualificacaoPage />}
        </div>
      </div>
    </div>
  );
}

function SettingsMobile() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <div className="mt-6 mb-10 block">
        <div className="flex overflow-x-auto gap-2 text-xs">
          <button
            onClick={() => setSelectedComponent('advogados')}
            className="px-2 py-1  text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Advogados
          </button>
          <button
            onClick={() => setSelectedComponent('representantes')}
            className="px-2 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            SDR
          </button>
          <button
            onClick={() => setSelectedComponent('especialits')}
            className="px-2 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Áreas
          </button>
          <button
            onClick={() => setSelectedComponent('status')}
            className="px-2 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Status
          </button>
          <button
            onClick={() => setSelectedComponent('contractdeal')}
            className="px-2 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Contrato
          </button>
          <button
            onClick={() => setSelectedComponent('qualificacao')}
            className="px-2 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            Qualificação
          </button>
        </div>

        <div className="mt-10 p-4 border-gray-300 rounded-md">
          {selectedComponent === 'advogados' && <Advogados />}
          {selectedComponent === 'representantes' && <RepresentantePage />}
          {selectedComponent === 'especialits' && <EspecialidadePage />}
          {selectedComponent === 'status' && <StatusPage />}
          {selectedComponent === 'contractdeal' && <ContratoFechadoPage />}
          {selectedComponent === 'qualificacao' && <QualificacaoPage />}
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  return (
    <div>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <SettingsDesktop />
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <SettingsMobile />
      </div>
    </div>
  );
}
