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

interface Especialidade {
  id: string;
  nome: string;
  backgroundColor: string;
}

interface Status {
  id: string;
  nome: string;
  backgroundColor: string;
}

interface ContratoFechado {
  id: string;
  nome: string;
  backgroundColor: string;
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
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [contratos, setContratos] = useState<ContratoFechado[]>([]);
  const [qualificacaoDisponiveis] = useState(['Contato', 'Inicial']);
  const [editingProcessoId, setEditingProcessoId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Processo | null>(null); // Para pop-up
  const [searchQuery, setSearchQuery] = useState('');
  const filteredProcessos = processos.filter((processo) =>
    processo.nomeLead.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const storedLeads = localStorage.getItem('leads');
    const storedAdvogados = localStorage.getItem('advogados');
    const storedSdrs = localStorage.getItem('sdrs');
    const storedProcessos = localStorage.getItem('processos');
    const storedEspecialidades = localStorage.getItem('especialidades');
    const storedStatuses = localStorage.getItem('statuses');
    const storedContratos = localStorage.getItem('contratos');

    if (storedLeads) setLeads(JSON.parse(storedLeads));
    if (storedAdvogados) setAdvogados(JSON.parse(storedAdvogados));
    if (storedSdrs) setSdrs(JSON.parse(storedSdrs));
    if (storedEspecialidades) {
      setEspecialidades(JSON.parse(storedEspecialidades));
    }
    if (storedStatuses) {
      setStatuses(JSON.parse(storedStatuses));
      if (storedContratos) {
        setContratos(JSON.parse(storedContratos));
      }      
    }
    if (storedProcessos) setProcessos(JSON.parse(storedProcessos));
  }, []);

    // Função para obter a cor do status selecionado
    const getEspecialidadeBackgroundColor = (especialidadeName: string) => {
      const especialidade = especialidades.find((item) => item.nome === especialidadeName);
      return especialidade ? especialidade.backgroundColor : '#ffffff';
    };

    const getStatusBackgroundColor = (statusName: string) => {
      const status = statuses.find((item) => item.nome === statusName);
      return status ? status.backgroundColor : '#ffffff';
    };

    const getContractBackgroundColor = (contratoFechadoName: string) => {
      const contratoFechado = contratos.find((item) => item.nome === contratoFechadoName);
      return contratoFechado ? contratoFechado.backgroundColor : '#ffffff';
    };
  

