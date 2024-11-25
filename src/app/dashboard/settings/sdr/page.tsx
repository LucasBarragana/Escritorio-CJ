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
  const [editingSdrId, setEditingSdrId] = useState<string | null>(null); // ID do SDR sendo editado

  useEffect(() => {
    const storedSdrs = localStorage.getItem('sdrs');
    if (storedSdrs) {
      setSdrs(JSON.parse(storedSdrs));
    }
  }, []);

  const handleAddOrUpdateSdr = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSdrId) {
      // Atualizar SDR existente
      const updatedSdrs = sdrs.map((sdr) =>
        sdr.id === editingSdrId ? { ...sdr, nome, cargo } : sdr
      );
      setSdrs(updatedSdrs);
      localStorage.setItem('sdrs', JSON.stringify(updatedSdrs));
      setEditingSdrId(null);
    } else {
      // Adicionar novo SDR
      const newSdr = { id: Date.now().toString(), nome, cargo };
      const updatedSdrs = [...sdrs, newSdr];
      setSdrs(updatedSdrs);
      localStorage.setItem('sdrs', JSON.stringify(updatedSdrs));
    }

    setNome('');
    setCargo('');
  };

  const handleEditSdr = (sdr: SDR) => {
    setEditingSdrId(sdr.id);
    setNome(sdr.nome);
    setCargo(sdr.cargo);
  };

  const handleDeleteSdr = (sdrId: string) => {
    const updatedSdrs = sdrs.filter((sdr) => sdr.id !== sdrId);
    setSdrs(updatedSdrs);
    localStorage.setItem('sdrs', JSON.stringify(updatedSdrs));
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">
        {editingSdrId ? 'Editar SDR' : 'Cadastrar Novo SDR'}
      </h2>
      <form onSubmit={handleAddOrUpdateSdr} className="mb-6">
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
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {editingSdrId ? 'Atualizar SDR' : 'Adicionar SDR'}
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-4">SDRs Cadastrados</h3>
      <ul>
        {sdrs.map((sdr) => (
          <li
            key={sdr.id}
            className="flex justify-between space-x-10 items-center p-4 mb-2 bg-gray-100 rounded-md"
          >
            <div>
              {sdr.nome} - {sdr.cargo}
            </div>
            <div>
              <button
                onClick={() => handleEditSdr(sdr)}
                className="mr-2 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteSdr(sdr.id)}
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
