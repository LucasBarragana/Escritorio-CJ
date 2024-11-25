'use client';
import { useState, useEffect } from 'react';

interface Advogado {
  id: string;
  nome: string;
  especialidade: string;
}

export default function Advogados() {
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [editingAdvogadoId, setEditingAdvogadoId] = useState<string | null>(null); // ID do advogado sendo editado

  useEffect(() => {
    const storedAdvogados = localStorage.getItem('advogados');
    if (storedAdvogados) {
      setAdvogados(JSON.parse(storedAdvogados));
    }
  }, []);

  const handleAddOrUpdateAdvogado = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAdvogadoId) {
      // Atualizar advogado existente
      const updatedAdvogados = advogados.map((advogado) =>
        advogado.id === editingAdvogadoId ? { ...advogado, nome, especialidade } : advogado
      );
      setAdvogados(updatedAdvogados);
      localStorage.setItem('advogados', JSON.stringify(updatedAdvogados));
      setEditingAdvogadoId(null);
    } else {
      // Adicionar novo advogado
      const newAdvogado = { id: Date.now().toString(), nome, especialidade };
      const updatedAdvogados = [...advogados, newAdvogado];
      setAdvogados(updatedAdvogados);
      localStorage.setItem('advogados', JSON.stringify(updatedAdvogados));
    }

    setNome('');
    setEspecialidade('');
  };

  const handleEditAdvogado = (advogado: Advogado) => {
    setEditingAdvogadoId(advogado.id);
    setNome(advogado.nome);
    setEspecialidade(advogado.especialidade);
  };

  const handleDeleteAdvogado = (advogadoId: string) => {
    const updatedAdvogados = advogados.filter((advogado) => advogado.id !== advogadoId);
    setAdvogados(updatedAdvogados);
    localStorage.setItem('advogados', JSON.stringify(updatedAdvogados));
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">
        {editingAdvogadoId ? 'Editar Advogado' : 'Cadastrar Novo Advogado'}
      </h2>
      <form onSubmit={handleAddOrUpdateAdvogado} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Especialidade</label>
          <input
            type="text"
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {editingAdvogadoId ? 'Atualizar Advogado' : 'Adicionar Advogado'}
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-4">Advogados Cadastrados</h3>
      <ul>
        {advogados.map((advogado) => (
          <li
            key={advogado.id}
            className="flex justify-between space-x-10 items-center p-4 mb-2 bg-gray-100 rounded-md"
          >
            <div>
              {advogado.nome} - {advogado.especialidade}
            </div>
            <div>
              <button
                onClick={() => handleEditAdvogado(advogado)}
                className="mr-2 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteAdvogado(advogado.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
