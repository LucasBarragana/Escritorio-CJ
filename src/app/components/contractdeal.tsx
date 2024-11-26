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

  useEffect(() => {
    const storedContratos = localStorage.getItem('contratos');
    if (storedContratos) {
      setContratos(JSON.parse(storedContratos));
    }
  }, []);

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const updated = contratos.map((item) =>
        item.id === editingId ? { ...item, nome, backgroundColor  } : item
      );
      setContratos(updated);
      localStorage.setItem('contratos', JSON.stringify(updated));
      setEditingId(null);
    } else {
      const newContrato = { id: Date.now().toString(), nome, backgroundColor };
      const updated = [...contratos, newContrato];
      setContratos(updated);
      localStorage.setItem('contratos', JSON.stringify(updated));
    }
    setBackgroundColor('#ffffff');
    setNome('');
  };

  const handleEdit = (item: ContratoFechado) => {
    setEditingId(item.id);
    setNome(item.nome);
    setBackgroundColor(item.backgroundColor);
  };

  const handleDelete = (id: string) => {
    const updated = contratos.filter((item) => item.id !== id);
    setContratos(updated);
    localStorage.setItem('contratos', JSON.stringify(updated));
  };

  return (
    <div className="px-8">
      <h2 className="text-2xl font-semibold mb-6">
        {editingId ? 'Editar Situação' : 'Cadastrar Nova Situação Contratual'}
      </h2>
      <form onSubmit={handleAddOrUpdate} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Situação do Contrato</label>
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
        >
          {editingId ? 'Atualizar Contrato' : 'Adicionar Contrato'}
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-4">Contratos Cadastrados</h3>
      <ul>
        {contratos.map((item) => (
          <li key={item.id} className="flex justify-between items-center gap-20 p-4 mb-2 bg-gray-100 rounded-md">
            <span>{item.nome}</span>
            <span className='p-4 rounded-full'style={{ backgroundColor: item.backgroundColor }}></span>
            <div>
              <button
                onClick={() => handleEdit(item)}
                className="mr-2 px-4 py-2 rounded hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>

              </button>
              <button
                onClick={() => handleDelete(item.id)}
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
