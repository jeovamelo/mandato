import React, { useState } from 'react';
import {
  TableProperties,
  LayoutGrid,
  Search,
  Filter,
  PlusCircle,
  MapPin,
  User,
  Edit2,
  CheckCircle2,
  Clock,
  UserX,
  Briefcase
} from 'lucide-react';
import { IndicacaoEnriquecida, LocalTrabalho } from '../../types';

interface GradeIndicacoesViewProps {
  indicacoes: IndicacaoEnriquecida[];
  locais: LocalTrabalho[];
  filtroTipo: string;
  onSelectFiltroTipo: (tipo: string) => void;
  onOpenNovaIndicacao: () => void;
  onOpenEditarIndicacao: (indicacaoId: string) => void;
  onOpenFichaIndicado: (indicadoId: string) => void;
  onDesligarIndicacao: (indicacaoId: string) => void;
  onDeleteIndicacao: (indicacaoId: string) => void;
}

export const GradeIndicacoesView: React.FC<GradeIndicacoesViewProps> = ({
  indicacoes,
  filtroTipo,
  onSelectFiltroTipo,
  onOpenNovaIndicacao,
  onOpenEditarIndicacao,
  onOpenFichaIndicado,
  onDesligarIndicacao
}) => {
  const [viewMode, setViewMode] = useState<'tabela' | 'cards'>('tabela');
  const [busca, setBusca] = useState('');
  const [filtroBairro, setFiltroBairro] = useState('ALL');
  const [filtroStatus, setFiltroStatus] = useState('ALL');

  // Lista única de bairros de residência dos indicados
  const bairrosDisponiveis = Array.from(
    new Set(indicacoes.map(i => i.indicado.bairro_residencia))
  ).sort();

  const indicacoesFiltradas = indicacoes.filter(item => {
    if (filtroTipo !== 'ALL' && item.local.tipo_instituicao !== filtroTipo) return false;
    if (filtroBairro !== 'ALL' && item.indicado.bairro_residencia !== filtroBairro) return false;
    if (filtroStatus !== 'ALL' && item.status !== filtroStatus) return false;

    if (busca.trim()) {
      const t = busca.toLowerCase();
      return (
        item.indicado.nome_completo.toLowerCase().includes(t) ||
        item.indicado.cpf.toLowerCase().includes(t) ||
        item.indicado.bairro_residencia.toLowerCase().includes(t) ||
        item.local.nome_empresa_ou_orgao.toLowerCase().includes(t) ||
        (item.local.sigla_ou_apelido && item.local.sigla_ou_apelido.toLowerCase().includes(t)) ||
        item.cargo_ou_funcao.toLowerCase().includes(t) ||
        (item.indicado.lideranca_responsavel && item.indicado.lideranca_responsavel.toLowerCase().includes(t))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Controles do Topo: Busca, Filtros e Modos de Visualização */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Switcher de Tabela vs Cards */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start">
            <button
              onClick={() => setViewMode('tabela')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'tabela'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableProperties className="h-3.5 w-3.5" />
              <span>Visão em Tabela</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'cards'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Visão em Cards</span>
            </button>
          </div>

          {/* Busca Instantânea */}
          <div className="flex items-center gap-3 flex-wrap flex-1 lg:max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome, CPF, bairro onde mora, terceirizada..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            onClick={onOpenNovaIndicacao}
            className="flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 flex-shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Nova Indicação</span>
          </button>
        </div>

        {/* Linha de Filtros por Categoria, Bairro e Status */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Filter className="h-3.5 w-3.5 text-brand-400" />
            <span>Filtrar:</span>
          </div>

          {/* Filtro Tipo de Lotação */}
          <select
            value={filtroTipo}
            onChange={(e) => onSelectFiltroTipo(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-brand-500 font-medium"
          >
            <option value="ALL">Todas as Lotações</option>
            <option value="Empresa Terceirizada">Apenas Empresas Terceirizadas</option>
            <option value="Prefeitura de Fortaleza">Prefeitura de Fortaleza (Órgãos Diretos)</option>
            <option value="Governo do Estado do Ceará">Governo do Estado do Ceará</option>
          </select>

          {/* Filtro Bairro de Moradia */}
          <select
            value={filtroBairro}
            onChange={(e) => setFiltroBairro(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-brand-500 font-semibold"
          >
            <option value="ALL">Todos os Bairros de Residência</option>
            {bairrosDisponiveis.map(b => (
              <option key={b} value={b}>
                Bairro: {b}
              </option>
            ))}
          </select>

          {/* Filtro Status */}
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 focus:outline-none focus:border-brand-500 font-semibold"
          >
            <option value="ALL">Todos os Status</option>
            <option value="Ativo">Ativos</option>
            <option value="Em Análise / Aguardando Vaga">Em Análise / Aguardando Vaga</option>
            <option value="Desligado">Desligados</option>
          </select>

          {(filtroTipo !== 'ALL' || filtroBairro !== 'ALL' || filtroStatus !== 'ALL' || busca) && (
            <button
              onClick={() => {
                onSelectFiltroTipo('ALL');
                setFiltroBairro('ALL');
                setFiltroStatus('ALL');
                setBusca('');
              }}
              className="text-brand-400 hover:text-brand-300 font-semibold underline text-[11px]"
            >
              Limpar Filtros
            </button>
          )}

          <span className="ml-auto text-[11px] text-slate-400">
            Exibindo <strong className="text-slate-200">{indicacoesFiltradas.length}</strong> de {indicacoes.length} indicações
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. VISÃO EM TABELA */}
      {/* ========================================================================= */}
      {viewMode === 'tabela' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Indicado / Contato</th>
                  <th className="py-3 px-4">Onde a Pessoa Mora</th>
                  <th className="py-3 px-4">Local de Trabalho / Terceirizada</th>
                  <th className="py-3 px-4">Cargo / Função</th>
                  <th className="py-3 px-4">Remuneração</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {indicacoesFiltradas.map((item) => {
                  const isTerceirizada = item.local.tipo_instituicao === 'Empresa Terceirizada';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Indicado */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {item.indicado.foto_url ? (
                            <img
                              src={item.indicado.foto_url}
                              alt={item.indicado.nome_completo}
                              className="h-8 w-8 rounded-full object-cover border border-slate-700 flex-shrink-0"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-brand-600/20 text-brand-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                              {item.indicado.nome_completo.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <button
                              onClick={() => onOpenFichaIndicado(item.indicado.id)}
                              className="font-bold text-slate-100 hover:text-brand-400 transition-colors text-left truncate block"
                            >
                              {item.indicado.nome_completo}
                            </button>
                            <p className="text-[11px] text-slate-400 font-mono">
                              CPF: {item.indicado.cpf} • {item.indicado.telefone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Onde Mora */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            <MapPin className="h-3 w-3 text-brand-400" />
                            {item.indicado.bairro_residencia}
                          </span>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">
                            {item.indicado.endereco_residencial}
                          </p>
                        </div>
                      </td>

                      {/* Local / Terceirizada */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                isTerceirizada
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                  : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                              }`}
                            >
                              {isTerceirizada ? 'TERCEIRIZADA' : item.local.sigla_ou_apelido || 'ÓRGÃO'}
                            </span>
                            <span className="font-semibold text-slate-200 truncate max-w-xs">
                              {item.local.nome_empresa_ou_orgao}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">
                            {item.local.endereco_trabalho}
                          </p>
                        </div>
                      </td>

                      {/* Cargo / Função */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-100">{item.cargo_ou_funcao}</p>
                        {item.indicado.lideranca_responsavel && (
                          <p className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">
                            Ref: {item.indicado.lideranca_responsavel}
                          </p>
                        )}
                      </td>

                      {/* Remuneração */}
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {item.remuneracao_estimada?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            item.status === 'Ativo'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : item.status === 'Em Análise / Aguardando Vaga'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {item.status === 'Ativo' ? (
                            <CheckCircle2 className="h-2.5 w-2.5" />
                          ) : (
                            <Clock className="h-2.5 w-2.5" />
                          )}
                          {item.status}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenFichaIndicado(item.indicado.id)}
                            className="p-1.5 rounded-lg bg-slate-800 text-brand-300 hover:text-white hover:bg-brand-600 transition-all text-xs font-semibold flex items-center gap-1"
                            title="Ver Ficha Cadastral Completa"
                          >
                            <User className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Ficha</span>
                          </button>

                          <button
                            onClick={() => onOpenEditarIndicacao(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                            title="Editar Dados da Indicação"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {item.status === 'Ativo' && (
                            <button
                              onClick={() => {
                                if (confirm(`Confirmar desligamento de ${item.indicado.nome_completo}?`)) {
                                  onDesligarIndicacao(item.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Registrar Desligamento"
                            >
                              <UserX className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VISÃO EM CARDS */}
      {/* ========================================================================= */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {indicacoesFiltradas.map((item) => {
            const isTerceirizada = item.local.tipo_instituicao === 'Empresa Terceirizada';

            return (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header do Card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {item.indicado.foto_url ? (
                        <img
                          src={item.indicado.foto_url}
                          alt={item.indicado.nome_completo}
                          className="h-10 w-10 rounded-full object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-brand-600/20 text-brand-300 font-bold flex items-center justify-center text-sm">
                          {item.indicado.nome_completo.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {item.indicado.nome_completo}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          CPF: {item.indicado.cpf}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        isTerceirizada
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                      }`}
                    >
                      {isTerceirizada ? 'TERCEIRIZADA' : 'DIRETO'}
                    </span>
                  </div>

                  {/* Onde Mora */}
                  <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-brand-400" />
                        Onde Mora (Fortaleza):
                      </span>
                      <span className="font-bold text-brand-300">{item.indicado.bairro_residencia}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">
                      {item.indicado.endereco_residencial}
                    </p>
                  </div>

                  {/* Onde Trabalha */}
                  <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-amber-400" />
                        Lotação / Empresa:
                      </span>
                      <span className="font-semibold text-slate-200 truncate max-w-[140px]">
                        {item.local.sigla_ou_apelido || item.local.nome_empresa_ou_orgao}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 truncate">
                      {item.cargo_ou_funcao}
                    </p>
                  </div>
                </div>

                {/* Rodapé do Card com Ações */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {item.remuneracao_estimada?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenFichaIndicado(item.indicado.id)}
                      className="py-1.5 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-all flex items-center gap-1 shadow-sm"
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>Ficha Completa</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