    // Verifica se o nomeLead corresponde a algum lead e preenche o telefone
  const handleNomeLeadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nome = e.target.value;
    setNomeLead(nome);


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
      especialidade: especialidades.find((item) => item.id === especialidade)?.nome || '',
      status: statuses.find((item) => item.id === status)?.nome || '',
      contratoFechado: contratos.find((item) => item.id === contratoFechado)?.nome || '',
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
    setEspecialidade(especialidades.find((especialidade) => especialidade.nome === processo.especialidade)?.id || '');
    setStatus(statuses.find((status) => status.nome === processo.status)?.id || '');
    setContratoFechado(contratos.find((contratoFechado) => contratoFechado.nome === processo.contratoFechado)?.id || '');
    setQualificacao(processo.qualificacao);
    setFechamento(advogados.find((advogado) => advogado.nome === processo.fechamento)?.id || '');
  };

  const handleDeleteProcesso = (processoId: string) => {
    const updatedProcessos = processos.filter((processo) => processo.id !== processoId);
    setProcessos(updatedProcessos); // Atualize o estado
    localStorage.setItem('processos', JSON.stringify(updatedProcessos)); // Armazene o estado atualizado no localStorage
  };

  // Função para abrir a plataforma de conversa DIgisac
  const handleOpenChat = async (telefone: string) => {
    try {
      const response = await fetch('https://api.digisac.com.br/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer SEU_TOKEN_API_AQUI', // Substitua pelo seu token
        },
        body: JSON.stringify({
          channel: 'whatsapp',
          phone: telefone,
          message: '', // Mensagem inicial (opcional)
        }),
      });

      if (response.ok) {
        alert(`Conversa iniciada com o número ${telefone} no Digisac!`);
      } else {
        const errorData = await response.json();
        console.error('Erro ao abrir conversa:', errorData);
        alert('Erro ao iniciar conversa. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro de integração:', error);
      alert('Erro de conexão com o Digisac.');
    }
  };

  return (
    <div className="p-10">
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
            <label className="block text-sm font-medium text-gray-700">Negociador</label>
            <select
              value={advogadoId}
              onChange={(e) => setAdvogadoId(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="">Responsável pela negociação </option>
              {advogados.map((advogado) => (
                <option key={advogado.id} value={advogado.id}>
                  {advogado.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Responsável</label>
            <select
              value={fechamento}
              onChange={(e) => setFechamento(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              required
            >
              <option value="">Responsável pelo andamento</option>
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
            >
              <option value="">Selecione a Especialidade</option>
              {especialidades.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
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
            >
              <option value="">Selecione o Status</option>
              {statuses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
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
            >
              <option value="">Selecione o Contrato Fechado</option>
              {contratos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
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
          <button type="submit" className="w-full bg-[#751B1E] text-white p-2 rounded-md">
            {editingProcessoId ? 'Atualizar Processo' : 'Cadastrar Processo'}
          </button>
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-4">Processos Cadastrados</h3>
      <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Pesquisar</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar pelo nome do lead"
            className="p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        
      <div className='w-full h-[4px] bg-red-900'></div>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2">Nome do Lead</th>
            <th className="px-4 py-2">Data</th>
            <th className="px-4 py-2">Negociador</th>
            <th className="px-4 py-2">Responsável</th>
            <th className="px-4 py-2">SDR</th>
            <th className="px-4 py-2">Área</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Contrato Fechado</th>
            <th className="px-4 py-2">Qualificação</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredProcessos.map((processo) => (
            <tr key={processo.id}>
              <td className="border-t border-t-[#771A1D] px-4 py-2">
                <button
                  className=" underline"
                  onClick={() => setSelectedLead(processo)}
                >
                  {processo.nomeLead.split(' ')[0]}
                </button>
                <br />
                <button
                    onClick={() => handleOpenChat(processo.telefone)}
                    className="text-xs color-black hover:text-md"
                  >
                    Digisac
                  </button>
              </td>
              <td className="border-t border-t-[#771A1D] px-4 py-2 text-sm">{processo.data}</td>
              <td className="border-t border-t-[#771A1D] px-4 py-2 text-sm">{processo.advogado}</td>
              <td className="border-t border-t-[#771A1D] px-4 py-2 text-sm">{processo.fechamento}</td>
              <td className="border-t border-t-[#771A1D] px-4 py-2 text-sm">{processo.sdr}</td>
              <td className="border-t border-t-[#771A1D] px-4 py-2">
                <p                  
                  className="flex justify-center px-2 py-1 rounded text-xs font-semibold"
                  style={{ backgroundColor: getEspecialidadeBackgroundColor(processo.status) }}
                >
                  {processo.especialidade}
                </p>
              </td>
              <td className="border-t border-t-[#771A1D] px-4 py-2">
                <p
                  className="flex justify-center px-2 py-1 rounded text-xs font-semibold"
                  style={{ backgroundColor: getStatusBackgroundColor(processo.status) }}
                >
                  {processo.status}
                </p>
              </td>
              <td className="border-t border-t-[#771A1D] px-4 py-2">
                <p
                  className="flex justify-center px-2 py-1 rounded text-xs font-semibold"
                  style={{ backgroundColor: getContractBackgroundColor(processo.contratoFechado) }}
                  >
                    {processo.contratoFechado}</p>
              </td>
              <td className="border-t border-t-[#771A1D] px-4 py-2">
                <p className='flex justify-center px-2 py-1 bg-gray-200 rounded text-xs font-semibold'>{processo.qualificacao}</p>
              </td>

              <td className="border-t border-t-[#771A1D] px-4 py-2 ">
                <div className='flex '>
                  <button
                    onClick={() => handleEditProcesso(processo)}
                    className="mr-2 my-2 px-3 py-1 rounded"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteProcesso(processo.id)}
                    className=" px-3 py-1 rounded"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='w-full h-[4px] bg-red-900'></div>
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