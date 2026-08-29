// ==============================================================================
// SISTEMA DE CONTROLE POLÍTICO E GRADE DE INDICAÇÕES DE GABINETE
// Tipos TypeScript para Supabase / PostgreSQL
// ==============================================================================

export type TipoInstituicao = 'Prefeitura de Fortaleza' | 'Governo do Estado do Ceará' | 'Empresa Terceirizada';
export type EsferaLocal = 'Municipal - Fortaleza' | 'Estadual - Ceará';
export type StatusIndicacao = 'Ativo' | 'Desligado' | 'Em Análise / Aguardando Vaga';

// ------------------------------------------------------------------------------
// 1. INDICADOS (As Pessoas / Colaboradores / Lideranças)
// ------------------------------------------------------------------------------
export interface Indicado {
  id: string;
  nome_completo: string;
  cpf: string;
  rg?: string;
  telefone: string;
  email?: string;
  // Onde a pessoa mora:
  endereco_residencial: string;
  bairro_residencia: string; // Ex: "Messejana", "Barra do Ceará", "Bom Jardim", "Montese"
  cep?: string;
  cidade: string; // Padrão "Fortaleza"
  uf: string; // Padrão "CE"
  lideranca_responsavel?: string; // Ex: "Zé do Bairro", "Liderança Comunitária Regional 6"
  foto_url?: string;
  observacoes?: string;
  created_at?: string;
}

// ------------------------------------------------------------------------------
// 2. LOCAIS DE TRABALHO & TERCEIRIZADAS (Onde a pessoa está prestando serviço)
// ------------------------------------------------------------------------------
export interface LocalTrabalho {
  id: string;
  tipo_instituicao: TipoInstituicao; // Prefeitura, Estado ou Empresa Terceirizada
  nome_empresa_ou_orgao: string; // Ex: "Secretaria de Educação - SME", "Criart Serviços Terceirizados", "Servis Segurança"
  sigla_ou_apelido?: string; // Ex: "SME", "CRIART", "SMS", "SER 1"
  endereco_trabalho: string; // Endereço físico do posto de trabalho
  cidade_trabalho?: string; // Cidade onde fica o posto; em Fortaleza, detalhar também o bairro
  bairro_trabalho?: string; // Bairro onde fica o posto
  esfera: EsferaLocal; // Municipal - Fortaleza ou Estadual - Ceará
  contrato_convenio?: string; // Ex: "Contrato nº 142/2024 - PMF"
  responsavel_contato?: string;
  telefone_contato?: string;
  cor_identificacao?: string;
  created_at?: string;
}

// ------------------------------------------------------------------------------
// 3. GRADE DE INDICAÇÕES (O Vínculo / A Grade Política)
// ------------------------------------------------------------------------------
export interface GradeIndicacao {
  id: string;
  indicado_id: string; // FK para Indicado
  local_trabalho_id: string; // FK para LocalTrabalho
  cargo_ou_funcao: string; // Ex: "Assessor de Bairro", "Apoio Administrativo", "Operacional Terceirizado", "Recepcionista"
  remuneracao_estimada?: number; // Salário / Benefício (R$)
  status: StatusIndicacao; // Ativo, Desligado, Em Análise
  data_indicacao: string;
  data_desligamento?: string | null;
  observacoes?: string;
  created_at?: string;
}

// ------------------------------------------------------------------------------
// 4. MODELO ENRIQUECIDO PARA A INTERFACE (UI)
// ------------------------------------------------------------------------------
export interface IndicacaoEnriquecida extends GradeIndicacao {
  indicado: Indicado;
  local: LocalTrabalho;
}

export interface DashboardGabineteMetrics {
  total_indicados_cadastrados: number;
  total_indicacoes_ativas: number;
  total_em_terceirizadas: number;
  total_em_orgaos_diretos: number;
  total_aguardando_vaga: number;
  impacto_politico_mensal: number;
  top_bairros_moradia: { bairro: string; count: number }[];
  distribuicao_por_tipo: { tipo: TipoInstituicao; count: number; valor: number }[];
  indicacoes_recentes: IndicacaoEnriquecida[];
}
