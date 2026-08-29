import React from 'react';
import {
  LayoutDashboard,
  TableProperties,
  Users,
  Briefcase,
  MapPin,
  Database,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { DashboardGabineteMetrics } from '../../types';

export type ActiveTab =
  | 'dashboard'
  | 'grade'
  | 'indicados'
  | 'locais'
  | 'mapa'
  | 'sql';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  metrics: DashboardGabineteMetrics;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  metrics,
  onResetData
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard do Gabinete', icon: LayoutDashboard },
    { id: 'grade', label: 'Grade de Indicações', icon: TableProperties, badge: `${metrics.total_indicacoes_ativas} Ativos` },
    { id: 'indicados', label: 'Pessoas & Lideranças', icon: Users, badge: `${metrics.total_indicados_cadastrados}` },
    { id: 'locais', label: 'Locais & Terceirizadas', icon: Briefcase },
    { id: 'mapa', label: 'Mapeamento por Bairros', icon: MapPin, badge: 'Fortaleza' },
    { id: 'sql', label: 'SQL / Supabase DDL', icon: Database }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between flex-shrink-0 min-h-[calc(100vh-57px)]">
      {/* Navegação Principal */}
      <div className="p-4 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Gestão Estratégica
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md shadow-brand-600/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-brand-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Card de Resumo de Capital Político */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Cota do Mandato
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Indicados Ativos:</span>
              <span className="font-bold text-white">{metrics.total_indicacoes_ativas}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Em Terceirizadas:</span>
              <span className="font-bold text-amber-400">{metrics.total_em_terceirizadas}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Em Órgãos Diretos:</span>
              <span className="font-bold text-sky-400">{metrics.total_em_orgaos_diretos}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <span className="text-slate-400">Aguardando Vaga:</span>
              <span className="font-bold text-purple-400">{metrics.total_aguardando_vaga}</span>
            </div>
          </div>
        </div>

        {/* Card Informativo de Bairros */}
        {metrics.top_bairros_moradia.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-brand-400" />
                Principais Bairros
              </span>
            </div>
            <p className="text-slate-300 font-medium text-[11px] leading-relaxed">
              {metrics.top_bairros_moradia.slice(0, 3).map(b => `${b.bairro} (${b.count})`).join(' • ')}
            </p>
          </div>
        )}
      </div>

      {/* Rodapé da Sidebar */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Banco Supabase</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Pronto
          </span>
        </div>

        <button
          onClick={onResetData}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-950/50 hover:bg-slate-800 border border-slate-800 transition-colors"
          title="Restaurar dados demo de indicados de Fortaleza e terceirizadas"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Restaurar Dados Demo</span>
        </button>
      </div>
    </aside>
  );
};
