import { Indicado, LocalTrabalho, GradeIndicacao } from '../types';

// ==============================================================================
// 1. INDICADOS (BANCO DE PESSOAS / COLABORADORES DO MANDATO)
// ==============================================================================
export const INITIAL_INDICADOS: Indicado[] = [
  {
    id: 'ind-1',
    nome_completo: 'Francisco Eudoro Cavalcante de Souza',
    cpf: '128.450.913-04',
    rg: '200401029384-SSP/CE',
    telefone: '(85) 98844-1230',
    email: 'eudoro.cavalcante@gmail.com',
    endereco_residencial: 'Rua Coronel Dionísio Alencar, 450, Apto 201',
    bairro_residencia: 'Messejana',
    cep: '60840-280',
    cidade: 'Fortaleza',
    uf: 'CE',
    lideranca_responsavel: 'Liderança Comunitária Regional 6 (Messejana / Paupina)',
    foto_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    observacoes: 'Articulador forte no Grande Messejana; indicação para apoio de gestão na área da Educação.',
    created_at: '2025-01-05T08:00:00Z'
  },
  {
    id: 'ind-2',
    nome_completo: 'Maria Lúcia Bezerra Feitosa',
    cpf: '349.120.887-55',
    rg: '199803011299-SSP/CE',
    telefone: '(85) 99120-7766',
    email: 'lucia.feitosa@email.com',
    endereco_residencial: 'Av. Radialista José Lima Verde, 1280',
    bairro_residencia: 'Barra do Ceará',
    cep: '60331-200',
    cidade: 'Fortaleza',
    uf: 'CE',
    lideranca_responsavel: 'Coordenação Regional 1 (Barra do Ceará / Vila Velha)',
    foto_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    observacoes: 'Referência comunitária na Zona Oeste; excelente relacionamento com associações de moradores.',
    created_at: '2025-01-08T08:00:00Z'
  },
  {
    id: 'ind-3',
    nome_completo: 'Antônio Cícero de Alencar',
    cpf: '556.789.231-10',
    rg: '200109088741-SSP/CE',
    telefone: '(85) 99755-4422',
    email: 'cicero.alencar@hotmail.com',
    endereco_residencial: 'Rua Oscar Araripe, 890, Casa B',
    bairro_residencia: 'Bom Jardim',
    cep: '60543-425',
    cidade: 'Fortaleza',
    uf: 'CE',
    lideranca_responsavel: 'Liderança Comunitária Regional 5 (Grande Bom Jardim)',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    observacoes: 'Líder jovem no Grande Bom Jardim; lotado em empresa terceirizada de manutenção urbana.',
    created_at: '2025-01-10T08:00:00Z'
  },
  {
    id: 'ind-4',
    nome_completo: 'Renato Siqueira Holanda',
    cpf: '612.449.882-90',
    rg: '199504022310-SSP/CE',
    telefone: '(85) 98711-3300',
    email: 'renato.holanda@gmail.com',
    endereco_residencial: 'Rua Alberto Magno, 1420',
    bairro_residencia: 'Montese',
    cep: '60410-225',
    cidade: 'Fortaleza',
    uf: 'CE',
    lideranca_responsavel: 'Base Política Central / Montese e Parreão',
    foto_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    observacoes: 'Experiência prévia em atendimento ao público e recepção institucional.',
    created_at: '2025-01-12T08:00:00Z'
  },
  {
    id: 'ind-5',
    nome_completo: 'Camila Gondim Linhares',
    cpf: '883.109.432-12',
    rg: '200802099412-SSP/CE',
    telefone: '(85) 99655-8822',
    email: 'camila.gondim@outlook.com',
    endereco_residencial: 'Rua Castelo de Castro, 600',
    bairro_residencia: 'Jangurussu',
    cep: '60876-000',
    cidade: 'Fortaleza',
    uf: 'CE',
    lideranca_responsavel: 'Liderança do Conjunto Palmeiras / Jangurussu (Regional 9)',
    foto_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    observacoes: 'Indicação para serviços administrativos em terceirizada da Saúde municipal.',
    created_at: '2025-01-15T08:00:00Z'
  },
  {
    id: 'ind-6',
    nome_completo: 'Marcos Vinícius Parente',
    cpf: '098.456.123-77',
    rg: '199201088451-SSP/CE',
    telefone: '(85) 99120-1122',
    email: 'marcos.parente@gmail.com',
    endereco_residencial: 'Av. Dom Luís, 500, Bloco C',
    bairro_residencia: 'Aldeota',
    cep: '60160-230',
    cidade: 'Fortaleza',
    uf: 'CE',
    lideranca_responsavel: 'Coordenação de Campanha / Gabinete Central',
    foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    observacoes: 'Advogado e assessor para acompanhamento de contratos e finanças.',
    created_at: '2025-01-20T08:00:00Z'
  },
  {
    id: 'ind-7',
    nome_completo: 'Patrícia Gomes de Menezes',
    cpf: '401.993.218-66',
    rg: '201002011983-SSP/CE',
    telefone: '(85) 98822-4411',
    email: 'patricia.menezes@gmail.com',
    endereco_residencial: 'Rua Nereu Ramos, 310',
    bairro_residencia: 'Parangaba',
    cep: '60720-000',
    cidade: 'Fortaleza',
    uf: 'CE',
    lideranca_responsavel: 'Liderança Comunitária Parangaba / Lagoa',
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    observacoes: 'Aguardando encaixe em novo posto da empresa terceirizada de conservação.',
    created_at: '2025-02-01T08:00:00Z'
  }
];

