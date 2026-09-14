/* ==========================================================================
   LucroPlus — Tipos do domínio (protótipo)
   Espelham a estrutura de LP_DATA do protótipo HTML original.
   ========================================================================== */

/** Chaves das categorias BCG. */
export type CategoriaKey = 'ESTRELA' | 'BURRO' | 'QUEBRA' | 'CAO';

/** Severidade usada em lotes/alertas. */
export type Severidade = 'danger' | 'estrela' | 'success';

/** Telas (views) do app. */
export type Tela = 'login' | 'inicio' | 'lotes' | 'cardapio' | 'alertas' | 'config';

export interface Perfil {
  nome: string;
  cargo: string;
  restaurante: string;
  email: string;
}

export interface Credencial {
  id: string;
  label: string;
  valor: string;
  senha?: boolean;
}

export interface Conexao {
  status: string;
  banco: string;
  ultimaSync: string;
  credenciais: Credencial[];
}

export interface VendaDia {
  dia: string;
  pct: number;
}

export interface Dashboard {
  faturamento: string;
  periodo: string;
  variacao: string;
  prejuizoEvitado: string;
  vendasSemana: VendaDia[];
}

export interface Categoria {
  classe: string;
  emoji: string;
  badge: string;
  nome: string;
  grupo: string;
  acao: string | null;
}

export interface Prato {
  id: number;
  pos: string;
  nome: string;
  curto: string;
  cat: CategoriaKey;
  margem: string;
  vendas: string;
  delta: string;
  /** direção da variação: 1 subiu, -1 caiu, 0 estável */
  dir: 1 | 0 | -1;
  nota?: string;
  historico: CategoriaKey[];
}

export interface PrevisaoItem {
  id: string;
  emoji: string;
  nome: string;
  estoque: string;
  estimativa: string;
  pct: number;
  sev: Severidade;
  lote: string;
  diasParaVencer?: number;
  ok?: string;
  rodape: string;
  icone: string;
  aviso?: string;
}

export interface EstoqueItem {
  lote: string;
  emoji: string;
  nome: string;
  qtd: string;
  validade: string;
  prazo: string;
  pct: number;
  sev: Severidade;
}

export interface PromoSugestao {
  id: string;
  emoji: string;
  nome: string;
  detalhe: string;
  melhorDia: string;
  margem: string;
  descontoMax: string;
  descontoSugerido: string;
}

export interface PromoAndamento {
  id: string;
  emoji: string;
  nome: string;
  desconto: string;
  desde: string;
  lote: string;
  evitado: string;
}

export interface Promocoes {
  sugestao: PromoSugestao;
  andamento: PromoAndamento[];
}

export interface SeveridadeInfo {
  classe: string;
  nivel: string;
  icone: string;
}

export interface Alerta {
  id: string;
  sev: Severidade;
  nome: string;
  detalhe: string;
}

export interface LucroPlusData {
  perfil: Perfil;
  conexao: Conexao;
  dashboard: Dashboard;
  categorias: Record<CategoriaKey, Categoria>;
  meses: string[];
  pratos: Prato[];
  previsao: PrevisaoItem[];
  estoque: EstoqueItem[];
  promocoes: Promocoes;
  severidades: Record<Severidade, SeveridadeInfo>;
  alertas: Alerta[];
}
