
'use client'
import { useState, useEffect } from 'react';

    {/* ---------- TIPOS DE DADOS ----------- */}

interface Advogado {
  id: string;
  nome: string;
  especialidade: string;
}

interface Representante {
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

interface Qualificacao {
  id: string;
  nome: string;
  backgroundColor: string;
}

interface Processo {
  id: string;
  nomeLead: string;
  telefone: string;
  data: string;
  advogadoId: string;
  representanteId: string;
  especialidadeId: string;
  statusId: string;
  contratoFechadoId: string;
  qualificacaoId: string;
  fechamentoId: string;
  precoProjeto: string;
}

export default function ProcessoPage() {
  const [advogados, setAdvogados] = useState<Advogado[]>([]);
  const [representantes, setRepresentantes] = useState<Representante[]>([]);
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [nomeLead, setNomeLead] = useState('');
  const [telefone, setTelefone] = useState('');
  const [data, setData] = useState('');
  const [advogadoId, setAdvogadoId] = useState('');
  const [representanteId, setRepresentanteId] = useState('');
  const [especialidadeId, setEspecialidadeId] = useState('');
  const [statusId, setStatusId] = useState('');
  const [contratoFechadoId, setContratoFechadoId] = useState('');
  const [qualificacaoId, setQualificacaoId] = useState('');
  const [qualificacoes, setQualificacoes] = useState<Qualificacao[]>([]);
  const [fechamentoId, setFechamentoId] = useState('');
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [contratos, setContratos] = useState<ContratoFechado[]>([]);
  const [precoProjeto, setPrecoProjeto] = useState('');
  const [editingProcessoId, setEditingProcessoId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Processo | null>(null); // Para pop-up

  {/* ---------- CONEXÕES ----------- */}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAdvogados, resRepresentantes, resProcessos, resEspecialidades, resStatuses, resContratos, resQualificacoes] = 
          await Promise.all([
            fetch('/api/advogados'),
            fetch('/api/representantes'),
            fetch('/api/processos'),
            fetch('/api/especialidades'),
            fetch('/api/status'),
            fetch('/api/contratos'),
            fetch('/api/qualificacoes'),
          ]);

        setAdvogados(await resAdvogados.json());
        setRepresentantes(await resRepresentantes.json());
        setProcessos(await resProcessos.json());
        setEspecialidades(await resEspecialidades.json());
        setStatuses(await resStatuses.json());
        setContratos(await resContratos.json());
        setQualificacoes(await resQualificacoes.json());
      } catch (error) {
        console.error('Erro ao carregar dados: ', error);
      }
    };

    fetchData();
  }, []);

  
  {/* ---------- INÍCIO FORMULÁRIO ----------- */}

    useEffect(() => {
      // Define a data do processo ou, se não houver, define a data atual
      if (!data) {
        const today = new Date().toISOString().split('T')[0]; // Formato yyyy-mm-dd
        setData(today);
      }
    }, []);
  
   // Função para salvar um novo processo ou editar
   const handleAddOrUpdateProcesso = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!nomeLead || !telefone || !advogadoId || !representanteId) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
  
    const requestBody = {
      nomeLead,
      telefone,
      data,
      advogadoId,
      representanteId,
      especialidadeId,
      statusId,
      contratoFechadoId,
      qualificacaoId,
      fechamentoId,
      precoProjeto,
    };
  
    try {
      if (editingProcessoId) {
        // Atualizar processo existente
        const response = await fetch('/api/processos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProcessoId, ...requestBody }),
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar o processo.');
        }
        const updatedProcesso = await response.json();
        setProcessos((prev) =>
          prev.map((processo) =>
            processo.id === editingProcessoId ? updatedProcesso : processo
          )
        );
        alert('Processo atualizado com sucesso!');
        setEditingProcessoId(null);
      } else {
        // Adicionar novo processo
        const response = await fetch('/api/processos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('Erro ao salvar o processo.');
        }

        const newProcesso = await response.json();
        setProcessos((prev) => [...prev, newProcesso]);
        alert('Processo salvo com sucesso!');
      }
  
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar processo: ', error);
    }
  };
  
  const handleDeleteProcesso = async (processoId: string) => {
    try {
      const response = await fetch('/api/processos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: processoId }),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao deletar o processo.');
      }
  
      setProcessos((prev) => prev.filter((processo) => processo.id !== processoId));
      alert('Processo deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar processo: ', error);
    }
  };
  
  const resetForm = () => {
    setNomeLead('');
    setTelefone('');
    setData('');
    setAdvogadoId('');
    setRepresentanteId('');
    setEspecialidadeId('');
    setStatusId('');
    setContratoFechadoId('');
    setQualificacaoId('');
    setFechamentoId('');
    setEditingProcessoId(null);
    setPrecoProjeto('');
  };
  {/* ---------- FIM FORMULÁRIO ----------- */}


  {/* ---------- INÍCIO FILTRO E TABELA ----------- */}

  // Estado para armazenar o campo selecionado para pesquisa
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState<string>('nomeLead');

  // Atualização da lógica de filtragem
  const filteredProcessos = processos.filter((processo) => {
    let fieldValue;

    // Tratar campos específicos baseados em IDs
    if (searchField === 'advogadoId') {
      const advogado = advogados.find((adv) => adv.id === processo.advogadoId);
      fieldValue = advogado?.nome;
    } else if (searchField === 'representanteId') {
      const representante = representantes.find(
        (rep) => rep.id === processo.representanteId
      );
      fieldValue = representante?.nome;
    } else if (searchField === 'especialidadeId') {
      const especialidade = especialidades.find(
        (esp) => esp.id === processo.especialidadeId
      );
      fieldValue = especialidade?.nome;
    } else if (searchField === 'statusId') {
      const status = statuses.find((st) => st.id === processo.statusId);
      fieldValue = status?.nome;
    } else if (searchField === 'contratoFechadoId') {
      const contrato = contratos.find(
        (cf) => cf.id === processo.contratoFechadoId
      );
      fieldValue = contrato?.nome;
    } else {
      fieldValue = processo[searchField as keyof typeof processo];
    }

    
    return fieldValue
      ?.toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  // Estado para armazenar o campo de pesquisa, campo de ordenação e ordem de ordenação
const [sortOrder] = useState<'asc' | 'desc'>('desc');

// Função para ordenar a lista
const sortedProjetos = [...filteredProcessos].sort((a, b) => {
  const dateA = new Date(a.data).getTime();
  const dateB = new Date(b.data).getTime();

  return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
});

  // Função para atualizar os dados do formulário para edição
  const handleEditProcesso = (processo: Processo) => {
    setEditingProcessoId(processo.id);
    setNomeLead(processo.nomeLead);
    setTelefone(processo.telefone);
    setData(new Date(processo.data).toISOString().split('T')[0]); 
    setAdvogadoId(processo.advogadoId);
    setRepresentanteId(processo.representanteId);
    setEspecialidadeId(processo.especialidadeId);
    setStatusId(processo.statusId);
    setContratoFechadoId(processo.contratoFechadoId);
    setQualificacaoId(processo.qualificacaoId);
    setFechamentoId(processo.fechamentoId);
    setPrecoProjeto(processo.precoProjeto);
  };

  // Função para abrir a plataforma de conversa DIgisac
  const handleOpenChat = async (telefone: string) => {
    try {
      // A URL da conversa no Digisac (ou outro sistema) já com o telefone
      const chatUrl = `https://carvalhoebrum.digisac.me/conversa/${telefone}`;
  
      // Abre a janela com a plataforma Digisac e redireciona diretamente para a conversa
      window.open(chatUrl, '_blank'); // '_blank' abre em uma nova aba/guia
  
      alert(`A plataforma Digisac foi aberta para o número ${telefone}`);
    } catch (error) {
      console.error('Erro ao abrir o chat:', error);
      alert('Erro ao abrir a plataforma Digisac.');
    }
  };

  {/* ---------- FIM FILTRO E TABELA ----------- */}





  return (
    <div className="p-10 w-full overflow-x-auto"> 

    {/* ---------- INÍCIO DO FORMULÁRIO ----------- */}

      <h2 className="text-2xl font-semibold mb-6">{editingProcessoId ? 'Editar Processo' : 'Cadastrar Novo Processo'}</h2>
      <form onSubmit={handleAddOrUpdateProcesso} className="flex flex-wrap gap-10 mb-6">
        <div className='flex gap-8'>
          <div>
            <div className="mb-4">
              <label className="block text-xs  sm:text-sm font-medium text-gray-700">Nome do Lead</label>
              <input
                type="text"
                list="lead-names"
                value={nomeLead}
                onChange={(e) => setNomeLead(e.target.value)} 
                placeholder="Digite o nome do lead"
                className="w-full text-sm sm:text-base p-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs  sm:text-sm font-medium text-gray-700">Telefone</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)} 
                className="w-full text-sm sm:text-base p-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Telefone"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs  sm:text-sm font-medium text-gray-700">Valor do Proceso</label>
              <input
                type="text"
                value={precoProjeto}
                onChange={(e) => setPrecoProjeto(e.target.value)} 
                className="w-full text-sm sm:text-base p-2 mt-1 border border-gray-300 rounded-md"
                placeholder="Valor do Processo"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs  sm:text-sm font-medium text-gray-700">Data</label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full text-sm sm:text-base p-2 mt-1 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
          <div className="mb-4">
            <label className="block text-xs  sm:text-sm font-medium text-gray-700">Negociador</label>
            <select
              value={advogadoId}
              onChange={(e) => setAdvogadoId(e.target.value)}
              className="w-full text-sm sm:text-base p-2 mt-1 border border-gray-300 rounded-md"
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
            <label className="block text-xs  sm:text-sm font-medium text-gray-700">Responsável</label>
            <select
              value={fechamentoId}
              onChange={(e) => setFechamentoId(e.target.value)}
              className="w-full text-sm sm:text-base p-2 mt-1 border border-gray-300 rounded-md"
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
            <label className="block text-xs  sm:text-sm font-medium text-gray-700">SDR</label>
              <select
                value={representanteId}
                onChange={(e) => setRepresentanteId(e.target.value)}
                className="w-full text-sm sm:text-base p-2 mt-1 border border-gray-300 rounded-md"
                required
              >
                <option value="">Equipe SDR</option>
                {representantes.map((representante) => (
                  <option key={representante.id} value={representante.id}>
                    {representante.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className='flex gap-8'>
        <div>
          <div className="mb-4">
            <label className="block text-xs  sm:text-sm font-medium text-gray-700">Área</label>
            <select
              value={especialidadeId}
              onChange={(e) => setEspecialidadeId(e.target.value)}
              className="w-full text-sm sm:text-base p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="">Selecione a Especialidade</option>
              {especialidades.map((especialidade) => (
                <option key={especialidade.id} value={especialidade.id}>
                  {especialidade.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-xs  sm:text-sm font-medium text-gray-700">Status</label>
              <select
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
              className="w-full text-sm sm:text-base p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="">Selecione o Status</option>
              {statuses.map((especialidade) => (
                <option key={especialidade.id} value={especialidade.id}>
                  {especialidade.nome}
                </option>
              ))}
          </select>
          </div>

          <div className="mb-4">
            <label className="block text-xs  sm:text-sm font-medium text-gray-700">Contrato Fechado</label>
              <select
                value={contratoFechadoId}
                onChange={(e) => setContratoFechadoId(e.target.value)}
                className="w-full text-sm sm:text-base p-2 mt-1 border border-gray-300 rounded-md"
              >
                <option value="">Selecione o Contrato Fechado</option>
                {contratos.map((especialidade) => (
                  <option key={especialidade.id} value={especialidade.id}>
                    {especialidade.nome}
                  </option>
                ))}
            </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs  sm:text-sm font-medium text-gray-700">Qualificação</label>
              <select
                value={qualificacaoId}
                onChange={(e) => setQualificacaoId(e.target.value)}
                className="w-full text-sm sm:text-base p-2 mt-1 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecione a Qualificação</option>
                {qualificacoes.map((qualificacao) => (
                  <option key={qualificacao.id} value={qualificacao.id}>
                    {qualificacao.nome}
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
        </div>
      </form>

     {/* ---------- FIM DO FORMULÁRIO ----------- */}

    {/* ---------- INÍCIO DA TABELA E PESQUISA ----------- */}

      <h3 className="text-xl font-semibold mb-4">Processos Cadastrados</h3>
      <div className='flex gap-4 pr-4'>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pesquisar por</label>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="p-2 mt-1 border border-gray-300 rounded-md text-sm sm:p-2 mt-1 border border-gray-300 rounded-md text-base"
          >
            <option value="nomeLead">Nome do Lead</option>
            <option value="telefone">Telefone</option>
            <option value="data">Data</option>
            <option value="advogadoId">Negociador</option>
            <option value="representanteId">SDR</option>
            <option value="especialidadeId">Área</option>
            <option value="statusId">Status</option>
            <option value="contratoFechadoId">Contrato Fechado</option>
            <option value="qualificacao">Qualificação</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Pesquisar</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Pesquisar por ${searchField}`}
            className="p-2 mt-1 border border-gray-300 rounded-md text-sm sm:p-2 mt-1 border border-gray-300 rounded-md text-base"
          />
        </div>
      </div>
        
      <div className=' h-[4px] bg-red-900'></div>
      <div className="w-full overflow-x-auto max-h-[500px] overflow-y-auto  scrollbar-gutter-stable">
        <table className=" table-auto border-collapse w-full">
          <thead>
            <tr className='text-sm sm:text-base'>
              <th className="px-4 py-2">Nome do Lead</th>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Negociador</th>
              <th className="px-4 py-2">Responsável</th>
              <th className="px-4 py-2">SDR</th>
              <th className="px-4 py-2">Área</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Contrato</th>
              <th className="px-4 py-2">Qualificação</th>
              <th className="px-4 py-2">R$ Processo </th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody className=''>
            {sortedProjetos.map((processo) => (
              <tr key={processo.id}>
                <td className="text-center border-t border-t-[#771A1D] px-4 py-2">
                  <button
                    className=" underline text-xs sm:text-sm"
                    onClick={() => setSelectedLead(processo)}
                  >
                    {processo.nomeLead}
                  </button>
                  <br />
                  <button
                      onClick={() => handleOpenChat(processo.telefone)}
                      className="text-xs color-black hover:text-md"
                    >
                      Digisac
                    </button>
                </td>
                <td className="border-t border-t-[#771A1D] px-4 py-2 text-xs ">
                  {(new Date(processo.data).toISOString().split('T')[0])}
                </td>
                <td className="border-t border-t-[#771A1D] text-xs px-4 py-2">
                  {advogados.find((advogado) => advogado.id === processo.advogadoId)?.nome || 'N/A'}
                </td>
                <td className="border-t border-t-[#771A1D] text-xs px-4 py-2">
                  {advogados.find((advogado) => advogado.id === processo.fechamentoId)?.nome || 'N/A'}
                </td>
                <td className="border-t border-t-[#771A1D] text-xs px-4 py-2">
                  {representantes.find((representante) => representante.id === processo.representanteId)?.nome || 'N/A'}
                </td>
                <td className="border-t border-t-[#771A1D] px-4 py-2">
                  <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: especialidades.find((e) => e.id === processo.especialidadeId)
                            ?.backgroundColor || '#ffffff',
                        }}
                      >
                        {especialidades.find((e) => e.id === processo.especialidadeId)?.nome || 'N/A'}
                  </span>
                </td>
                <td className="border-t border-t-[#771A1D] px-4 py-2">
                  <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: statuses.find((e) => e.id === processo.statusId)
                            ?.backgroundColor || '#ffffff',
                        }}
                      >
                        {statuses.find((e) => e.id === processo.statusId)?.nome || 'N/A'}
                  </span>
                </td>
                <td className="border-t border-t-[#771A1D] px-4 py-2">
                  <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: contratos.find((e) => e.id === processo.contratoFechadoId)
                            ?.backgroundColor || '#ffffff',
                        }}
                      >
                        {contratos.find((e) => e.id === processo.contratoFechadoId)?.nome || 'N/A'}
                  </span>
                </td>
                <td className="border-t border-t-[#771A1D] px-4 py-2">
                  <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: qualificacoes.find((e) => e.id === processo.qualificacaoId)
                            ?.backgroundColor || '#ffffff',
                        }}
                      >
                        {qualificacoes.find((e) => e.id === processo.qualificacaoId)?.nome || 'N/A'}
                  </span>
                </td>

                <td className="border-t border-t-[#771A1D] px-4 py-2">
                  <span className="px-2 py-1 rounded text-xs font-semibold"                    >
                    {processo.precoProjeto}
                  </span>
                </td>

                <td className="border-t border-t-[#771A1D] px-4 py-2 ">
                  <div className='block'>
                    <button
                        onClick={() => {
                          handleEditProcesso(processo);
                          window.scrollTo(0, 0); 
                        }}
                      className="mr-2 my-2 px-3 py-1 rounded"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteProcesso(processo.id)}
                      className=" px-3 py-1 rounded"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='w-full h-[4px] bg-red-900'></div>

    {/* ---------- FIM DA TABELA E PESQUISA ----------- */}


    {/* ---------- INÍCIO DO POPUP DO CONTATO ----------- */}
      {selectedLead && (
        <div className="fixed inset-0 flex especialidades-center justify-center bg-black bg-opacity-50">
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
    {/* ---------- FIM DO POPUP DO CONTATO ----------- */}
    </div>
  );
}