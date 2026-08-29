import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PlusCircle, Edit2, Briefcase, MapPin } from 'lucide-react';
import { Indicado, LocalTrabalho, GradeIndicacao, StatusIndicacao } from '../../types';

interface NovaIndicacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicados: Indicado[];
  locais: LocalTrabalho[];
  indicacaoToEdit?: GradeIndicacao;
  initialIndicadoId?: string;
  onSaveIndicacao: (data: Omit<GradeIndicacao, 'id' | 'created_at'>, id?: string) => void;
  onOpenNovoIndicado: () => void;
  onOpenNovoLocal: () => void;
}

export const NovaIndicacaoModal: React.FC<NovaIndicacaoModalProps> = ({
  isOpen,
  onClose,
  indicados,
  locais,
  indicacaoToEdit,
  initialIndicadoId,
  onSaveIndicacao,
  onOpenNovoIndicado,
  onOpenNovoLocal
}) => {
  const [indicadoId, setIndicadoId] = useState(initialIndicadoId || indicados[0]?.id || '');
  const [localId, setLocalId] = useState(locais[0]?.id || '');
  const [cargoOuFuncao, setCargoOuFuncao] = useState('');
  const [remuneracao, setRemuneracao] = useState('2500');
  const [status, setStatus] = useState<StatusIndicacao>('Ativo');
  const [dataIndicacao, setDataIndicacao] = useState(new Date().toISOString().split('T')[0]);
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (indicacaoToEdit) {
      setIndicadoId(indicacaoToEdit.indicado_id);
      setLocalId(indicacaoToEdit.local_trabalho_id);
      setCargoOuFuncao(indicacaoToEdit.cargo_ou_funcao);
      setRemuneracao((indicacaoToEdit.remuneracao_estimada || 0).toString());
      setStatus(indicacaoToEdit.status);
      setDataIndicacao(indicacaoToEdit.data_indicacao);
      setObservacoes(indicacaoToEdit.observacoes || '');
    } else {
      setIndicadoId(initialIndicadoId || indicados[0]?.id || '');
      setLocalId(locais[0]?.id || '');
      setCargoOuFuncao('');
      setRemuneracao('2500');
      setStatus('Ativo');
      setDataIndicacao(new Date().toISOString().split('T')[0]);
      setObservacoes('');
    }
  }, [indicacaoToEdit, initialIndicadoId, indicados, locais, isOpen]);

  if (!isOpen) return null;

  const selectedIndicado = indicados.find(i => i.id === indicadoId);
  const selectedLocal = locais.find(l => l.id === localId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!indicadoId || !localId || !cargoOuFuncao) return;

    onSaveIndicacao({
      indicado_id: indicadoId,
      local_trabalho_id: localId,
      cargo_ou_funcao: cargoOuFuncao,
      remuneracao_estimada: parseFloat(remuneracao) || 0,
      status,
      data_indicacao: dataIndicacao,
      observacoes
    }, indicacaoToEdit?.id);

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {
      // safe fallback
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              {indicacaoToEdit ? <Edit2 className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {indicacaoToEdit ? 'Editar Indicação na Grade' : 'Lançar Nova Indicação'}
              </h3>
              <p className="text-xs text-slate-400">Vincular pessoa a uma empresa terceirizada ou órgão</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Seleção do Indicado */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                Pessoa Indicada *
              </label>
              <button
                type="button"
                onClick={onOpenNovoIndicado}
                className="text-brand-400 hover:text-brand-300 font-semibold text-[11px]"
              >
                + Cadastrar Nova Pessoa
              </button>
            </div>
            <select
              value={indicadoId}
              onChange={(e) => setIndicadoId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              required
            >
              {indicados.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nome_completo} (Mora no bairro: {i.bairro_residencia} • CPF: {i.cpf})
                </option>
              ))}
            </select>
            {selectedIndicado && (
              <p className="text-[11px] text-brand-300 mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Residência: {selectedIndicado.endereco_residencial} - {selectedIndicado.bairro_residencia}
              </p>
            )}
          </div>

          {/* Seleção do Local / Terceirizada */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                Local de Trabalho / Empresa Terceirizada *
              </label>
              <button
                type="button"
                onClick={onOpenNovoLocal}
                className="text-amber-400 hover:text-amber-300 font-semibold text-[11px]"
              >
                + Nova Terceirizada/Local
              </button>
            </div>
            <select
              value={localId}
              onChange={(e) => setLocalId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              required
            >
              {locais.map((l) => (
                <option key={l.id} value={l.id}>
                  [{l.tipo_instituicao === 'Empresa Terceirizada' ? 'TERCEIRIZADA' : l.esfera}] {l.nome_empresa_ou_orgao}
                </option>
              ))}
            </select>
            {selectedLocal && (
              <p className="text-[11px] text-slate-400 mt-1">
                Posto: {selectedLocal.endereco_trabalho}
              </p>
            )}
          </div>

          {/* Função / Cargo */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Cargo / Função Exercida *
            </label>
            <input
              type="text"
              placeholder="Ex: Assessor de Bairro, Auxiliar Administrativo, Portaria, Fiscal"
              value={cargoOuFuncao}
              onChange={(e) => setCargoOuFuncao(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-semibold"
              required
            />
          </div>

          {/* Remuneração & Data */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Remuneração Estimada (R$)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 2800.00"
                value={remuneracao}
                onChange={(e) => setRemuneracao(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-mono font-bold text-emerald-400"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Data da Indicação *
              </label>
              <input
                type="date"
                value={dataIndicacao}
                onChange={(e) => setDataIndicacao(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Status do Vínculo *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusIndicacao)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-semibold"
            >
              <option value="Ativo">Ativo (Trabalhando no Posto)</option>
              <option value="Em Análise / Aguardando Vaga">Em Análise / Aguardando Vaga</option>
              <option value="Desligado">Desligado</option>
            </select>
          </div>

          {/* Observações */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Observações / Articulação do Gabinete
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Indicação alinhada com líder comunitário; escala de 44h semanais..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-brand-600/30 transition-all active:scale-95 flex items-center gap-2"
            >
              <Briefcase className="h-4 w-4" />
              <span>{indicacaoToEdit ? 'Atualizar Indicação' : 'Confirmar Indicação'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
