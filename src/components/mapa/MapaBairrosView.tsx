import React, { useState } from 'react';
import {
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Indicado, IndicacaoEnriquecida } from '../../types';

interface MapaBairrosViewProps {
  indicados: Indicado[];
  grade: IndicacaoEnriquecida[];
  onOpenFichaIndicado: (indicadoId: string) => void;
  onOpenNovaIndicacaoParaIndicado: (indicadoId: string) => void;
}

export const MapaBairrosView: React.FC<MapaBairrosViewProps> = ({
  indicados,
  grade,
  onOpenFichaIndicado
}) => {
  // Agrupa indicados por bairro de residência
  const bairrosMap = new Map<string, Indicado[]>();
  indicados.forEach((ind) => {
    const b = ind.bairro_residencia.trim() || 'Outros Bairros';
    const list = bairrosMap.get(b) || [];
    list.push(ind);
    bairrosMap.set(b, list);
  });

  const bairrosSorted = Array.from(bairrosMap.entries()).sort((a, b) => b[1].length - a[1].length);

  const [bairroSelecionado, setBairroSelecionado] = useState<string>(
    bairrosSorted[0]?.[0] || 'Messejana'
  );

  const indicadosDoBairro = bairrosMap.get(bairroSelecionado) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <MapPin className="h-4 w-4 text-brand-400" />
          Mapeamento Territorial por Bairros de Fortaleza
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Visão espacial das lideranças e indicados por bairro de residência e cruzamento com seus locais de trabalho
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Lista de Bairros */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Bairros de Fortaleza ({bairrosSorted.length})
          </h3>
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {bairrosSorted.map(([bairro, lista]) => {
              const isSelected = bairroSelecionado === bairro;
              const ativasNoBairro = grade.filter(
                g => lista.some(l => l.id === g.indicado_id) && g.status === 'Ativo'
              );

              return (
                <button
                  key={bairro}
                  onClick={() => setBairroSelecionado(bairro)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-brand-600/20 border-brand-500 shadow-md'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? 'bg-brand-500 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {lista.length}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isSelected ? 'text-brand-300' : 'text-white'}`}>
                        {bairro}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {ativasNoBairro.length} com vínculo ativo
                      </p>
                    </div>
                  </div>

                  <ChevronRight className={`h-4 w-4 ${isSelected ? 'text-brand-400' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Coluna 2 e 3: Indicados no Bairro Selecionado */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-300 border border-brand-500/20 px-2 py-0.5 rounded-md">
                  Bairro Selecionado
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {indicadosDoBairro.length} pessoa(s) mapeada(s)
                </span>
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                {bairroSelecionado} • Fortaleza / CE
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {indicadosDoBairro.map((ind) => {
              const indicacao = grade.find(g => g.indicado_id === ind.id && g.status === 'Ativo');

              return (
                <div
                  key={ind.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        {ind.foto_url ? (
                          <img
                            src={ind.foto_url}
                            alt={ind.nome_completo}
                            className="h-9 w-9 rounded-full object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-brand-600/20 text-brand-300 font-bold flex items-center justify-center text-xs">
                            {ind.nome_completo.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-white leading-tight">
                            {ind.nome_completo}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {ind.telefone}
                          </p>
                        </div>
                      </div>

                      {indicacao && (
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            indicacao.local.tipo_instituicao === 'Empresa Terceirizada'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                          }`}
                        >
                          {indicacao.local.tipo_instituicao === 'Empresa Terceirizada' ? 'TERCEIRIZADA' : 'ÓRGÃO'}
                        </span>
                      )}
                    </div>

                    {/* Endereço Residencial no Bairro */}
                    <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                      <p className="font-medium">{ind.endereco_residencial}</p>
                    </div>

                    {/* Lotação */}
                    <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Lotação:</span>
                      {indicacao ? (
                        <div>
                          <p className="font-bold text-slate-200 text-xs">{indicacao.cargo_ou_funcao}</p>
                          <p className="text-[11px] text-brand-300">{indicacao.local.nome_empresa_ou_orgao}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{indicacao.local.endereco_trabalho}</p>
                        </div>
                      ) : (
                        <p className="text-purple-400 text-xs font-semibold">Aguardando vaga na grade</p>
                      )}
                    </div>
                  </div>

                  {/* Ação */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => onOpenFichaIndicado(ind.id)}
                      className="text-xs text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1"
                    >
                      <span>Ver Ficha Completa</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
