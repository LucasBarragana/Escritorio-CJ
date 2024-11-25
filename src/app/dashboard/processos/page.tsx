'use client'
import { useState, useEffect } from 'react';

// Tipos para os dados
interface Lead {
  id: string;
  nome: string;
  telefone: string;
}

interface Advogado {
  id: string;
  nome: string;
  especialidade: string;
}

interface SDR {
  id: string;
  nome: string;
  cargo: string;
}

interface Processo {
  id: string;
  nomeLead: string;
  telefone: string;
  data: string;
  advogado: string;
  sdr: string;
  especialidade: string;
  status: string;
  contratoFechado: string;
  qualificacao: string;
  fechamento: string;
}

export default function ProcessoPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [sdrs, setSdrs] = useState<SDR[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [nomeLead, setNomeLead] = useState('');
  const [telefone, setTelefone] = useState('');
  const [data, setData] = useState('');
  const [advogadoId, setAdvogadoId] = useState('');
  const [sdrId, setSdrId] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [status, setStatus] = useState('');
  const [contratoFechado, setContratoFechado] = useState('');
  const [qualificacao, setQualificacao] = useState('');
  const [fechamento, setFechamento] = useState('');
  const [especialidadesDisponiveis] = useState(['Previdenciário', 'Criminal', 'Família']);
  const [statusDisponiveis] = useState(['Em atendimento', 'Enviado para fechamento', 'Repassado para adv', 'Consultório grátis']);
  const [contratoFechadoDisponiveis] = useState(['Não', 'Negociando', 'Sim']);
  const [qualificacaoDisponiveis] = useState(['Contato', 'Inicial']);
  const [fechamentoDisponiveis] = useState(['Não', 'Negociando', 'Sim']);
  const [editingProcessoId, setEditingProcessoId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Processo | null>(null); // Para pop-up

  useEffect(() => {
    const storedLeads = localStorage.getItem('leads');
    const storedAdvogados = localStorage.getItem('advogados');
    const storedSdrs = localStorage.getItem('sdrs');
    const storedProcessos = localStorage.getItem('processos');

    if (storedLeads) setLeads(JSON.parse(storedLeads));
    if (storedAdvogados) setAdvogados(JSON.parse(storedAdvogados));
    if (storedSdrs) setSdrs(JSON.parse(storedSdrs));
    if (storedProcessos) setProcessos(JSON.parse(storedProcessos));
  }, []);

  const handleNomeLeadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nome = e.target.value;
    setNomeLead(nome);

    // Verifica se o nomeLead corresponde a algum lead e preenche o telefone
    const lead = leads.find((lead) => lead.nome === nome);
    if (lead) {
      setTelefone(lead.telefone);
    } else {
      setTelefone('');
    }
  };

  const handleAddOrUpdateProcesso = (e: React.FormEvent) => {
    e.preventDefault();

    const newProcesso = {
      id: editingProcessoId || crypto.randomUUID(),
      nomeLead,
      telefone,
      data,
      advogado: advogados.find((advogado) => advogado.id === advogadoId)?.nome || '',
      sdr: sdrs.find((sdr) => sdr.id === sdrId)?.nome || '',
      especialidade,
      status,
      contratoFechado,
      qualificacao,
      fechamento: advogados.find((advogado) => advogado.id === fechamento)?.nome || '',
    };

    let updatedProcessos;

    if (editingProcessoId) {
      // Atualizar processo existente
      updatedProcessos = processos.map((processo) =>
        processo.id === editingProcessoId ? newProcesso : processo
      );
    } else {
      // Adicionar novo processo
      updatedProcessos = [...processos, newProcesso];
    }

    setProcessos(updatedProcessos); // Atualize o estado aqui
    localStorage.setItem('processos', JSON.stringify(updatedProcessos)); // Armazene o estado atualizado no localStorage

    // Resetar o formulário
    setNomeLead('');
    setTelefone('');
    setData('');
    setAdvogadoId('');
    setSdrId('');
    setEspecialidade('');
    setStatus('');
    setContratoFechado('');
    setQualificacao('');
    setFechamento('');
    setEditingProcessoId(null); // Limpar o ID de edição
  };

  const handleEditProcesso = (processo: Processo) => {
    setEditingProcessoId(processo.id); // Setar o processo para edição
    setNomeLead(processo.nomeLead);
    setTelefone(processo.telefone);
    setData(processo.data);
    setAdvogadoId(advogados.find((advogado) => advogado.nome === processo.advogado)?.id || '');
    setSdrId(sdrs.find((sdr) => sdr.nome === processo.sdr)?.id || '');
    setEspecialidade(processo.especialidade);
    setStatus(processo.status);
    setContratoFechado(processo.contratoFechado);
    setQualificacao(processo.qualificacao);
    setFechamento(advogados.find((advogado) => advogado.nome === processo.fechamento)?.id || '');
  };

  const handleDeleteProcesso = (processoId: string) => {
    const updatedProcessos = processos.filter((processo) => processo.id !== processoId);
    setProcessos(updatedProcessos); // Atualize o estado
    localStorage.setItem('processos', JSON.stringify(updatedProcessos)); // Armazene o estado atualizado no localStorage
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">{editingProcessoId ? 'Editar Processo' : 'Cadastrar Novo Processo'}</h2>
      <form onSubmit={handleAddOrUpdateProcesso} className="flex space-x-10 mb-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nome do Lead</label>
            <input
              type="text"
              list="lead-names"
              value={nomeLead}
              onChange={handleNomeLeadChange}
              placeholder="Digite o nome do lead"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
            {leads.length > 0 && (
              <datalist id="lead-names">
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.nome} />
                ))}
              </datalist>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)} // Permite a edição do telefone
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Telefone"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Negociação</label>
            <select
              value={advogadoId}
              onChange={(e) => setAdvogadoId(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="">Responsável pela pegociação</option>
              {advogados.map((advogado) => (
                <option key={advogado.id} value={advogado.id}>
                  {advogado.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Fechamento</label>
            <select
              value={fechamento}
              onChange={(e) => setFechamento(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="">Responsável pelo fechamento</option>
              {advogados.map((advogado) => (
                <option key={advogado.id} value={advogado.id}>
                  {advogado.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">SDR</label>
            <select
              value={sdrId}
              onChange={(e) => setSdrId(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="">Equipe SDR</option>
              {sdrs.map((sdr) => (
                <option key={sdr.id} value={sdr.id}>
                  {sdr.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Área</label>
            <select
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione a Área</option>
              {especialidadesDisponiveis.map((especialidade, index) => (
                <option key={index} value={especialidade}>
                  {especialidade}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione o Status</option>
              {statusDisponiveis.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contrato Fechado</label>
            <select
              value={contratoFechado}
              onChange={(e) => setContratoFechado(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione o Status do Contrato</option>
              {contratoFechadoDisponiveis.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Qualificação</label>
            <select
              value={qualificacao}
              onChange={(e) => setQualificacao(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione a Qualificação</option>
              {qualificacaoDisponiveis.map((qualificacao, index) => (
                <option key={index} value={qualificacao}>
                  {qualificacao}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">
            {editingProcessoId ? 'Atualizar Processo' : 'Cadastrar Processo'}
          </button>
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-4">Processos Cadastrados</h3>
      <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Pesquisar</label>
          <input
            type="email"
            className="p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Nome do Lead</th>
            <th className="border px-4 py-2">Data</th>
            <th className="border px-4 py-2">Negociação</th>
            <th className="border px-4 py-2">Fechamento</th>
            <th className="border px-4 py-2">SDR</th>
            <th className="border px-4 py-2">Área</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Contrato Fechado</th>
            <th className="border px-4 py-2">Qualificação</th>
            <th className="border px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {processos.map((processo) => (
            <tr key={processo.id}>
              <td className="border px-4 py-2">
                <button
                  className=" underline"
                  onClick={() => setSelectedLead(processo)}
                >
                  {processo.nomeLead.split(' ')[0]}
                </button>
              </td>
              <td className="border px-4 py-2">{processo.data}</td>
              <td className="border px-4 py-2">{processo.advogado}</td>
              <td className="border px-4 py-2">{processo.fechamento}</td>
              <td className="border px-4 py-2">{processo.sdr}</td>
              <td className="border px-4 py-2">{processo.especialidade}</td>
              <td className="border px-4 py-2">{processo.status}</td>
              <td className="border px-4 py-2">{processo.contratoFechado}</td>
              <td className="border px-4 py-2">{processo.qualificacao}</td>

              <td className="border px-4 py-2 ">
                <button
                  onClick={() => handleEditProcesso(processo)}
                  className="mr-2 my-2 bg-yellow-400 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteProcesso(processo.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedLead && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold">Detalhes do Lead</h3>
            <p><strong>Nome:</strong> {selectedLead.nomeLead}</p>
            <p><strong>Telefone:</strong> {selectedLead.telefone}</p>
            <button
              className="mt-4 bg-red-500 text-white p-2 rounded"
              onClick={() => setSelectedLead(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}