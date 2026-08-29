import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { LocalTrabalho, TipoInstituicao, EsferaLocal } from '../../types';

interface LocalTrabalhoModalProps {
  isOpen: boolean;
  onClose: () => void;
  localToEdit?: LocalTrabalho;
  onSaveLocal: (data: Omit<LocalTrabalho, 'id' | 'created_at'>, id?: string) => void;
}

export const LocalTrabalhoModal: React.FC<LocalTrabalhoModalProps> = ({
  isOpen,
  onClose,
  localToEdit,
  onSaveLocal
}) => {
  const [tipoInstituicao, setTipoInstituicao] = useState<TipoInstituicao>('Empresa Terceirizada');
  const [nomeEmpresaOuOrgao, setNomeEmpresaOuOrgao] = useState('');
  const [siglaOuApelido, setSiglaOuApelido] = useState('');
  const [enderecoTrabalho, setEnderecoTrabalho] = useState('');
  const [bairroTrabalho, setBairroTrabalho] = useState('');
  const [esfera, setEsfera] = useState<EsferaLocal>('Municipal - Fortaleza');
  const [contratoConvenio, setContratoConvenio] = useState('');
  const [responsavelContato, setResponsavelContato] = useState('');
  const [telefoneContato, setTelefoneContato] = useState('');

  useEffect(() => {
    if (localToEdit) {
      setTipoInstituicao(localToEdit.tipo_instituicao);
      setNomeEmpresaOuOrgao(localToEdit.nome_empresa_ou_orgao);
      setSiglaOuApelido(localToEdit.sigla_ou_apelido || '');
      setEnderecoTrabalho(localToEdit.endereco_trabalho);
      setBairroTrabalho(localToEdit.bairro_trabalho || '');
      setEsfera(localToEdit.esfera);
      setContratoConvenio(localToEdit.contrato_convenio || '');
      setResponsavelContato(localToEdit.responsavel_contato || '');
      setTelefoneContato(localToEdit.telefone_contato || '');
    } else {
      setTipoInstituicao('Empresa Terceirizada');
      setNomeEmpresaOuOrgao('');
      setSiglaOuApelido('');
      setEnderecoTrabalho('');
      setBairroTrabalho('');
      setEsfera('Municipal - Fortaleza');
      setContratoConvenio('');
      setResponsavelContato('');
      setTelefoneContato('');
    }
  }, [localToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeEmpresaOuOrgao || !enderecoTrabalho) return;

    onSaveLocal({
      tipo_instituicao: tipoInstituicao,
      nome_empresa_ou_orgao: nomeEmpresaOuOrgao,
      sigla_ou_apelido: siglaOuApelido,
      endereco_trabalho: enderecoTrabalho,
      bairro_trabalho: bairroTrabalho,
      esfera,
      contrato_convenio: contratoConvenio,
      responsavel_contato: responsavelContato,
      telefone_contato: telefoneContato,
      cor_identificacao: tipoInstituicao === 'Empresa Terceirizada' ? '#f59e0b' : '#0284c7'
    }, localToEdit?.id);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {localToEdit ? 'Editar Local / Terceirizada' : 'Cadastrar Local ou Empresa Terceirizada'}
              </h3>
              <p className="text-xs text-slate-400">Posto de trabalho onde os indicados prestam serviço</p>
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
          {/* Tipo de Instituição */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Tipo de Lotação *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTipoInstituicao('Empresa Terceirizada')}
                className={`py-2 px-2.5 rounded-xl border text-center font-bold text-[11px] transition-all ${
                  tipoInstituicao === 'Empresa Terceirizada'
                    ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Empresa Terceirizada
              </button>

              <button
                type="button"
                onClick={() => setTipoInstituicao('Prefeitura de Fortaleza')}
                className={`py-2 px-2.5 rounded-xl border text-center font-bold text-[11px] transition-all ${
                  tipoInstituicao === 'Prefeitura de Fortaleza'
                    ? 'bg-sky-600/20 border-sky-500 text-sky-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Prefeitura (PMF)
              </button>

              <button
                type="button"
                onClick={() => setTipoInstituicao('Governo do Estado do Ceará')}
                className={`py-2 px-2.5 rounded-xl border text-center font-bold text-[11px] transition-all ${
                  tipoInstituicao === 'Governo do Estado do Ceará'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Governo do Estado
              </button>
            </div>
          </div>

          {/* Nome da Empresa ou Órgão */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Nome da Empresa Terceirizada ou Órgão *
            </label>
            <input
              type="text"
              placeholder="Ex: Criart Serviços Terceirizados / SME / Servis Segurança"
              value={nomeEmpresaOuOrgao}
              onChange={(e) => setNomeEmpresaOuOrgao(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-bold"
              required
            />
          </div>

          {/* Sigla e Esfera */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Sigla ou Apelido
              </label>
              <input
                type="text"
                placeholder="Ex: CRIART, SERVIS, SME"
                value={siglaOuApelido}
                onChange={(e) => setSiglaOuApelido(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Esfera Vinculada
              </label>
              <select
                value={esfera}
                onChange={(e) => setEsfera(e.target.value as EsferaLocal)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="Municipal - Fortaleza">Municipal - Fortaleza</option>
                <option value="Estadual - Ceará">Estadual - Ceará</option>
              </select>
            </div>
          </div>

          {/* Endereço do Posto de Trabalho */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Endereço Físico do Posto de Trabalho *
            </label>
            <input
              type="text"
              placeholder="Ex: Escolas Municipais da Messejana / Posto de Saúde Montese"
              value={enderecoTrabalho}
              onChange={(e) => setEnderecoTrabalho(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          {/* Bairro do Trabalho & Contrato */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Bairro do Posto de Trabalho
              </label>
              <input
                type="text"
                placeholder="Ex: Messejana, Centro, Barra"
                value={bairroTrabalho}
                onChange={(e) => setBairroTrabalho(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Contrato / Convênio com PMF/CE
              </label>
              <input
                type="text"
                placeholder="Ex: Contrato nº 204/2024"
                value={contratoConvenio}
                onChange={(e) => setContratoConvenio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          {/* Contato do Supervisor/RH da Empresa */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Nome do Supervisor / RH
              </label>
              <input
                type="text"
                placeholder="Ex: Valmir (Criart)"
                value={responsavelContato}
                onChange={(e) => setResponsavelContato(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Telefone de Contato
              </label>
              <input
                type="text"
                placeholder="(85) 3200-0000"
                value={telefoneContato}
                onChange={(e) => setTelefoneContato(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
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
              className="py-2 px-5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Briefcase className="h-4 w-4" />
              <span>{localToEdit ? 'Atualizar Local' : 'Salvar Local'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
