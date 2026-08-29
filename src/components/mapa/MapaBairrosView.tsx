import React, { useMemo, useState } from 'react';
import { BriefcaseBusiness, Home, MapPin } from 'lucide-react';
import { Indicado, IndicacaoEnriquecida } from '../../types';

type ModoMapa = 'residencia' | 'trabalho';

interface MapaBairrosViewProps {
  indicados: Indicado[];
  grade: IndicacaoEnriquecida[];
  onOpenFichaIndicado: (indicadoId: string) => void;
  onOpenNovaIndicacaoParaIndicado: (indicadoId: string) => void;
}

interface PontoCalor {
  nome: string;
  quantidade: number;
  pessoas: Indicado[];
  detalhe: string;
}

const normalizar = (valor?: string) => valor?.trim() || 'Não informado';

export const MapaBairrosView: React.FC<MapaBairrosViewProps> = ({ indicados, grade, onOpenFichaIndicado }) => {
  const [modo, setModo] = useState<ModoMapa>('residencia');
  const [pontoSelecionado, setPontoSelecionado] = useState('');

  const pontos = useMemo<PontoCalor[]>(() => {
    const grupos = new Map<string, Indicado[]>();
    indicados.forEach((indicado) => {
      const indicacaoAtiva = grade.find((item) => item.indicado_id === indicado.id && item.status === 'Ativo');
      const cidadeTrabalho = indicacaoAtiva?.local.cidade_trabalho ||
        (indicacaoAtiva?.local.esfera === 'Municipal - Fortaleza' ? 'Fortaleza' : undefined);
      const nome = modo === 'residencia'
        ? (indicado.cidade?.toLowerCase() === 'fortaleza' ? normalizar(indicado.bairro_residencia) : normalizar(indicado.cidade))
        : (cidadeTrabalho?.toLowerCase() === 'fortaleza'
          ? normalizar(indicacaoAtiva?.local.bairro_trabalho)
          : normalizar(cidadeTrabalho || indicacaoAtiva?.local.nome_empresa_ou_orgao));
      grupos.set(nome, [...(grupos.get(nome) || []), indicado]);
    });
    return Array.from(grupos.entries())
      .map(([nome, pessoas]) => ({
        nome,
        quantidade: pessoas.length,
        pessoas,
        detalhe: modo === 'residencia'
          ? (pessoas[0]?.cidade?.toLowerCase() === 'fortaleza' ? 'bairro de Fortaleza' : 'cidade do Ceará')
          : (pessoas[0] && grade.find((item) => item.indicado_id === pessoas[0].id)?.local.cidade_trabalho?.toLowerCase() === 'fortaleza'
            ? 'bairro de Fortaleza'
            : 'cidade do Ceará / local de trabalho')
      }))
      .sort((a, b) => b.quantidade - a.quantidade || a.nome.localeCompare(b.nome));
  }, [indicados, grade, modo]);

  const maiorQuantidade = pontos[0]?.quantidade || 1;
  const selecionado = pontos.find((ponto) => ponto.nome === pontoSelecionado);
  const trocarModo = (novoModo: ModoMapa) => { setModo(novoModo); setPontoSelecionado(''); };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-brand-400"><MapPin className="h-4 w-4" /><span className="text-[11px] font-bold uppercase tracking-wider">Mapa territorial</span></div>
          <h2 className="text-xl font-black text-white mt-1">Distribuição de pessoas indicadas</h2>
          <p className="text-xs text-slate-400 mt-1">Fortaleza aparece por bairro; outras cidades aparecem por município.</p>
        </div>
        <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1" role="group" aria-label="Modo do mapa">
          <button type="button" aria-pressed={modo === 'residencia'} onClick={() => trocarModo('residencia')} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${modo === 'residencia' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}><Home className="h-3.5 w-3.5" /> Onde moram</button>
          <button type="button" aria-pressed={modo === 'trabalho'} onClick={() => trocarModo('trabalho')} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors ${modo === 'trabalho' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}><BriefcaseBusiness className="h-3.5 w-3.5" /> Onde trabalham</button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="flex items-center justify-between mb-4"><div><h3 className="text-sm font-bold text-white">{modo === 'residencia' ? 'Concentração por residência' : 'Concentração por local de trabalho'}</h3><p className="text-[11px] text-slate-400 mt-0.5">Clique em uma área para ver as pessoas vinculadas.</p></div><span className="text-xs text-slate-400 tabular-nums">{pontos.length} áreas</span></div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {pontos.map((ponto) => {
            const intensidade = Math.max(14, Math.round((ponto.quantidade / maiorQuantidade) * 100));
            const ativo = ponto.nome === pontoSelecionado;
            return <button type="button" key={ponto.nome} aria-pressed={ativo} onClick={() => setPontoSelecionado(ativo ? '' : ponto.nome)} className={`relative overflow-hidden rounded-xl border p-3 text-left transition-colors ${ativo ? 'border-brand-400 bg-brand-500/15' : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'}`}><span className="absolute inset-y-0 left-0 bg-brand-500/20" style={{ width: `${intensidade}%` }} aria-hidden="true" /><span className="relative flex items-center justify-between gap-3"><span><span className="block text-xs font-bold text-white">{ponto.nome}</span><span className="block text-[10px] text-slate-400 mt-1">{ponto.detalhe}</span></span><span className="text-lg font-black text-brand-300 tabular-nums">{ponto.quantidade}</span></span></button>;
          })}
        </div>
      </div>

      {selecionado && <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4"><div className="flex items-center justify-between gap-3 mb-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-brand-300">Área selecionada</p><h3 className="text-lg font-black text-white">{selecionado.nome}</h3></div><span className="text-xs text-slate-400">{selecionado.quantidade} pessoa(s)</span></div><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{selecionado.pessoas.map((pessoa) => <button type="button" key={pessoa.id} onClick={() => onOpenFichaIndicado(pessoa.id)} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-left hover:border-brand-500/60"><span className="block text-xs font-bold text-white">{pessoa.nome_completo}</span><span className="block text-[10px] text-slate-400 mt-1">{pessoa.bairro_residencia} · {pessoa.cidade}</span></button>)}</div></div>}
    </div>
  );
};
