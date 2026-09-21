/**
 * Tipos e contratos de dados da API LucroPlus
 */

export const CriticidadeLote = {
  CRITICO: 'CRITICO',   // <= 2 dias
  ATENCAO: 'ATENCAO',   // 3 a 5 dias
  SEGURO: 'SEGURO',     // > 5 dias
};

export const TipoUsuario = {
  ADMIN: 'ADMIN',
  GERENTE: 'GERENTE',
  ESTOQUISTA: 'ESTOQUISTA',
};
