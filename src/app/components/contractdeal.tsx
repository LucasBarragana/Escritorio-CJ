'use client';

import { useState, useEffect } from 'react';

interface ContratoFechado {
  id: string;
  nome: string;
  backgroundColor: string;
}

export default function ContratoFechadoPage() {
  const [contratos, setContratos] = useState<ContratoFechado[]>([]);
  const [nome, setNome] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [loading, setLoading] = useState(false); // Novo estado para controle de carregamento
  const [error, setError] = useState<string | null>(null); // Novo estado para mensagens de erro

  // Atualize o endpoint caso necessário
  const API_URL = '/api/contratos'; 

  useEffect(() => {
    const fetchContratos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Erro ao carregar os contratos');
        }
        const data = await response.json();
        setContratos(data); // Corrige para salvar os contratos no estado
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
  
    fetchContratos();
  }, []);

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const contratoData = { nome, backgroundColor, id: editingId };

    try {
      const response = await fetch(API_URL, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contratoData),
      });

      if (!response.ok) {
        throw new Error(
          editingId ? 'Erro ao atualizar o contrato' : 'Erro ao adicionar o contrato'
        );
      }

      const updatedContrato = await response.json();

      setContratos((prev) =>
        editingId
          ? prev.map((item) => (item.id === editingId ? updatedContrato : item))
          : [...prev, updatedContrato]
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

  const handleEdit = (item: ContratoFechado) => {
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
        throw new Error('Erro ao deletar o contrato');
      }

      setContratos((prev) => prev.filter((item) => item.id !== id));
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
        {editingId ? 'Editar Situação' : 'Cadastrar Nova Situação Contratual'}
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleAddOrUpdate} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Situação do Contrato
          </label>
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
          {editingId ? 'Atualizar Contrato' : 'Adicionar Contrato'}
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-4">Contratos Cadastrados</h3>
      {loading && <p>Carregando...</p>}
      <ul>
        {contratos.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center gap-20 p-4 mb-2 bg-gray-100 rounded-md"
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
