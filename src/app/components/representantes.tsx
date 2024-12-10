'use client';

import { useState, useEffect } from 'react';

interface Representante {
  id: string;
  nome: string;
  cargo: string;
}

export default function RepresentantePage() {
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [editingRepresentanteId, setEditingRepresentanteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = '/api/representantes';

  useEffect(() => {
    const fetchRepresentantes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Erro ao carregar os representantes');
        }
        const data = await response.json();
        setRepresentantes(data);
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

    fetchRepresentantes();
  }, [API_URL]);

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const representanteData = { nome, cargo, id: editingRepresentanteId };

    try {
      const response = await fetch(API_URL, {
        method: editingRepresentanteId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(representanteData),
      });

      if (!response.ok) {
        throw new Error(
          editingRepresentanteId
            ? 'Erro ao atualizar o representante'
            : 'Erro ao adicionar o representante'
        );
      }

      const updatedRepresentante = await response.json();

      setRepresentantes((prev) =>
        editingRepresentanteId
          ? prev.map((item) => (item.id === editingRepresentanteId ? updatedRepresentante : item))
          : [...prev, updatedRepresentante]
      );

      setNome('');
      setCargo('');
      setEditingRepresentanteId(null);
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

  const handleEdit = (representante: Representante) => {
    setEditingRepresentanteId(representante.id);
    setNome(representante.nome);
    setCargo(representante.cargo);
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
        throw new Error('Erro ao deletar o representante');
      }

      setRepresentantes((prev) => prev.filter((item) => item.id !== id));
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
        {editingRepresentanteId ? 'Editar Representante' : 'Cadastrar Novo Representante'}
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleAddOrUpdate} className="mb-6">
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
          <label className="block text-sm font-medium text-gray-700">Cargo</label>
          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-[#751B1E] text-white rounded-lg hover:bg-gray-600"
          disabled={loading}
        >
          {editingRepresentanteId ? 'Atualizar Representante' : 'Adicionar Representante'}
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-4">Representantes Cadastrados</h3>
      {loading && <p>Carregando...</p>}
      <ul>
        {representantes.map((representante) => (
          <li
            key={representante.id}
            className="flex justify-between items-center gap-20 p-4 mb-2 bg-gray-100 rounded-md"
          >
            <span>{representante.nome} - {representante.cargo}</span>
            <div>
              <button
                onClick={() => {handleEdit(representante);window.scrollTo(0, 0);}}
                className="mr-2 px-4 py-2 rounded hover:bg-gray-200"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(representante.id)}
                className="px-4 py-2 rounded hover:bg-gray-200"
                disabled={loading}
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
