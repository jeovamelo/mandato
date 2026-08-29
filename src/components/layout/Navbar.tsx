import React from 'react';
import {
  Building2,
  PlusCircle,
  UserPlus,
  FileDown,
  Search,
  Briefcase
} from 'lucide-react';

interface NavbarProps {
  filtroTipo: string;
  onSelectFiltroTipo: (tipo: string) => void;
  onOpenNovaIndicacao: () => void;
  onOpenNovoIndicado: () => void;
  onOpenNovoLocal: () => void;
  onExportPDF: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  filtroTipo,
  onSelectFiltroTipo,
  onOpenNovaIndicacao,
  onOpenNovoIndicado,
  onOpenNovoLocal,
  onExportPDF,
  searchTerm,
  onSearchChange
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 lg:px-6 py-2.5">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        {/* Lado Esquerdo: Brand Logo & Segmentação por Tipo de Lotação */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 via-emerald-500 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/20">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center text-brand-400">
                <Building2 className="h-4.5 w-4.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-black text-white tracking-tight">
                  MandatoGov
                </h1>
                <span className="text-[9px] font-bold bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded border border-brand-500/30">
                  GABINETE PARLAMENTAR
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Controle de Indicações, Bairros & Terceirizadas</p>
            </div>
          </div>

          {/* ================================================================= */}
          {/* SELETOR RÁPIDO DE TIPO DE VÍNCULO (TERCEIRIZADAS vs PREFEITURA vs ESTADO) */}
          {/* ================================================================= */}
          <div className="flex items-center p-0.5 bg-slate-950 rounded-xl border border-slate-800 text-xs shadow-inner">
            <button
              onClick={() => onSelectFiltroTipo('ALL')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-all ${
                filtroTipo === 'ALL'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-700/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Todas as Lotações</span>
            </button>

            <button
              onClick={() => onSelectFiltroTipo('Empresa Terceirizada')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                filtroTipo === 'Empresa Terceirizada'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-700/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-300"></span>
              <span>Terceirizadas</span>
              <span className="text-[10px] opacity-80 font-mono font-normal">(Prestadoras)</span>
            </button>

            <button
              onClick={() => onSelectFiltroTipo('Prefeitura de Fortaleza')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                filtroTipo === 'Prefeitura de Fortaleza'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-700/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-sky-300"></span>
              <span>Prefeitura (PMF)</span>
            </button>

            <button
              onClick={() => onSelectFiltroTipo('Governo do Estado do Ceará')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                filtroTipo === 'Governo do Estado do Ceará'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
              <span>Estado (CE)</span>
            </button>
          </div>
        </div>

        {/* Lado Direito: Busca Global & Ações Rápidas de Gabinete */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Campo de Busca Inteligente */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, bairro, CPF, terceirizada..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>

          {/* Botões de Ação Rápida */}
          <button
            onClick={onOpenNovaIndicacao}
            className="flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-md transition-all active:scale-95"
            title="Lançar Nova Indicação na Grade"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Nova Indicação</span>
          </button>

          <button
            onClick={onOpenNovoIndicado}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
            title="Cadastrar Nova Pessoa / Liderança com Endereço"
          >
            <UserPlus className="h-3.5 w-3.5 text-brand-400" />
            <span className="hidden sm:inline">Cadastrar Pessoa</span>
          </button>

          <button
            onClick={onOpenNovoLocal}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all"
            title="Cadastrar Empresa Terceirizada ou Órgão"
          >
            <Briefcase className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden md:inline">Terceirizada/Local</span>
          </button>

          <button
            onClick={onExportPDF}
            className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 transition-all"
            title="Exportar Relatório Geral de Indicações em PDF"
          >
            <FileDown className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden md:inline">PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
