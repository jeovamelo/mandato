import React from 'react';
import {
  MapPin,
  Briefcase,
  Phone,
  Mail,
  MessageSquare,
  Printer
} from 'lucide-react';
import { Indicado, IndicacaoEnriquecida } from '../../types';

interface FichaIndicadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicado?: Indicado;
  indicacaoAtual?: IndicacaoEnriquecida;
  onEditIndicado: (indicadoId: string) => void;
}

export const FichaIndicadoModal: React.FC<FichaIndicadoModalProps> = ({
  isOpen,
  onClose,
  indicado,
  indicacaoAtual,
  onEditIndicado
}) => {
  if (!isOpen || !indicado) return null;

  const handleWhatsApp = () => {
    if (!indicado.telefone) return;
    const cleanNumber = indicado.telefone.replace(/\D/g, '');
    const url = `https://wa.me/55${cleanNumber}?text=Ol%C3%A1%2C%20${encodeURIComponent(indicado.nome_completo)}.%20Entramos%20em%20contato%20do%20Gabinete%20do%20Mandato.`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header com Foto e Identificação */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            {indicado.foto_url ? (
              <img
                src={indicado.foto_url}
                alt={indicado.nome_completo}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-brand-500/40 shadow-lg flex-shrink-0"
              />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-brand-600/20 text-brand-400 font-black text-2xl flex items-center justify-center flex-shrink-0 border border-brand-500/30">
                {indicado.nome_completo.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-300 border border-brand-500/20 px-2 py-0.5 rounded-md">
                  Ficha de Indicação Política
                </span>
                {indicacaoAtual && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      indicacaoAtual.status === 'Ativo'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {indicacaoAtual.status}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-black text-white mt-1">
                {indicado.nome_completo}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                CPF: {indicado.cpf} {indicado.rg && `• RG: ${indicado.rg}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* ===================================================================== */}
        {/* BLOCO 1: ONDE A PESSOA MORA (ENDEREÇO RESIDENCIAL EM FORTALEZA) */}
        {/* ===================================================================== */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-400" />
              Endereço Residencial (Onde a Pessoa Mora)
            </h4>
            <span className="text-xs font-extrabold text-brand-300 bg-slate-900 px-2.5 py-0.5 rounded-lg border border-slate-800">
              Bairro: {indicado.bairro_residencia}
            </span>
          </div>

          <p className="text-sm font-medium text-slate-100">
            {indicado.endereco_residencial}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono pt-1">
            <span>{indicado.cidade} - {indicado.uf}</span>
            {indicado.cep && <span>CEP: {indicado.cep}</span>}
          </div>

          {indicado.lideranca_responsavel && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 text-xs text-amber-300/90 flex items-center gap-1.5">
              <span className="font-semibold text-slate-400">Liderança de Referência:</span>
              <span>{indicado.lideranca_responsavel}</span>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* BLOCO 2: LOTAÇÃO ATUAL / EMPRESA TERCEIRIZADA OU ÓRGÃO */}
        {/* ===================================================================== */}
        {indicacaoAtual ? (
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-amber-400" />
                Lotação Atual do Mandato
              </h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  indicacaoAtual.local.tipo_instituicao === 'Empresa Terceirizada'
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                }`}
              >
                {indicacaoAtual.local.tipo_instituicao}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Empresa / Órgão:</span>
                <span className="font-bold text-slate-100 text-sm">
                  {indicacaoAtual.local.nome_empresa_ou_orgao}
                </span>
                {indicacaoAtual.local.sigla_ou_apelido && (
                  <span className="text-[11px] text-brand-400 block font-mono">
                    ({indicacaoAtual.local.sigla_ou_apelido})
                  </span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Cargo / Função Exposta:</span>
                <span className="font-bold text-slate-100 text-sm">
                  {indicacaoAtual.cargo_ou_funcao}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs">
              <span className="text-slate-400 block text-[10px]">Posto Físico de Trabalho:</span>
              <p className="text-slate-200 font-medium">{indicacaoAtual.local.endereco_trabalho}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Remuneração</span>
                <span className="font-mono font-bold text-emerald-400">
                  {indicacaoAtual.remuneracao_estimada?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Data Indicação</span>
                <span className="font-semibold text-slate-300">
                  {new Date(indicacaoAtual.data_indicacao).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Esfera</span>
                <span className="font-semibold text-slate-300">
                  {indicacaoAtual.local.esfera}
                </span>
              </div>
            </div>

            {indicacaoAtual.local.contrato_convenio && (
              <p className="text-[11px] text-slate-400 font-mono">
                Contrato: {indicacaoAtual.local.contrato_convenio}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-dashed border-slate-800 text-center space-y-1">
            <p className="text-xs font-semibold text-slate-300">Sem lotação ativa no momento</p>
            <p className="text-[11px] text-slate-500">Pessoa cadastrada no banco de indicações aguardando vaga.</p>
          </div>
        )}

        {/* ===================================================================== */}
        {/* BLOCO 3: CONTATOS & OBSERVAÇÕES */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Canais de Contato</span>
            <div className="space-y-1.5 text-slate-200">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-brand-400" />
                <span className="font-mono">{indicado.telefone}</span>
              </div>
              {indicado.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-brand-400" />
                  <span>{indicado.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Observações do Gabinete</span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {indicado.observacoes || 'Nenhuma observação adicional cadastrada.'}
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Conversar no WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir Ficha</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditIndicado(indicado.id)}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              Editar Cadastro
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
