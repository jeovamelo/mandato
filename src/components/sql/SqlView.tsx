import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Briefcase
} from 'lucide-react';

export const SqlView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sqlScript = `-- ==============================================================================
-- SISTEMA DE GESTÃO DE INDICAÇÕES E CONTROLE POLÍTICO DE GABINETE (MANDATOGOV)
-- Schema DDL para Supabase / PostgreSQL (3 Tabelas Principais + RLS + View)
-- Controle de Indicados, Bairros de Residência, Locais de Trabalho e Terceirizadas
-- ==============================================================================

-- Habilita extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABELA: indicados (As Pessoas / Colaboradores / Lideranças Indicadas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS indicados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    rg VARCHAR(50),
    telefone VARCHAR(30) NOT NULL,
    email VARCHAR(255),
    endereco_residencial TEXT NOT NULL, -- Rua, número, complemento
    bairro_residencia VARCHAR(100) NOT NULL, -- Ex: Messejana, Barra do Ceará, Bom Jardim, Montese
    cep VARCHAR(10),
    cidade VARCHAR(100) DEFAULT 'Fortaleza',
    uf VARCHAR(2) DEFAULT 'CE',
    lideranca_responsavel VARCHAR(255), -- Ex: Líder comunitário que indicou
    foto_url TEXT,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. TABELA: locais_trabalho (Onde a pessoa está prestando serviço)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS locais_trabalho (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo_instituicao VARCHAR(50) NOT NULL CHECK (tipo_instituicao IN ('Prefeitura de Fortaleza', 'Governo do Estado do Ceará', 'Empresa Terceirizada')),
    nome_empresa_ou_orgao VARCHAR(255) NOT NULL, -- Ex: "Secretaria da Educação - SME", "Criart Serviços Terceirizados", "Servis Segurança"
    sigla_ou_apelido VARCHAR(50), -- Ex: "SME", "CRIART", "SMS", "SER 1"
    endereco_trabalho TEXT NOT NULL, -- Endereço físico do posto de trabalho
    bairro_trabalho VARCHAR(100),
    esfera VARCHAR(50) DEFAULT 'Municipal - Fortaleza' CHECK (esfera IN ('Municipal - Fortaleza', 'Estadual - Ceará')),
    contrato_convenio VARCHAR(255), -- Ex: "Contrato PMF/SME nº 204/2024"
    responsavel_contato VARCHAR(255),
    telefone_contato VARCHAR(30),
    cor_identificacao VARCHAR(20) DEFAULT '#0284c7',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. TABELA: grade_indicacoes (O Vínculo / A Grade de Indicações do Mandato)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS grade_indicacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    indicado_id UUID NOT NULL REFERENCES indicados(id) ON DELETE CASCADE,
    local_trabalho_id UUID NOT NULL REFERENCES locais_trabalho(id) ON DELETE CASCADE,
    cargo_ou_funcao VARCHAR(255) NOT NULL, -- Ex: "Assessor de Bairro", "Apoio Administrativo", "Operacional Terceirizado", "Recepcionista"
    remuneracao_estimada DECIMAL(10, 2) DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Desligado', 'Em Análise / Aguardando Vaga')),
    data_indicacao DATE NOT NULL DEFAULT CURRENT_DATE,
    data_desligamento DATE,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. ÍNDICES PARA CONSULTAS RÁPIDAS
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_indicados_bairro ON indicados(bairro_residencia);
CREATE INDEX IF NOT EXISTS idx_indicados_cpf ON indicados(cpf);
CREATE INDEX IF NOT EXISTS idx_locais_tipo ON locais_trabalho(tipo_instituicao);
CREATE INDEX IF NOT EXISTS idx_grade_indicado ON grade_indicacoes(indicado_id);
CREATE INDEX IF NOT EXISTS idx_grade_local ON grade_indicacoes(local_trabalho_id);
CREATE INDEX IF NOT EXISTS idx_grade_status ON grade_indicacoes(status);

-- ------------------------------------------------------------------------------
-- 5. VIEW: v_grade_completa (Resumo com Indicado, Bairro e Local)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_grade_completa AS
SELECT 
    g.id AS indicacao_id,
    g.cargo_ou_funcao,
    g.remuneracao_estimada,
    g.status,
    g.data_indicacao,
    g.observacoes AS obs_indicacao,
    -- Dados do Indicado
    i.id AS indicado_id,
    i.nome_completo AS indicado_nome,
    i.cpf AS indicado_cpf,
    i.rg AS indicado_rg,
    i.telefone AS indicado_telefone,
    i.endereco_residencial AS indicado_endereco,
    i.bairro_residencia AS indicado_bairro,
    i.lideranca_responsavel,
    -- Dados do Local / Terceirizada
    l.id AS local_id,
    l.tipo_instituicao,
    l.nome_empresa_ou_orgao,
    l.sigla_ou_apelido,
    l.endereco_trabalho,
    l.bairro_trabalho,
    l.esfera,
    l.contrato_convenio
FROM grade_indicacoes g
JOIN indicados i ON g.indicado_id = i.id
JOIN locais_trabalho l ON g.local_trabalho_id = l.id;

-- ------------------------------------------------------------------------------
-- 6. POLÍTICAS DE SEGURANÇA (Row Level Security - RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE indicados ENABLE ROW LEVEL SECURITY;
ALTER TABLE locais_trabalho ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_indicacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso indicados autenticado" ON indicados FOR ALL TO authenticated USING (true);
CREATE POLICY "Acesso locais_trabalho autenticado" ON locais_trabalho FOR ALL TO authenticated USING (true);
CREATE POLICY "Acesso grade_indicacoes autenticado" ON grade_indicacoes FOR ALL TO authenticated USING (true);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner Superior */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 uppercase tracking-wider mb-1">
            <Database className="h-4 w-4" />
            Arquitetura de Dados PostgreSQL / Supabase
          </div>
          <h2 className="text-xl font-bold text-white">
            Script DDL Simplificado: Grade de Indicações de Gabinete
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Modelo enxuto em 3 tabelas fundamentais (<code className="text-brand-300 font-mono">indicados</code>, <code className="text-brand-300 font-mono">locais_trabalho</code> e <code className="text-brand-300 font-mono">grade_indicacoes</code>), incluindo mapeamento de moradia em Fortaleza, empresas terceirizadas e segurança RLS.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex-shrink-0"
        >
          {copied ? <Check className="h-4 w-4 text-white" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? 'SQL Copiado com Sucesso!' : 'Copiar Script SQL'}</span>
        </button>
      </div>

      {/* Cards Explicativos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-brand-400 font-bold">
            <MapPin className="h-4 w-4" />
            <span>Mapeamento de Moradia</span>
          </div>
          <p className="text-slate-400">
            Armazena o endereço residencial e o bairro de cada pessoa em Fortaleza para controle territorial e eleitoral.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Briefcase className="h-4 w-4" />
            <span>Controle de Terceirizadas</span>
          </div>
          <p className="text-slate-400">
            Acompanhe com precisão os indicados alocados em contratos terceirizados da Prefeitura de Fortaleza e do Estado.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>Row Level Security (RLS)</span>
          </div>
          <p className="text-slate-400">
            Políticas de segurança ativas no PostgreSQL/Supabase para proteção de dados e privacidade das indicações.
          </p>
        </div>
      </div>

      {/* Visualizador de Código SQL */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
          <span className="font-mono text-slate-300">schema.sql (3 Tabelas: indicados, locais_trabalho, grade_indicacoes)</span>
          <button
            onClick={handleCopy}
            className="hover:text-white flex items-center gap-1 font-semibold"
          >
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        <pre className="p-5 text-xs font-mono text-emerald-400/90 overflow-x-auto leading-relaxed max-h-[500px]">
          {sqlScript}
        </pre>
      </div>
    </div>
  );
};
