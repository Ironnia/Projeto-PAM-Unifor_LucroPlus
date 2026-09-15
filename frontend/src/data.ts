/* ==========================================================================
   LucroPlus — DADOS MOCADOS (demonstração)
   Toda a informação exibida na UI vem daqui. Em produção este objeto é
   substituído pela resposta da API / sync do PDV.
   Portado do js/data.js do protótipo HTML original.
   ========================================================================== */
import type {
  Alerta,
  Categoria,
  CategoriaKey,
  Conexao,
  Dashboard,
  EstoqueItem,
  Perfil,
  Prato,
  PrevisaoItem,
  Promocoes,
  Severidade,
  SeveridadeInfo,
} from './types';

/* Perfil e conexão -------------------------------------------------- */
export const perfil: Perfil = {
  nome: 'João Victor',
  cargo: 'Gerente',
  restaurante: 'Restaurante Leroliro',
  email: 'joao@leroliro.com.br',
};

export const conexao: Conexao = {
  status: 'conectado',
  banco: 'restaurante_db',
  ultimaSync: '26/08/2026 às 14:32',
  credenciais: [
    { id: 'host', label: 'Host / IP do Servidor', valor: '192.168.1.10' },
    { id: 'porta', label: 'Porta', valor: '3306' },
    { id: 'db', label: 'Nome do Banco', valor: 'restaurante_db' },
    { id: 'user', label: 'Usuário', valor: 'root' },
    { id: 'pass', label: 'Senha', valor: '••••••••', senha: true },
  ],
};

/* Dashboard --------------------------------------------------------- */
export const dashboard: Dashboard = {
  faturamento: 'R$ 42.500',
  periodo: 'Agosto 2026',
  variacao: '↑ 12% vs Jul',
  prejuizoEvitado: 'R$ 1.850',
  vendasSemana: [
    { dia: 'Seg', pct: 40 },
    { dia: 'Ter', pct: 70 },
    { dia: 'Qua', pct: 100 },
    { dia: 'Qui', pct: 60 },
    { dia: 'Sex', pct: 80 },
    { dia: 'Sáb', pct: 50 },
    { dia: 'Dom', pct: 65 },
  ],
};

/* Categorias BCG ---------------------------------------------------- */
export const categorias: Record<CategoriaKey, Categoria> = {
  ESTRELA: { classe: 'cat-estrela', emoji: '⭐', badge: 'ESTRELA', nome: 'Estrela', grupo: 'Estrelas', acao: null },
  BURRO: { classe: 'cat-burro', emoji: '🐂', badge: 'BURRO', nome: 'Burro de Carga', grupo: 'Burros de Carga', acao: 'Otimizar — revise o custo' },
  QUEBRA: { classe: 'cat-quebra', emoji: '🧩', badge: 'QUEBRA-CABEÇA', nome: 'Quebra-Cabeça', grupo: 'Quebra-Cabeças', acao: 'Sugerir Promoção' },
  CAO: { classe: 'cat-cao', emoji: '🐕', badge: 'CÃO', nome: 'Cão', grupo: 'Cões', acao: 'Avaliar remoção' },
};

/* Meses do histórico BCG (index 0 = mês atual) ----------------------- */
export const meses: string[] = ['Ago/2026', 'Jul/2026', 'Jun/2026', 'Mai/2026', 'Abr/2026'];

/* Cardápio — ranking + matriz BCG ------------------------------------ */
export const pratos: Prato[] = [
  { id: 1, pos: '#1', nome: 'Hambúrguer Artesanal da Casa', curto: 'Hambúrguer Artesanal', cat: 'ESTRELA', margem: '68%', vendas: '240 un/mês', delta: '+2', dir: 1, nota: 'subiu 2 posições', historico: ['ESTRELA', 'ESTRELA', 'BURRO', 'QUEBRA', 'CAO'] },
  { id: 2, pos: '#2', nome: 'X-Bacon', curto: 'X-Bacon', cat: 'ESTRELA', margem: '61%', vendas: '160 un/mês', delta: '+1', dir: 1, historico: ['ESTRELA', 'ESTRELA', 'ESTRELA', 'BURRO', 'BURRO'] },
  { id: 3, pos: '#3', nome: 'Hambúrguer Duplo', curto: 'Hambúrguer Duplo', cat: 'BURRO', margem: '55%', vendas: '140 un/mês', delta: '—0', dir: 0, historico: ['BURRO', 'BURRO', 'BURRO', 'ESTRELA', 'BURRO'] },
  { id: 4, pos: '#4', nome: 'Pizza Margherita', curto: 'Pizza Margherita', cat: 'BURRO', margem: '52%', vendas: '180 un/mês', delta: '-1', dir: -1, nota: 'caiu 1 posição', historico: ['BURRO', 'ESTRELA', 'ESTRELA', 'BURRO', 'BURRO'] },
  { id: 5, pos: '#5', nome: 'Wrap Saudável', curto: 'Wrap Saudável', cat: 'QUEBRA', margem: '71%', vendas: '60 un/mês', delta: '+2', dir: 1, historico: ['QUEBRA', 'QUEBRA', 'CAO', 'CAO', 'CAO'] },
  { id: 6, pos: '#6', nome: 'X-Salada', curto: 'X-Salada', cat: 'CAO', margem: '48%', vendas: '90 un/mês', delta: '—0', dir: 0, historico: ['CAO', 'CAO', 'BURRO', 'BURRO', 'CAO'] },
  { id: 7, pos: '#7', nome: 'Salada Caesar', curto: 'Salada Caesar', cat: 'CAO', margem: '35%', vendas: '20 un/mês', delta: '-2', dir: -1, historico: ['CAO', 'CAO', 'CAO', 'QUEBRA', 'BURRO'] },
];

