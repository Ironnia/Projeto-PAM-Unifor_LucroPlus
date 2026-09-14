/* ==========================================================================
   AppContext — estado global + ações do protótipo.
   Porta o objeto `state` e o mapa `acoes` do js/app.js original para React,
   mantendo os mesmos comportamentos (navegação, sync, promoções, toast…).
   ========================================================================== */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { alertas, promocoes } from './data';
import type { PromoAndamento, Tela } from './types';

type AbaLotes = 'previsao' | 'estoque';
type AbaCardapio = 'ranking' | 'bcg';
type AbaAlertas = 'alertas' | 'promocoes';

export interface AppState {
  tela: Tela;
  abaLotes: AbaLotes;
  abaCardapio: AbaCardapio;
  abaAlertas: AbaAlertas;
  cientes: string[];
  sugestaoPendente: boolean;
  desconto: string;
  promoExtra: PromoAndamento | null;
  sincronizando: boolean;
  sincronizado: boolean;
  senhaVisivel: boolean;
  pratoAberto: number | null;
  toast: string;
}

const estadoInicial: AppState = {
  tela: 'login',
  abaLotes: 'previsao',
  abaCardapio: 'ranking',
  abaAlertas: 'alertas',
  cientes: [],
  sugestaoPendente: true,
  desconto: promocoes.sugestao.descontoSugerido,
  promoExtra: null,
  sincronizando: false,
  sincronizado: false,
  senhaVisivel: false,
  pratoAberto: null,
  toast: '',
};

export interface AppController {
  state: AppState;
  /** alertas ainda não marcados como ciente */
  alertasAtivos: () => typeof alertas;
  /** total de promoções em andamento (fixas + extra ativada) */
  promocoesAtivas: () => number;
  irPara: (tela: Tela, aba?: AbaAlertas) => void;
  setAba: (chave: 'abaLotes' | 'abaCardapio' | 'abaAlertas', valor: string) => void;
  login: () => void;
  logout: () => void;
  abrirConfig: () => void;
  toggleSenha: () => void;
  abrirPrato: (id: number) => void;
  fecharPrato: () => void;
  setDesconto: (valor: string) => void;
  marcarCiente: (id: string) => void;
  ativarPromo: () => void;
  recusarPromo: () => void;
  escoado: (lote: string, evitado: string) => void;
  perda: (evitado: string) => void;
  sync: () => void;
  toast: (msg: string) => void;
}

const Ctx = createContext<AppController | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(estadoInicial);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const patch = useCallback((p: Partial<AppState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const toast = useCallback(
    (msg: string) => {
      patch({ toast: msg });
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => patch({ toast: '' }), 2600);
    },
    [patch],
  );

  const alertasAtivos = useCallback(
    () => alertas.filter((a) => !state.cientes.includes(a.id)),
    [state.cientes],
  );

  const promocoesAtivas = useCallback(
    () => promocoes.andamento.length + (state.promoExtra ? 1 : 0),
    [state.promoExtra],
  );

  const irPara = useCallback(
    (tela: Tela, aba?: AbaAlertas) => {
      patch({ tela, pratoAberto: null, ...(aba ? { abaAlertas: aba } : {}) });
    },
    [patch],
  );

  const ativarPromo = useCallback(() => {
    setState((s) => {
      const sug = promocoes.sugestao;
      const promoExtra: PromoAndamento = {
        id: 'run-sugestao',
        emoji: sug.emoji,
        nome: sug.nome,
        desconto: `${s.desconto}%`,
        desde: sug.melhorDia,
        lote: '#104',
        evitado: 'R$ 380',
      };
      return { ...s, sugestaoPendente: false, promoExtra };
    });
    toast('Promoção ativada e enviada ao PDV.');
  }, [toast]);

  const sync = useCallback(() => {
    setState((s) => {
      if (s.sincronizando) return s;
      return { ...s, sincronizando: true };
    });
    setTimeout(() => {
      patch({ sincronizando: false, sincronizado: true });
      toast('Dados do PDV atualizados.');
    }, 1400);
  }, [patch, toast]);

  const controller = useMemo<AppController>(
    () => ({
      state,
      alertasAtivos,
      promocoesAtivas,
      irPara,
      setAba: (chave, valor) => patch({ [chave]: valor } as Partial<AppState>),
      login: () => irPara('inicio'),
      logout: () => irPara('login'),
      abrirConfig: () => irPara('config'),
      toggleSenha: () => patch({ senhaVisivel: !state.senhaVisivel }),
      abrirPrato: (id) => patch({ pratoAberto: id }),
      fecharPrato: () => patch({ pratoAberto: null }),
      setDesconto: (valor) => patch({ desconto: valor.replace(/\D/g, '').slice(0, 2) }),
      marcarCiente: (id) => {
        const a = alertas.find((x) => x.id === id);
        setState((s) => ({ ...s, cientes: [...s.cientes, id] }));
        if (a) toast(`${a.nome}: alerta marcado como ciente.`);
      },
      ativarPromo,
      recusarPromo: () => {
        patch({ sugestaoPendente: false });
        toast('Sugestão recusada.');
      },
      escoado: (lote, evitado) => toast(`Lote ${lote} escoado. Prejuízo evitado: ${evitado}.`),
      perda: (evitado) => toast(`Perda registrada — ${evitado} lançados.`),
      sync,
      toast,
    }),
    [state, alertasAtivos, promocoesAtivas, irPara, patch, ativarPromo, sync, toast],
  );

  return <Ctx.Provider value={controller}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppController {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp deve ser usado dentro de <AppProvider>');
  return ctx;
}
