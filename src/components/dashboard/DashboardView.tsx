import React from 'react';
import {
  Users,
  Briefcase,
  Building,
  MapPin,
  Clock,
  UserPlus,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { DashboardGabineteMetrics } from '../../types';

interface DashboardViewProps {
  metrics: DashboardGabineteMetrics;
  onOpenNovaIndicacao: () => void;
  onNavigateToGrade: () => void;
  onNavigateToMapa: () => void;
  onNavigateToTerceirizadas: () => void;
  onOpenFichaIndicado: (indicadoId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  onOpenNovaIndicacao,
  onNavigateToGrade,
  onNavigateToMapa,
  onNavigateToTerceirizadas,
  onOpenFichaIndicado
}) => {
  return (
    <div className="space-y-6">
      {/* Banner Principal do Gabinete */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-brand-500/20 text-brand-300 border border-brand-500/30">
                <ShieldCheck className="h-3 w-3" />
                CONTROLE POLÍTICO-PARTIDÁRIO
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">Gabinete Parlamentar • Fortaleza / CE</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Painel de Indicações & Capital Político
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Mapeamento estratégico da cota de indicações do mandato: saiba exatamente onde cada pessoa mora em Fortaleza, onde está trabalhando (órgãos públicos ou <strong>empresas terceirizadas</strong>) e sua liderança de referência.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNovaIndicacao}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-brand-600/30 transition-all active:scale-95"
            >
              <UserPlus className="h-4 w-4" />
              <span>Nova Indicação</span>
            </button>

            <button
              onClick={onNavigateToGrade}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
            >
              <span>Ver Grade Completa</span>
              <ArrowUpRight className="h-4 w-4 text-brand-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de 4 KPIs Estratégicos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Indicados Ativos */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Indicados Ativos na Grade</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {metrics.total_indicacoes_ativas}
            </span>
            <span className="text-xs text-slate-400">
              de {metrics.total_indicados_cadastrados} cadastrados
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{
                width: `${metrics.total_indicados_cadastrados > 0 ? (metrics.total_indicacoes_ativas / metrics.total_indicados_cadastrados) * 100 : 0}%`
              }}
            ></div>
          </div>
        </div>

        {/* KPI 2: Lotação em Empresas Terceirizadas */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Em Empresas Terceirizadas</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {metrics.total_em_terceirizadas}
            </span>
            <span className="text-xs text-amber-400 font-semibold">
              postos indiretos
            </span>
          </div>
          <button
            onClick={onNavigateToTerceirizadas}
            className="mt-3 text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>Ver empresas prestadoras</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* KPI 3: Lotação em Órgãos Diretos */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Em Órgãos Diretos (PMF/CE)</span>
            <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Building className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {metrics.total_em_orgaos_diretos}
            </span>
            <span className="text-xs text-slate-400">
              secretarias e regionais
            </span>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            SME, SMS, SER 1 a 12 e Governo
          </p>
        </div>

        {/* KPI 4: Em Análise / Aguardando Vaga */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Banco / Aguardando Encaixe</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">
              {metrics.total_aguardando_vaga}
            </span>
            <span className="text-xs text-purple-300 font-semibold">
              fichas em triagem
            </span>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            Lideranças e apoios prontos para indicação
          </p>
        </div>
      </div>

      {/* Seção 2 Colunas: Onde os Indicados Moram (Bairros) e Últimas Indicações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Distribuição Espacial por Bairro de Moradia */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mapeamento por Bairros de Residência */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-400" />
                  Mapeamento Eleitoral: Onde Moram os Indicados em Fortaleza
                </h3>
                <p className="text-xs text-slate-400">
                  Distribuição de apoiadores e lideranças por bairros e regionais da capital
                </p>
              </div>
              <button
                onClick={onNavigateToMapa}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
              >
                Ver no Mapa
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {metrics.top_bairros_moradia.map((b) => {
                const perc = metrics.total_indicados_cadastrados > 0
                  ? (b.count / metrics.total_indicados_cadastrados) * 100
                  : 0;

                return (
                  <div
                    key={b.bairro}
                    className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand-400"></span>
                        <span className="font-bold text-slate-200">{b.bairro}</span>
                      </div>
                      <span className="text-slate-400 font-medium">
                        <strong className="text-slate-200">{b.count}</strong> indicado(s) ({perc.toFixed(0)}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-indigo-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, perc)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cards de Tipos de Lotação */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-amber-400" />
              Distribuição por Tipo de Lotação
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {metrics.distribuicao_por_tipo.map((d) => (
                <div key={d.tipo} className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block">{d.tipo}</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-xl font-bold text-white">{d.count} indicados</span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {d.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Últimos Vínculos Cadastrados & Acesso Rápido */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-400" />
                Últimas Indicações da Grade
              </h3>
              <button
                onClick={onNavigateToGrade}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
              >
                Ver todas
              </button>
            </div>

            <div className="space-y-3">
              {metrics.indicacoes_recentes.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenFichaIndicado(item.indicado.id)}
                  className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 hover:border-brand-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-brand-300 transition-colors truncate">
                        {item.indicado.nome_completo}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        Mora em: <strong className="text-slate-300">{item.indicado.bairro_residencia}</strong>
                      </p>
                    </div>

                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0 border ${
                        item.local.tipo_instituicao === 'Empresa Terceirizada'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                      }`}
                    >
                      {item.local.tipo_instituicao === 'Empresa Terceirizada' ? 'Terceirizada' : 'Direto'}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate">{item.cargo_ou_funcao}</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {item.remuneracao_estimada?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