/* Lotes — previsão de compra (severidade: danger | estrela | success) */
export const previsao: PrevisaoItem[] = [
  { id: 'salmao', emoji: '🐟', nome: 'Filé de Salmão', estoque: '4,5 kg', estimativa: '12 kg', pct: 37, sev: 'danger', lote: '#104', diasParaVencer: 3, rodape: 'Faltam: 7,5 kg — Compre antes de 02/09', icone: 'ph-shopping-cart', aviso: 'Ruptura estimada em 3 dias' },
  { id: 'queijo', emoji: '🧀', nome: 'Queijo Muçarela', estoque: '8 kg', estimativa: '14 kg', pct: 57, sev: 'estrela', lote: '#089', diasParaVencer: 9, rodape: 'Faltam: 6 kg — Compre até 15/09', icone: 'ph-shopping-cart' },
  { id: 'carne', emoji: '🥩', nome: 'Carne Moída', estoque: '18 kg', estimativa: '15 kg', pct: 100, sev: 'success', lote: '#102', ok: 'OK', rodape: 'Estoque suficiente para o mês', icone: 'ph-check-circle' },
  { id: 'pao', emoji: '🍞', nome: 'Pão de Hambúrguer', estoque: '120 un', estimativa: '80 un', pct: 100, sev: 'success', lote: '#097', rodape: 'Estoque suficiente', icone: 'ph-check-circle' },
  { id: 'alface', emoji: '🥬', nome: 'Alface', estoque: '2 kg', estimativa: '5 kg', pct: 40, sev: 'estrela', lote: '#110', diasParaVencer: 2, rodape: 'Faltam: 3 kg — Compre até 08/09', icone: 'ph-shopping-cart' },
];

/* Lotes — estoque atual (ordenado por validade) ---------------------- */
export const estoque: EstoqueItem[] = [
  { lote: '#110', emoji: '🥬', nome: 'Alface', qtd: '2 kg', validade: '04/09', prazo: '2 DIAS', pct: 14, sev: 'danger' },
  { lote: '#104', emoji: '🐟', nome: 'Filé de Salmão', qtd: '4,5 kg', validade: '05/09', prazo: '3 DIAS', pct: 22, sev: 'danger' },
  { lote: '#089', emoji: '🧀', nome: 'Queijo Muçarela', qtd: '8 kg', validade: '11/09', prazo: '9 DIAS', pct: 45, sev: 'estrela' },
  { lote: '#102', emoji: '🥩', nome: 'Carne Moída', qtd: '18 kg', validade: '16/09', prazo: '14 DIAS', pct: 62, sev: 'estrela' },
  { lote: '#111', emoji: '🍅', nome: 'Tomate', qtd: '6 kg', validade: '22/09', prazo: '20 DIAS', pct: 74, sev: 'success' },
  { lote: '#097', emoji: '🍞', nome: 'Pão de Hambúrguer', qtd: '120 un', validade: '28/09', prazo: '26 DIAS', pct: 88, sev: 'success' },
];

/* Promoções ---------------------------------------------------------- */
export const promocoes: Promocoes = {
  sugestao: {
    id: 'sug-salmao',
    emoji: '🐟',
    nome: 'Salmão Grelhado',
    detalhe: 'Lote #104 vence em 3 dias | 4,5 kg restantes',
    melhorDia: 'Quinta-feira',
    margem: '55%',
    descontoMax: '30%',
    descontoSugerido: '20',
  },
  andamento: [
    { id: 'run-duplo', emoji: '🍔', nome: 'Hambúrguer Duplo', desconto: '15%', desde: 'Segunda-feira', lote: '#102', evitado: 'R$ 320' },
    { id: 'run-queijo', emoji: '🧀', nome: 'Queijo Muçarela', desconto: '10%', desde: 'Terça-feira', lote: '#089', evitado: 'R$ 190' },
  ],
};

/* Mapa severidade → classe de token + rótulo de alerta --------------- */
export const severidades: Record<Severidade, SeveridadeInfo> = {
  danger: { classe: 'cat-danger', nivel: 'CRÍTICO', icone: 'ph-warning-octagon' },
  estrela: { classe: 'cat-estrela', nivel: 'ATENÇÃO', icone: 'ph-warning' },
  success: { classe: 'cat-success', nivel: 'OK', icone: 'ph-check-circle' },
};

/* Alertas derivados da previsão: só itens com validade curta e severidade
   crítica/atenção entram na Tela 4. */
export const alertas: Alerta[] = previsao
  .filter((i) => i.diasParaVencer && i.sev !== 'success')
  .map((i) => ({
    id: i.id,
    sev: i.sev,
    nome: i.nome,
    detalhe: `Lote ${i.lote} vence em ${i.diasParaVencer} dias | Restam ${i.estoque}`,
  }));
