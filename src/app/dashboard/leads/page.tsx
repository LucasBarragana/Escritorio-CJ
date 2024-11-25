'use client';
import { useState, useEffect } from 'react';

interface Lead {
  id: string;
  nomeLead: string;
  telefone: string;
  cpfCnpj: string;
  email: string;
}

type Processo = {
  id: number;
  lead: string;
  status: string;
  area: string;
  responsavelFechamento: string;
};

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [nomeLead, setNomeLead] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [popupData, setPopupData] = useState<Processo[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const storedLeads = localStorage.getItem('leads');
    if (storedLeads) setLeads(JSON.parse(storedLeads));

    const storedProcessos = localStorage.getItem('processos');
    if (storedProcessos) setProcessos(JSON.parse(storedProcessos));
  }, []);

  const handleAddOrEditLead = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && editingId) {
      const updatedLeads = leads.map((lead) =>
        lead.id === editingId
          ? { ...lead, nomeLead, telefone, cpfCnpj, email }
          : lead
      );
      setLeads(updatedLeads);
      localStorage.setItem('leads', JSON.stringify(updatedLeads));
      setIsEditing(false);
      setEditingId(null);
    } else {
      const newLead: Lead = {
        id: Date.now().toString(),
        nomeLead,
        telefone,
        cpfCnpj,
        email,
      };
      const updatedLeads = [...leads, newLead];
      setLeads(updatedLeads);
      localStorage.setItem('leads', JSON.stringify(updatedLeads));
    }

    setNomeLead('');
    setTelefone('');
    setCpfCnpj('');
    setEmail('');
  };

  const handleDeleteLead = (id: string) => {
    const updatedLeads = leads.filter((lead) => lead.id !== id);
    setLeads(updatedLeads);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
  };

  const handleEditLead = (id: string) => {
    const leadToEdit = leads.find((lead) => lead.id === id);
    if (leadToEdit) {
      setNomeLead(leadToEdit.nomeLead);
      setTelefone(leadToEdit.telefone);
      setCpfCnpj(leadToEdit.cpfCnpj);
      setEmail(leadToEdit.email);
      setIsEditing(true);
      setEditingId(id);
    }
  };

  const handleShowProcessos = (nomeLead: string) => {
    const processosDoLead = processos.filter((processo) => processo.lead === nomeLead);
    setPopupData(processosDoLead);
    setIsPopupOpen(true);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditing ? 'Editar Lead' : 'Cadastrar Novo Lead'}
      </h2>

      <form onSubmit={handleAddOrEditLead} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input
            type="text"
            value={nomeLead}
            onChange={(e) => setNomeLead(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Telefone</label>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">CPF/CNPJ</label>
          <input
            type="text"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded-lg ${
            isEditing
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isEditing ? 'Salvar Alterações' : 'Adicionar Lead'}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4">Leads Cadastrados</h3>
      <div className="overflow-x-auto">
      <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Pesquisar</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">Nome</th>
              <th className="px-4 py-2 border-b text-left">Telefone</th>
              <th className="px-4 py-2 border-b text-left">CPF/CNPJ</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">Processos</th>
              <th className="px-4 py-2 border-b text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const processosCount = processos.filter((p) => p.lead === lead.nomeLead).length;
              return (
                <tr key={lead.id}>
                  <td className="px-4 py-2 border-b">{lead.nomeLead}</td>
                  <td className="px-4 py-2 border-b">
                    <a
                      href={`https://wa.me/${lead.telefone.replace(/[^\d]+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" underline"
                    >
                      {lead.telefone}
                    </a>
                  </td>
                  <td className="px-4 py-2 border-b">{lead.cpfCnpj}</td>
                  <td className="px-4 py-2 border-b">
                    <a
                      href={`mailto:${lead.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" underline"
                    >
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleShowProcessos(lead.nomeLead)}
                      className=" underline"
                    >
                      {processosCount}
                    </button>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleEditLead(lead.id)}
                      className="mr-2 text-yellow-500 underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="text-red-500 underline"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Processos do Lead</h3>
            <ul>
              {popupData.map((processo) => (
                <li key={processo.id} className="mb-2">
                  <strong>{processo.area}</strong> - Responsável: {processo.responsavelFechamento}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