// ==============================================================================
// 2. LOCAIS DE TRABALHO & EMPRESAS TERCEIRIZADAS
// ==============================================================================
export const INITIAL_LOCAIS_TRABALHO: LocalTrabalho[] = [
  // A. Órgãos Diretos da Prefeitura de Fortaleza
  {
    id: 'local-sme',
    tipo_instituicao: 'Prefeitura de Fortaleza',
    nome_empresa_ou_orgao: 'Secretaria Municipal da Educação (SME)',
    sigla_ou_apelido: 'SME',
    endereco_trabalho: 'Rua Desembargador Floriano Benevides Magalhães, 257',
    bairro_trabalho: 'Edson Queiroz',
    esfera: 'Municipal - Fortaleza',
    contrato_convenio: 'Lotação Direta - Gabinete PMF',
    responsavel_contato: 'Coordenação de Pessoal SME',
    telefone_contato: '(85) 3459-6700',
    cor_identificacao: '#10b981',
    created_at: '2025-01-01T08:00:00Z'
  },
  {
    id: 'local-sms',
    tipo_instituicao: 'Prefeitura de Fortaleza',
    nome_empresa_ou_orgao: 'Secretaria Municipal da Saúde (SMS)',
    sigla_ou_apelido: 'SMS',
    endereco_trabalho: 'Rua do Rosário, 283',
    bairro_trabalho: 'Centro',
    esfera: 'Municipal - Fortaleza',
    contrato_convenio: 'Lotação Direta - Postos de Saúde',
    responsavel_contato: 'RH / Atenção Primária',
    telefone_contato: '(85) 3452-6600',
    cor_identificacao: '#6366f1',
    created_at: '2025-01-01T08:00:00Z'
  },
  {
    id: 'local-ser1',
    tipo_instituicao: 'Prefeitura de Fortaleza',
    nome_empresa_ou_orgao: 'Secretaria Executiva Regional 1 (SER 1)',
    sigla_ou_apelido: 'SER 1',
    endereco_trabalho: 'Rua Dom Jerônimo, 20',
    bairro_trabalho: 'Otávio Bonfim / Farias Brito',
    esfera: 'Municipal - Fortaleza',
    contrato_convenio: 'Regionalização Oeste',
    responsavel_contato: 'Gabinete do Secretário Regional',
    telefone_contato: '(85) 3433-6800',
    cor_identificacao: '#f97316',
    created_at: '2025-01-01T08:00:00Z'
  },

  // B. Empresas Terceirizadas que prestam serviço para a Prefeitura/Estado
  {
    id: 'local-criart-sme',
    tipo_instituicao: 'Empresa Terceirizada',
    nome_empresa_ou_orgao: 'Criart Serviços Terceirizados (Contrato Escolas Municipais SME)',
    sigla_ou_apelido: 'CRIART TERCEIRIZADA',
    endereco_trabalho: 'Polos de Escolas Municipais - Regional 6 (Messejana)',
    bairro_trabalho: 'Messejana',
    esfera: 'Municipal - Fortaleza',
    contrato_convenio: 'Contrato PMF/SME nº 204/2024 (Apoio e Portaria Escolar)',
    responsavel_contato: 'Supervisão de Contrato Criart (Sr. Valmir)',
    telefone_contato: '(85) 3270-4000',
    cor_identificacao: '#0284c7',
    created_at: '2025-01-01T08:00:00Z'
  },
  {
    id: 'local-servis-sms',
    tipo_instituicao: 'Empresa Terceirizada',
    nome_empresa_ou_orgao: 'Servis Segurança & Apoio Operacional (Contrato UAPs/Postos SMS)',
    sigla_ou_apelido: 'SERVIS TERCEIRIZADA',
    endereco_trabalho: 'Postos de Saúde e UPAs de Fortaleza',
    bairro_trabalho: 'Montese / Benfica',
    esfera: 'Municipal - Fortaleza',
    contrato_convenio: 'Contrato PMF/SMS nº 088/2024 (Recepção e Vigilância)',
    responsavel_contato: 'Gerente Operacional Servis (Dra. Mônica)',
    telefone_contato: '(85) 3466-9000',
    cor_identificacao: '#ca8a04',
    created_at: '2025-01-01T08:00:00Z'
  },
  {
    id: 'local-ceara-limpeza',
    tipo_instituicao: 'Empresa Terceirizada',
    nome_empresa_ou_orgao: 'Ceará Conservação & Manutenção Urbana (Contrato SER 5)',
    sigla_ou_apelido: 'CEARÁ LIMPEZA',
    endereco_trabalho: 'Pátio Operacional de Zeladoria - Av. Osório de Paiva, 4500',
    bairro_trabalho: 'Bom Jardim / Siqueira',
    esfera: 'Municipal - Fortaleza',
    contrato_convenio: 'Contrato PMF/SCSP nº 115/2024 (Limpeza e Zeladoria Urbana)',
    responsavel_contato: 'Coordenador Operacional (Cláudio)',
    telefone_contato: '(85) 3497-2200',
    cor_identificacao: '#84cc16',
    created_at: '2025-01-01T08:00:00Z'
  },
  {
    id: 'local-marquise-ambiental',
    tipo_instituicao: 'Empresa Terceirizada',
    nome_empresa_ou_orgao: 'Marquise Ambiental (Contrato Coleta e Ecopontos de Fortaleza)',
    sigla_ou_apelido: 'MARQUISE AMBIENTAL',
    endereco_trabalho: 'Ecoponto Barra do Ceará / Leste-Oeste',
    bairro_trabalho: 'Barra do Ceará',
    esfera: 'Municipal - Fortaleza',
    contrato_convenio: 'Contrato Concessão nº 001/2023 - PMF',
    responsavel_contato: 'Fiscal de Pátio (Rogério)',
    telefone_contato: '(85) 4005-3000',
    cor_identificacao: '#d97706',
    created_at: '2025-01-01T08:00:00Z'
  },

  // C. Órgãos do Governo do Estado do Ceará
  {
    id: 'local-seduc-ce',
    tipo_instituicao: 'Governo do Estado do Ceará',
    nome_empresa_ou_orgao: 'Secretaria da Educação do Ceará (SEDUC-CE)',
    sigla_ou_apelido: 'SEDUC-CE',
    endereco_trabalho: 'Av. General Afonso Albuquerque Lima, s/n',
    bairro_trabalho: 'Cambeba',
    esfera: 'Estadual - Ceará',
    contrato_convenio: 'Lotação Estadual - Programa PAIC',
    responsavel_contato: 'Gabinete Executivo SEDUC',
    telefone_contato: '(85) 3101-3900',
    cor_identificacao: '#059669',
    created_at: '2025-01-01T08:00:00Z'
  }
];

