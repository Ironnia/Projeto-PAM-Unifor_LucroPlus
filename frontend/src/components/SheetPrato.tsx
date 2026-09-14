/* Bottom sheet: histórico de categorias BCG de um prato + sparkline. */
import { categorias, meses, pratos } from '../data';
import { useApp } from '../AppContext';
import { Icon } from './Icon';
import type { CategoriaKey } from '../types';

/** Cor CSS (--color-*) correspondente a cada categoria, para o sparkline. */
function corCategoria(cat: CategoriaKey): string {
  const slug = cat === 'QUEBRA' ? 'quebra-cabeca' : cat.toLowerCase();
  return `var(--color-${slug})`;
}

export function SheetPrato() {
  const { state, fecharPrato } = useApp();
  const p = pratos.find((x) => x.id === state.pratoAberto);
  if (!p) return null;

  const c = categorias[p.cat];
  const ordem: CategoriaKey[] = ['CAO', 'QUEBRA', 'BURRO', 'ESTRELA'];
  const pontos = [...p.historico].reverse().map((cat, i) => ({
    x: 20 + i * 44,
    y: 64 - ordem.indexOf(cat) * 16,
    cat,
  }));

  return (
    <>
      <div className="sheet-overlay" onClick={fecharPrato} />
      <section className={`sheet ${c.classe}`}>
        <div className="handle" />
        <div className="sheet-head">
          <h2>
            {c.emoji} {p.nome}
          </h2>
          <div className="sheet-close" onClick={fecharPrato}>
            <Icon name="ph-x" size={16} />
          </div>
        </div>
        <div>
          <span className="badge-cat">{c.badge}</span>
        </div>
        <p className="metrics">
          Margem: <strong>{p.margem}</strong> | Vendas:{' '}
          <strong>{p.vendas.replace(' un/mês', ' un')}</strong>
        </p>
        <h3>
          <Icon name="ph-calendar-blank" size={18} />
          Histórico de Categorias
        </h3>
        <div className="history">
          {p.historico.map((cat, i) => (
            <div key={i} className={`history-row ${categorias[cat].classe}`}>
              <span className="month">{meses[i]}</span>
              <Icon name="ph-arrow-right" size={14} />
              <span className="cat">
                {categorias[cat].emoji} {categorias[cat].nome}
              </span>
            </div>
          ))}
        </div>
        <div className="spark">
          <svg width="216" height="80" viewBox="0 0 216 80">
            <polyline
              points={pontos.map((pt) => `${pt.x},${pt.y}`).join(' ')}
              fill="none"
              stroke="var(--border-color)"
              strokeWidth={2}
            />
            {pontos.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={i === pontos.length - 1 ? 6.5 : 4.5}
                fill={corCategoria(pt.cat)}
                opacity={i === pontos.length - 1 ? 1 : 0.7}
              />
            ))}
          </svg>
        </div>
      </section>
    </>
  );
}
