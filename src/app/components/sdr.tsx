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
    <div className="px-8">
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
          className="w-full py-2 bg-[#751B1E] text-white rounded-lg hover:bg-gray-600"
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
                className="mr-2 px-4 py-2 rounded hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
              <button
                onClick={() => handleDeleteSdr(sdr.id)}
                className="px-4 py-2 rounded hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