// ==============================================================================
// 3. GRADE DE INDICAÇÕES (O VÍNCULO DO MANDATO)
// ==============================================================================
export const INITIAL_GRADE_INDICACOES: GradeIndicacao[] = [
  {
    id: 'grad-1',
    indicado_id: 'ind-1',
    local_trabalho_id: 'local-criart-sme',
    cargo_ou_funcao: 'Supervisor de Apoio e Portaria Escolar',
    remuneracao_estimada: 2850.00,
    status: 'Ativo',
    data_indicacao: '2025-01-10',
    observacoes: 'Alocado no polo de escolas da Messejana através da Criart.'
  },
  {
    id: 'grad-2',
    indicado_id: 'ind-2',
    local_trabalho_id: 'local-ser1',
    cargo_ou_funcao: 'Assessor Comunitário de Bairro (Barra do Ceará)',
    remuneracao_estimada: 3800.00,
    status: 'Ativo',
    data_indicacao: '2025-01-12',
    observacoes: 'Indicação direta na Regional 1 para articulação de demandas locais.'
  },
  {
    id: 'grad-3',
    indicado_id: 'ind-3',
    local_trabalho_id: 'local-ceara-limpeza',
    cargo_ou_funcao: 'Encarregado de Equipe de Zeladoria Urbana',
    remuneracao_estimada: 2400.00,
    status: 'Ativo',
    data_indicacao: '2025-01-15',
    observacoes: 'Vaga na terceirizada Ceará Limpeza atuando no Grande Bom Jardim.'
  },
  {
    id: 'grad-4',
    indicado_id: 'ind-4',
    local_trabalho_id: 'local-servis-sms',
    cargo_ou_funcao: 'Recepcionista e Orientador de Fluxo (Posto de Saúde)',
    remuneracao_estimada: 2100.00,
    status: 'Ativo',
    data_indicacao: '2025-01-18',
    observacoes: 'Lotado na terceirizada Servis atendendo no Posto de Saúde do Montese.'
  },
  {
    id: 'grad-5',
    indicado_id: 'ind-5',
    local_trabalho_id: 'local-criart-sme',
    cargo_ou_funcao: 'Auxiliar Administrativo de Polo',
    remuneracao_estimada: 2200.00,
    status: 'Ativo',
    data_indicacao: '2025-01-22',
    observacoes: 'Atuando no apoio administrativo das escolas municipais do Jangurussu.'
  },
  {
    id: 'grad-6',
    indicado_id: 'ind-6',
    local_trabalho_id: 'local-sme',
    cargo_ou_funcao: 'Assessor Técnico de Articulação Institucional',
    remuneracao_estimada: 5600.00,
    status: 'Ativo',
    data_indicacao: '2025-01-25',
    observacoes: 'Indicação direta no gabinete da SME em Fortaleza.'
  },
  {
    id: 'grad-7',
    indicado_id: 'ind-7',
    local_trabalho_id: 'local-marquise-ambiental',
    cargo_ou_funcao: 'Apoio Operacional de Ecoponto',
    remuneracao_estimada: 1950.00,
    status: 'Em Análise / Aguardando Vaga',
    data_indicacao: '2025-02-01',
    observacoes: 'Ficha enviada para o RH da terceirizada Marquise para vaga de Ecoponto.'
  }
];
