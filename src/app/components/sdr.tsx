'use client';

import { useState, useEffect } from 'react';

interface SDR {
  id: string;
  nome: string;
  cargo: string;
}

export default function SDRPage() {
  const [sdrs, setSdrs] = useState<SDR[]>([]);
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [editingSdrId, setEditingSdrId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Novo estado para controle de carregamento
  const [error, setError] = useState<string | null>(null); // Novo estado para mensagens de erro

  const API_URL = '/api/sdrs';

  useEffect(() => {
    const fetchSdrs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Erro ao carregar os SDRs');
        }
        const data = await response.json();
        setSdrs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSdrs();
  }, [API_URL]);

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const sdrData = { nome, cargo, id: editingSdrId };

    try {
      const response = await fetch(API_URL, {
        method: editingSdrId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sdrData),
      });

      if (!response.ok) {
        throw new Error(
          editingSdrId ? 'Erro ao atualizar o SDR' : 'Erro ao adicionar o SDR'
        );
      }

      const updatedSdr = await response.json();

      setSdrs((prev) =>
        editingSdrId
          ? prev.map((item) => (item.id === editingSdrId ? updatedSdr : item))
          : [...prev, updatedSdr]
      );

      setNome('');
      setCargo('');
      setEditingSdrId(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sdr: SDR) => {
    setEditingSdrId(sdr.id);
    setNome(sdr.nome);
    setCargo(sdr.cargo);
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
        throw new Error('Erro ao deletar o SDR');
      }

      setSdrs((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8">
      <h2 className="text-2xl font-semibold mb-6">
        {editingSdrId ? 'Editar SDR' : 'Cadastrar Novo SDR'}
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
          {editingSdrId ? 'Atualizar SDR' : 'Adicionar SDR'}
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-4">SDRs Cadastrados</h3>
      {loading && <p>Carregando...</p>}
      <ul>
        {sdrs.map((sdr) => (
          <li
            key={sdr.id}
            className="flex justify-between items-center gap-20 p-4 mb-2 bg-gray-100 rounded-md"
          >
            <span>{sdr.nome} - {sdr.cargo}</span>
            <div>
              <button
                onClick={() => handleEdit(sdr)}
                className="mr-2 px-4 py-2 rounded hover:bg-gray-200"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(sdr.id)}
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
