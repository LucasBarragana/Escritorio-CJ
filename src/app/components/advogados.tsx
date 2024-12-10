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
    fetch('/api/advogados')
      .then((response) => response.json())
      .then((data) => setAdvogados(data));
  }, []);

  const handleAddOrUpdateAdvogado = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestBody = { nome, especialidade };
    if (editingAdvogadoId) {
      // Atualizar advogado existente
      const response = await fetch('/api/advogados', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editingAdvogadoId, ...requestBody }),
      });
      const updatedAdvogado = await response.json();
      setAdvogados((prev) =>
        prev.map((advogado) =>
          advogado.id === editingAdvogadoId ? updatedAdvogado : advogado
        )
      );
      setEditingAdvogadoId(null);
    } else {
      // Adicionar novo advogado
      const response = await fetch('/api/advogados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const newAdvogado = await response.json();
      setAdvogados((prev) => [...prev, newAdvogado]);
    }

    setNome('');
    setEspecialidade('');
  };

  const handleEditAdvogado = (advogado: Advogado) => {
    setEditingAdvogadoId(advogado.id);
    setNome(advogado.nome);
    setEspecialidade(advogado.especialidade);
  };

  const handleDeleteAdvogado = async (advogadoId: string) => {
    await fetch('/api/advogados', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: advogadoId }),
    });
    setAdvogados((prev) => prev.filter((advogado) => advogado.id !== advogadoId));
  };

  return (
    <div className="px-8">
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
          className="w-full py-2 bg-[#751B1E] text-white rounded-lg hover:bg-gray-600"
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
                onClick={() => {handleEditAdvogado(advogado);window.scrollTo(0, 0);}}
                className="mr-2 px-4 py-2 rounded hover:bg-gray-200"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteAdvogado(advogado.id)}
                className="px-4 py-2 rounded hover:bg-gray-200"
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
