import React, { useState } from 'react';
import {
  Briefcase,
  PlusCircle,
  Edit2,
  Trash2,
  Users,
  Search
} from 'lucide-react';
import { LocalTrabalho, IndicacaoEnriquecida } from '../../types';

interface LocaisViewProps {
  locais: LocalTrabalho[];
  grade: IndicacaoEnriquecida[];
  onOpenNovoLocal: () => void;
  onOpenEditarLocal: (localId: string) => void;
  onDeleteLocal: (localId: string) => void;
}

export const LocaisView: React.FC<LocaisViewProps> = ({
  locais,
  grade,
  onOpenNovoLocal,
  onOpenEditarLocal,
  onDeleteLocal
}) => {
  const [filtroTipo, setFiltroTipo] = useState<string>('ALL');
  const [busca, setBusca] = useState('');

  const locaisFiltrados = locais.filter(l => {
    if (filtroTipo !== 'ALL' && l.tipo_instituicao !== filtroTipo) return false;
    if (busca.trim()) {
      const t = busca.toLowerCase();
      return (
        l.nome_empresa_ou_orgao.toLowerCase().includes(t) ||
        (l.sigla_ou_apelido && l.sigla_ou_apelido.toLowerCase().includes(t)) ||
        l.endereco_trabalho.toLowerCase().includes(t) ||
        (l.contrato_convenio && l.contrato_convenio.toLowerCase().includes(t))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-amber-400" />
            Locais de Trabalho & Empresas Terceirizadas ({locais.length})
          </h2>
          <p className="text-xs text-slate-400">
            Controle de empresas prestadoras de serviço (Criart, Servis, Marquise, etc.) e secretarias
          </p>
        </div>

        <button
          onClick={onOpenNovoLocal}
          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 flex-shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Cadastrar Empresa Terceirizada / Órgão</span>
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por empresa terceirizada, secretaria, posto ou contrato..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Chips de Seleção */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFiltroTipo('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filtroTipo === 'ALL'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Todos ({locais.length})
          </button>
          <button
            onClick={() => setFiltroTipo('Empresa Terceirizada')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filtroTipo === 'Empresa Terceirizada'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Terceirizadas (Prestadoras)
          </button>
          <button
            onClick={() => setFiltroTipo('Prefeitura de Fortaleza')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filtroTipo === 'Prefeitura de Fortaleza'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Prefeitura (PMF)
          </button>
          <button
            onClick={() => setFiltroTipo('Governo do Estado do Ceará')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filtroTipo === 'Governo do Estado do Ceará'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Estado (CE)
          </button>
        </div>
      </div>

      {/* Grid de Cards de Locais / Terceirizadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locaisFiltrados.map((local) => {
          const pessoasAlocadas = grade.filter(g => g.local_trabalho_id === local.id && g.status === 'Ativo');
          const isTerceirizada = local.tipo_instituicao === 'Empresa Terceirizada';

          return (
            <div
              key={local.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border inline-block mb-1 ${
                        isTerceirizada
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                      }`}
                    >
                      {local.tipo_instituicao}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {local.nome_empresa_ou_orgao}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditarLocal(local.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                      title="Editar Local"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Excluir ${local.nome_empresa_ou_orgao}?`)) {
                          onDeleteLocal(local.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Excluir Local"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Endereço do Posto */}
                <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Posto Físico de Trabalho:
                  </span>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {local.endereco_trabalho}
                  </p>
                  {local.bairro_trabalho && (
                    <span className="text-[10px] text-brand-400 font-mono block pt-0.5">
                      Bairro: {local.bairro_trabalho}
                    </span>
                  )}
                </div>

                {/* Contrato e Contatos */}
                <div className="space-y-1 text-xs text-slate-400">
                  {local.contrato_convenio && (
                    <p className="font-mono text-[11px] text-slate-300">
                      📄 {local.contrato_convenio}
                    </p>
                  )}
                  {local.responsavel_contato && (
                    <p className="text-[11px]">
                      Contato: <strong className="text-slate-200">{local.responsavel_contato}</strong> {local.telefone_contato && `(${local.telefone_contato})`}
                    </p>
                  )}
                </div>
              </div>

              {/* Indicados Alocados no Posto */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Indicados Ativos:</span>
                <span className="font-bold text-brand-300 font-mono bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
                  <Users className="h-3 w-3 text-brand-400" />
                  {pessoasAlocadas.length} pessoa(s)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
