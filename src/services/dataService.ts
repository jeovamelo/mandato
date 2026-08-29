import {
  Indicado,
  LocalTrabalho,
  GradeIndicacao,
  IndicacaoEnriquecida,
  DashboardGabineteMetrics,
  TipoInstituicao
} from '../types';
import {
  INITIAL_INDICADOS,
  INITIAL_LOCAIS_TRABALHO,
  INITIAL_GRADE_INDICACOES
} from '../data/mockData';

const STORAGE_KEYS = {
  INDICADOS: 'mandatogov_indicados',
  LOCAIS: 'mandatogov_locais_trabalho',
  GRADE: 'mandatogov_grade_indicacoes',
  FILTRO_TIPO: 'mandatogov_filtro_tipo',
  FILTRO_BAIRRO: 'mandatogov_filtro_bairro'
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach(fn => {
    try {
      fn();
    } catch (e) {
      console.error('Erro ao notificar listener:', e);
    }
  });
}

export const subscribeToDataChanges = (callback: Listener) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Erro ao carregar chave ${key}:`, error);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (error) {
    console.error(`Erro ao salvar chave ${key}:`, error);
  }
}

export class DataService {
  // ============================================================================
  // 1. INDICADOS (PESSOAS / LIDERANÇAS COM ENDEREÇO RESIDENCIAL)
  // ============================================================================
  static getIndicados(): Indicado[] {
    return getItem<Indicado[]>(STORAGE_KEYS.INDICADOS, INITIAL_INDICADOS);
  }

  static getIndicadoById(id: string): Indicado | undefined {
    return this.getIndicados().find(i => i.id === id);
  }

  static createIndicado(data: Omit<Indicado, 'id' | 'created_at'>): Indicado {
    const all = this.getIndicados();
    const newIndicado: Indicado = {
      ...data,
      id: 'ind-' + Date.now(),
      cidade: data.cidade || 'Fortaleza',
      uf: data.uf || 'CE',
      created_at: new Date().toISOString()
    };
    setItem(STORAGE_KEYS.INDICADOS, [newIndicado, ...all]);
    return newIndicado;
  }

  static updateIndicado(id: string, data: Partial<Indicado>): Indicado | null {
    const all = this.getIndicados();
    const index = all.findIndex(i => i.id === id);
    if (index === -1) return null;
    all[index] = { ...all[index], ...data };
    setItem(STORAGE_KEYS.INDICADOS, all);
    return all[index];
  }

  static deleteIndicado(id: string): boolean {
    const all = this.getIndicados();
    const filtered = all.filter(i => i.id !== id);
    setItem(STORAGE_KEYS.INDICADOS, filtered);

    // Remove também as indicações associadas
    const grade = this.getGradeIndicacoes();
    const filteredGrade = grade.filter(g => g.indicado_id !== id);
    setItem(STORAGE_KEYS.GRADE, filteredGrade);
    return true;
  }

  // ============================================================================
  // 2. LOCAIS DE TRABALHO & TERCEIRIZADAS
  // ============================================================================
  static getLocaisTrabalho(tipo?: TipoInstituicao): LocalTrabalho[] {
    const all = getItem<LocalTrabalho[]>(STORAGE_KEYS.LOCAIS, INITIAL_LOCAIS_TRABALHO);
    if (!tipo) return all;
    return all.filter(l => l.tipo_instituicao === tipo);
  }

  static getLocalTrabalhoById(id: string): LocalTrabalho | undefined {
    return this.getLocaisTrabalho().find(l => l.id === id);
  }

  static createLocalTrabalho(data: Omit<LocalTrabalho, 'id' | 'created_at'>): LocalTrabalho {
    const all = this.getLocaisTrabalho();
    const newLocal: LocalTrabalho = {
      ...data,
      id: 'local-' + Date.now(),
      created_at: new Date().toISOString()
    };
    setItem(STORAGE_KEYS.LOCAIS, [...all, newLocal]);
    return newLocal;
  }

  static updateLocalTrabalho(id: string, data: Partial<LocalTrabalho>): LocalTrabalho | null {
    const all = this.getLocaisTrabalho();
    const index = all.findIndex(l => l.id === id);
    if (index === -1) return null;
    all[index] = { ...all[index], ...data };
    setItem(STORAGE_KEYS.LOCAIS, all);
    return all[index];
  }

  static deleteLocalTrabalho(id: string): boolean {
    const all = this.getLocaisTrabalho();
    const filtered = all.filter(l => l.id !== id);
    setItem(STORAGE_KEYS.LOCAIS, filtered);
    return true;
  }

  // ============================================================================
  // 3. GRADE DE INDICAÇÕES (VÍNCULOS DE GABINETE)
  // ============================================================================
  static getGradeIndicacoes(): GradeIndicacao[] {
    return getItem<GradeIndicacao[]>(STORAGE_KEYS.GRADE, INITIAL_GRADE_INDICACOES);
  }

  static getGradeEnriquecida(): IndicacaoEnriquecida[] {
    const grade = this.getGradeIndicacoes();
    const indicados = this.getIndicados();
    const locais = this.getLocaisTrabalho();

    const indicadosMap = new Map(indicados.map(i => [i.id, i]));
    const locaisMap = new Map(locais.map(l => [l.id, l]));

    return grade.map(g => {
      const indicado = indicadosMap.get(g.indicado_id) || {
        id: g.indicado_id,
        nome_completo: 'Indicado Não Encontrado',
        cpf: '000.000.000-00',
        telefone: '(85) 0000-0000',
        endereco_residencial: 'Endereço não informado',
        bairro_residencia: 'Não Informado',
        cidade: 'Fortaleza',
        uf: 'CE',
        created_at: ''
      };

      const local = locaisMap.get(g.local_trabalho_id) || {
        id: g.local_trabalho_id,
        tipo_instituicao: 'Empresa Terceirizada',
        nome_empresa_ou_orgao: 'Local / Terceirizada Não Encontrada',
        sigla_ou_apelido: 'N/D',
        endereco_trabalho: 'Endereço não informado',
        esfera: 'Municipal - Fortaleza',
        created_at: ''
      };

      return {
        ...g,
        indicado,
        local
      };
    });
  }

  static createGradeIndicacao(data: Omit<GradeIndicacao, 'id' | 'created_at'>): GradeIndicacao {
    const all = this.getGradeIndicacoes();
    const newRecord: GradeIndicacao = {
      ...data,
      id: 'grad-' + Date.now(),
      data_indicacao: data.data_indicacao || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };
    setItem(STORAGE_KEYS.GRADE, [newRecord, ...all]);
    return newRecord;
  }

  static updateGradeIndicacao(id: string, data: Partial<GradeIndicacao>): GradeIndicacao | null {
    const all = this.getGradeIndicacoes();
    const index = all.findIndex(g => g.id === id);
    if (index === -1) return null;
    all[index] = { ...all[index], ...data };
    setItem(STORAGE_KEYS.GRADE, all);
    return all[index];
  }

  static deleteGradeIndicacao(id: string): boolean {
    const all = this.getGradeIndicacoes();
    const filtered = all.filter(g => g.id !== id);
    setItem(STORAGE_KEYS.GRADE, filtered);
    return true;
  }

  // ============================================================================
  // 4. DASHBOARD & MÉTRICAS ESTRATÉGICAS DE GABINETE
  // ============================================================================
  static getDashboardMetrics(): DashboardGabineteMetrics {
    const indicados = this.getIndicados();
    const grade = this.getGradeEnriquecida();

    const ativas = grade.filter(g => g.status === 'Ativo');
    const terceirizadas = ativas.filter(g => g.local.tipo_instituicao === 'Empresa Terceirizada');
    const diretos = ativas.filter(g => g.local.tipo_instituicao !== 'Empresa Terceirizada');
    const emAnalise = grade.filter(g => g.status === 'Em Análise / Aguardando Vaga');

    const impactoTotal = ativas.reduce((acc, g) => acc + (g.remuneracao_estimada || 0), 0);

    // Mapeamento de Bairros de Residência
    const bairrosCount = new Map<string, number>();
    indicados.forEach(i => {
      const b = i.bairro_residencia.trim() || 'Outros Bairros';
      bairrosCount.set(b, (bairrosCount.get(b) || 0) + 1);
    });

    const topBairros = Array.from(bairrosCount.entries())
      .map(([bairro, count]) => ({ bairro, count }))
      .sort((a, b) => b.count - a.count);

    // Distribuição por Tipo de Lotação (Prefeitura vs Estado vs Terceirizadas)
    const tipos: TipoInstituicao[] = [
      'Empresa Terceirizada',
      'Prefeitura de Fortaleza',
      'Governo do Estado do Ceará'
    ];

    const distribuicao = tipos.map(t => {
      const itens = ativas.filter(g => g.local.tipo_instituicao === t);
      const valor = itens.reduce((acc, g) => acc + (g.remuneracao_estimada || 0), 0);
      return {
        tipo: t,
        count: itens.length,
        valor
      };
    });

    return {
      total_indicados_cadastrados: indicados.length,
      total_indicacoes_ativas: ativas.length,
      total_em_terceirizadas: terceirizadas.length,
      total_em_orgaos_diretos: diretos.length,
      total_aguardando_vaga: emAnalise.length,
      impacto_politico_mensal: impactoTotal,
      top_bairros_moradia: topBairros,
      distribuicao_por_tipo: distribuicao,
      indicacoes_recentes: grade.slice(0, 6)
    };
  }

  // ============================================================================
  // 5. RESTAURAR DADOS DEMO
  // ============================================================================
  static resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.INDICADOS);
    localStorage.removeItem(STORAGE_KEYS.LOCAIS);
    localStorage.removeItem(STORAGE_KEYS.GRADE);
    localStorage.removeItem(STORAGE_KEYS.FILTRO_TIPO);
    localStorage.removeItem(STORAGE_KEYS.FILTRO_BAIRRO);
    notifyListeners();
  }
}
