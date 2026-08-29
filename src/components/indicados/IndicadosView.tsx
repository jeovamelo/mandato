import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  MapPin,
  Phone,
  Edit2,
  Trash2,
  Briefcase
} from 'lucide-react';
import { Indicado, IndicacaoEnriquecida } from '../../types';

interface IndicadosViewProps {
  indicados: Indicado[];
  grade: IndicacaoEnriquecida[];
  onOpenNovoIndicado: () => void;
  onOpenEditarIndicado: (indicadoId: string) => void;
  onOpenFichaIndicado: (indicadoId: string) => void;
  onDeleteIndicado: (indicadoId: string) => void;
  onOpenNovaIndicacaoParaIndicado: (indicadoId: string) => void;
}

export const IndicadosView: React.FC<IndicadosViewProps> = ({
  indicados,
  grade,
  onOpenNovoIndicado,
  onOpenEditarIndicado,
  onOpenFichaIndicado,
  onDeleteIndicado,
  onOpenNovaIndicacaoParaIndicado
}) => {
  const [busca, setBusca] = useState('');
  const [filtroBairro, setFiltroBairro] = useState('ALL');

  const bairros = Array.from(new Set(indicados.map(i => i.bairro_residencia))).sort();

  const indicadosFiltrados = indicados.filter(i => {
    if (filtroBairro !== 'ALL' && i.bairro_residencia !== filtroBairro) return false;
    if (busca.trim()) {
      const t = busca.toLowerCase();
      return (
        i.nome_completo.toLowerCase().includes(t) ||
        i.cpf.toLowerCase().includes(t) ||
        i.bairro_residencia.toLowerCase().includes(t) ||
        i.endereco_residencial.toLowerCase().includes(t) ||
        (i.lideranca_responsavel && i.lideranca_responsavel.toLowerCase().includes(t))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Busca */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-400" />
            Banco de Pessoas & Lideranças do Mandato ({indicados.length})
          </h2>
          <p className="text-xs text-slate-400">
            Cadastro detalhado com endereço residencial em Fortaleza e liderança de referência
          </p>
        </div>

        <button
          onClick={onOpenNovoIndicado}
          className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 flex-shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          <span>Cadastrar Nova Pessoa</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF, bairro onde mora ou liderança..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Bairro de Moradia:</span>
          <select
            value={filtroBairro}
            onChange={(e) => setFiltroBairro(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-brand-500 font-semibold"
          >
            <option value="ALL">Todos os Bairros ({bairros.length})</option>
            {bairros.map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Cards de Pessoas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicadosFiltrados.map((ind) => {
          const indicacao = grade.find(g => g.indicado_id === ind.id && g.status === 'Ativo');

          return (
            <div
              key={ind.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {ind.foto_url ? (
                      <img
                        src={ind.foto_url}
                        alt={ind.nome_completo}
                        className="h-11 w-11 rounded-2xl object-cover border border-slate-700 shadow-sm"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-2xl bg-brand-600/20 text-brand-300 font-black text-base flex items-center justify-center border border-brand-500/30">
                        {ind.nome_completo.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {ind.nome_completo}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        CPF: {ind.cpf}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditarIndicado(ind.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                      title="Editar Pessoa"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja excluir ${ind.nome_completo}?`)) {
                          onDeleteIndicado(ind.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Excluir Pessoa"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Onde Mora */}
                <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-brand-400" />
                      Mora em Fortaleza:
                    </span>
                    <span className="font-bold text-brand-300">{ind.bairro_residencia}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate">
                    {ind.endereco_residencial}
                  </p>
                </div>

                {/* Lotação Atual */}
                <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Briefcase className="h-3 w-3 text-amber-400" />
                      Lotação Atual:
                    </span>
                    {indicacao ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {indicacao.local.tipo_instituicao === 'Empresa Terceirizada' ? 'Terceirizada' : 'Órgão'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                        Disponível
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-200 font-semibold truncate">
                    {indicacao ? indicacao.cargo_ou_funcao : 'Aguardando vaga na grade'}
                  </p>
                  {indicacao && (
                    <p className="text-[10px] text-slate-400 truncate">
                      {indicacao.local.nome_empresa_ou_orgao}
                    </p>
                  )}
                </div>

                {/* Contatos */}
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Phone className="h-3 w-3 text-brand-400" />
                    {ind.telefone}
                  </span>
                  {ind.lideranca_responsavel && (
                    <span className="truncate text-[11px] text-amber-300">
                      Ref: {ind.lideranca_responsavel}
                    </span>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenFichaIndicado(ind.id)}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex-1 text-center"
                >
                  Ficha Completa
                </button>

                {!indicacao && (
                  <button
                    onClick={() => onOpenNovaIndicacaoParaIndicado(ind.id)}
                    className="py-1.5 px-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                  >
                    <Briefcase className="h-3 w-3" />
                    <span>Indicar</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
