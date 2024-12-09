'use client';

import { useState, useEffect } from 'react';

interface Status {
  id: string;
  nome: string;
  backgroundColor: string;
}

export default function StatusPage() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [nome, setNome] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Controle de carregamento
  const [error, setError] = useState<string | null>(null); // Mensagens de erro

  const API_URL = '/api/status'; // Atualize o endpoint conforme necessário

  useEffect(() => {
    const fetchStatuses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Erro ao carregar os status');
        }
        const data = await response.json();
        setStatuses(data);
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

    fetchStatuses();
  }, [API_URL]);

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const statusData = { nome, backgroundColor, id: editingId };

    try {
      const response = await fetch(API_URL, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusData),
      });

      if (!response.ok) {
        throw new Error(
          editingId ? 'Erro ao atualizar o status' : 'Erro ao adicionar o status'
        );
      }

      const updatedStatus = await response.json();

      setStatuses((prev) =>
        editingId
          ? prev.map((item) => (item.id === editingId ? updatedStatus : item))
          : [...prev, updatedStatus]
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

  const handleEdit = (item: Status) => {
    setEditingId(item.id);
    setNome(item.nome);
    setBackgroundColor(item.backgroundColor);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar o status');
      }

      setStatuses((prev) => prev.filter((item) => item.id !== id));
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
        {editingId ? 'Editar Status' : 'Cadastrar Novo Status'}
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleAddOrUpdate} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nome do Status</label>
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
          {editingId ? 'Atualizar Status' : 'Adicionar Status'}
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-4">Status Cadastrados</h3>
      {loading && <p>Carregando...</p>}
      <ul>
        {statuses.map((item) => (
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
                onClick={() => handleEdit(item)}
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
