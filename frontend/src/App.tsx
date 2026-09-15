/* ==========================================================================
   App — moldura do protótipo LucroPlus.
   Renderiza a tela ativa, a navegação inferior e os overlays (toast + sheet).
   ========================================================================== */
import type { ReactElement } from 'react';
import { AppProvider, useApp } from './AppContext';
import { BottomNav } from './components/BottomNav';
import { SheetPrato } from './components/SheetPrato';
import { Toast } from './components/Toast';
import { Login } from './screens/Login';
import { Inicio } from './screens/Inicio';
import { Lotes } from './screens/Lotes';
import { Cardapio } from './screens/Cardapio';
import { Alertas } from './screens/Alertas';
import { Config } from './screens/Config';
import type { Tela } from './types';

const TELAS: Record<Tela, () => ReactElement> = {
  login: Login,
  inicio: Inicio,
  lotes: Lotes,
  cardapio: Cardapio,
  alertas: Alertas,
  config: Config,
};

function Shell() {
  const { state } = useApp();
  const Tela = TELAS[state.tela];
  const navOculta = state.tela === 'login' || state.tela === 'config';

  return (
    <div className="app-container">
      <main
        id="app-content"
        style={{ paddingBottom: navOculta ? 'var(--space-6)' : '90px' }}
      >
        <Tela />
      </main>

      <BottomNav />

      <div id="overlays">
        <Toast mensagem={state.toast} />
        <SheetPrato />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
