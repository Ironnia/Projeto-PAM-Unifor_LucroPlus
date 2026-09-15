/* Sub-abas reutilizáveis (Lotes / Cardápio / Alertas). */
import { Icon } from './Icon';

export interface TabItem {
  id: string;
  label: string;
  icone: string;
  badge?: number | null;
}

interface TabBarProps {
  abas: TabItem[];
  ativa: string;
  onSelect: (id: string) => void;
}

export function TabBar({ abas, ativa, onSelect }: TabBarProps) {
  return (
    <nav className="tab-bar">
      {abas.map((a) => (
        <div
          key={a.id}
          className={`tab ${a.id === ativa ? 'active' : ''}`}
          onClick={() => onSelect(a.id)}
        >
          <Icon name={a.icone} size={17} />
          {a.label}
          {a.badge ? <span className="badge">{a.badge}</span> : null}
        </div>
      ))}
    </nav>
  );
}
