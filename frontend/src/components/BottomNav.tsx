/* Navegação inferior — some no login e nas configurações. */
import { useApp } from '../AppContext';
import { Icon } from './Icon';
import type { Tela } from '../types';

interface NavDef {
  target: Tela;
  label: string;
  icone: string;
  badge?: boolean;
}

const ITENS: NavDef[] = [
  { target: 'inicio', label: 'Início', icone: 'ph-house' },
  { target: 'lotes', label: 'Lotes', icone: 'ph-package' },
  { target: 'cardapio', label: 'Cardápio', icone: 'ph-fork-knife' },
  { target: 'alertas', label: 'Alertas', icone: 'ph-bell', badge: true },
];

export function BottomNav() {
  const { state, irPara, alertasAtivos } = useApp();
  const oculta = state.tela === 'login' || state.tela === 'config';

  return (
    <nav className={`bottom-nav ${oculta ? 'hidden' : ''}`}>
      {ITENS.map((item) => (
        <a
          key={item.target}
          href="#"
          className={`nav-item ${item.target === state.tela ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            irPara(item.target);
          }}
        >
          {item.badge ? (
            <div className="icon-wrapper">
              <Icon name={item.icone} size={24} />
              <span className="badge">{alertasAtivos().length}</span>
            </div>
          ) : (
            <Icon name={item.icone} size={24} />
          )}
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
