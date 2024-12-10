'use client';
import { useState, useEffect } from 'react';

interface Especialidade {
  id: string;
  nome: string;
  backgroundColor: string;
}

export default function EspecialidadePage() {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [nome, setNome] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [loading, setLoading] = useState(false); // Controle de carregamento
  const [error, setError] = useState<string | null>(null); // Controle de erros

  const API_URL = '/api/especialidades'; // Endpoint da API

  useEffect(() => {
    const fetchEspecialidades = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Erro ao carregar especialidades');
        const data = await res.json();
        setEspecialidades(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erro desconhecido');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEspecialidades();
  }, [API_URL]);

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const especialidadeData = { nome, backgroundColor, id: editingId };

    try {
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(API_URL, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(especialidadeData),
      });

      if (!res.ok) throw new Error(editingId ? 'Erro ao atualizar especialidade' : 'Erro ao adicionar especialidade');

      const updatedEspecialidade = await res.json();
      setEspecialidades((prev) =>
        editingId
          ? prev.map((item) => (item.id === editingId ? updatedEspecialidade : item))
          : [...prev, updatedEspecialidade]
      );
      setNome('');
      setBackgroundColor('#ffffff');
      setEditingId(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Especialidade) => {
    setEditingId(item.id);
    setNome(item.nome);
    setBackgroundColor(item.backgroundColor);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Erro ao deletar especialidade');

      setEspecialidades((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8">
      <h2 className="text-2xl font-semibold mb-6">
        {editingId ? 'Editar Área' : 'Cadastrar Nova Área'}
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleAddOrUpdate} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nome da Área</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cor de Fundo</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-[#751B1E] text-white rounded-lg hover:bg-gray-600"
          disabled={loading}
        >
          {editingId ? 'Atualizar Área' : 'Adicionar Área'}
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-4">Áreas Cadastradas</h3>
      {loading && <p>Carregando...</p>}
      <ul>
        {especialidades.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center gap-10 p-4 mb-2 bg-gray-100 rounded-md"
          >
            <span>{item.nome}</span>
            <span
              className="p-4 rounded-full"
              style={{ backgroundColor: item.backgroundColor }}
            ></span>
            <div>
              <button
                onClick={() => {handleEdit(item);window.scrollTo(0, 0);}}
                className="mr-2 px-4 py-2 rounded hover:bg-gray-200"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-4 py-2 rounded hover:bg-gray-200"
                disabled={loading}
              >
                Deletar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
