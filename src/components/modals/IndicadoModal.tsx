import React, { useState, useEffect } from 'react';
import { User, UserPlus } from 'lucide-react';
import { Indicado } from '../../types';

interface IndicadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicadoToEdit?: Indicado;
  onSaveIndicado: (data: Omit<Indicado, 'id' | 'created_at'>, id?: string) => void;
}

const BAIRROS_FORTALEZA = [
  'Aldeota', 'Antônio Bezerra', 'Barra do Ceará', 'Benfica', 'Bela Vista',
  'Bom Jardim', 'Centro', 'Cidade dos Funcionários', 'Conjunto Ceará', 'Conjunto Palmeiras',
  'Cristo Redentor', 'Dionísio Torres', 'Edson Queiroz', 'Farias Brito', 'Granja Portugal',
  'Guararapes', 'Itaperi', 'Jangurussu', 'Joaquim Távora', 'José Walter',
  'Messejana', 'Meireles', 'Montese', 'Mondubim', 'Mucuripe',
  'Papicu', 'Parangaba', 'Parque Dois Irmãos', 'Parreão', 'Passaré',
  'Paupina', 'Pirambu', 'Praia de Iracema', 'Quintino Cunha', 'Sapiranga',
  'Serrinha', 'Siqueira', 'Varjota', 'Vila Velha'
];

export const IndicadoModal: React.FC<IndicadoModalProps> = ({
  isOpen,
  onClose,
  indicadoToEdit,
  onSaveIndicado
}) => {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [enderecoResidencial, setEnderecoResidencial] = useState('');
  const [bairroResidencia, setBairroResidencia] = useState('Messejana');
  const [cep, setCep] = useState('');
  const [liderancaResponsavel, setLiderancaResponsavel] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (indicadoToEdit) {
      setNomeCompleto(indicadoToEdit.nome_completo);
      setCpf(indicadoToEdit.cpf);
      setRg(indicadoToEdit.rg || '');
      setTelefone(indicadoToEdit.telefone);
      setEmail(indicadoToEdit.email || '');
      setEnderecoResidencial(indicadoToEdit.endereco_residencial);
      setBairroResidencia(indicadoToEdit.bairro_residencia || 'Messejana');
      setCep(indicadoToEdit.cep || '');
      setLiderancaResponsavel(indicadoToEdit.lideranca_responsavel || '');
      setObservacoes(indicadoToEdit.observacoes || '');
    } else {
      setNomeCompleto('');
      setCpf('');
      setRg('');
      setTelefone('');
      setEmail('');
      setEnderecoResidencial('');
      setBairroResidencia('Messejana');
      setCep('');
      setLiderancaResponsavel('');
      setObservacoes('');
    }
  }, [indicadoToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCompleto || !cpf || !telefone || !enderecoResidencial || !bairroResidencia) return;

    onSaveIndicado({
      nome_completo: nomeCompleto,
      cpf,
      rg,
      telefone,
      email,
      endereco_residencial: enderecoResidencial,
      bairro_residencia: bairroResidencia,
      cep,
      cidade: 'Fortaleza',
      uf: 'CE',
      lideranca_responsavel: liderancaResponsavel,
      observacoes
    }, indicadoToEdit?.id);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {indicadoToEdit ? 'Editar Cadastro da Pessoa' : 'Cadastrar Nova Pessoa / Liderança'}
              </h3>
              <p className="text-xs text-slate-400">Dados pessoais e endereço de moradia em Fortaleza</p>
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
          {/* Nome Completo */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              placeholder="Ex: Francisco José da Silva"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-bold"
              required
            />
          </div>

          {/* CPF e RG */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                CPF *
              </label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                RG
              </label>
              <input
                type="text"
                placeholder="200401029384-SSP/CE"
                value={rg}
                onChange={(e) => setRg(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
          </div>

          {/* Telefone e E-mail */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Telefone / WhatsApp *
              </label>
              <input
                type="text"
                placeholder="(85) 98888-0000"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                E-mail
              </label>
              <input
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Onde Mora: Bairro em Fortaleza */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Bairro de Residência (Fortaleza) *
            </label>
            <div className="relative">
              <input
                list="bairros-list"
                type="text"
                placeholder="Selecione ou digite o bairro (Ex: Messejana, Barra do Ceará, Bom Jardim)"
                value={bairroResidencia}
                onChange={(e) => setBairroResidencia(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-semibold text-brand-300"
                required
              />
              <datalist id="bairros-list">
                {BAIRROS_FORTALEZA.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Endereço Residencial Completo */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Endereço Residencial Completo *
            </label>
            <input
              type="text"
              placeholder="Rua / Avenida, Número, Complemento"
              value={enderecoResidencial}
              onChange={(e) => setEnderecoResidencial(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          {/* CEP & Liderança */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                CEP
              </label>
              <input
                type="text"
                placeholder="60000-000"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Liderança de Referência
              </label>
              <input
                type="text"
                placeholder="Ex: Líder Zé da Regional 6"
                value={liderancaResponsavel}
                onChange={(e) => setLiderancaResponsavel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              Observações do Gabinete
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Histórico político, perfil comunitário, habilidades..."
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
              className="py-2 px-5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span>{indicadoToEdit ? 'Atualizar Cadastro' : 'Salvar Pessoa'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
