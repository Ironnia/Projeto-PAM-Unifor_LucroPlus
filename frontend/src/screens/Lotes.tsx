/* Tela 2 — Painel de Lotes (Previsão / Estoque) */
import { estoque, previsao, severidades } from '../data';
import { useApp } from '../AppContext';
import { Icon } from '../components/Icon';
import { TabBar, type TabItem } from '../components/TabBar';
import type { Severidade } from '../types';

const sevClasse = (sev: Severidade) => severidades[sev].classe;

const ABAS: TabItem[] = [
  { id: 'estoque', label: 'Estoque', icone: 'ph-archive' },
  { id: 'previsao', label: 'Previsão', icone: 'ph-trend-up' },
];

export function Lotes() {
  const { state, setAba } = useApp();

  return (
    <section className="view active">
      <header className="top-header">
        <h1>Painel de Lotes</h1>
      </header>
      <TabBar abas={ABAS} ativa={state.abaLotes} onSelect={(id) => setAba('abaLotes', id)} />

      {state.abaLotes === 'previsao' ? (
        <>
          <p className="section-hint">Estimativa baseada no histórico dos últimos 3 meses</p>
          {previsao.map((i) => (
            <article key={i.id} className={`card item-card ${sevClasse(i.sev)}`}>
              <div className="item-head">
                <span className="emoji">{i.emoji}</span>
                <span className="name">{i.nome}</span>
                {i.ok ? <span className="ok">{i.ok}</span> : null}
              </div>
              <div className="item-metrics">
                <span>
                  Estoque atual: <strong>{i.estoque}</strong>
                </span>
                <span>
                  Estimativa para o mês: <strong>{i.estimativa}</strong>
                </span>
              </div>
              <div className="progress">
                <div className="fill" style={{ width: `${i.pct}%` }}>
                  {i.pct}%
                </div>
              </div>
              <p className="item-foot">
                <Icon name={i.icone} size={16} />
                {i.rodape}
              </p>
              {i.aviso ? <p className="item-warn">{i.aviso}</p> : null}
            </article>
          ))}
        </>
      ) : (
        <>
          <p className="section-hint">{estoque.length} lotes ativos · ordenados por validade</p>
          {estoque.map((l) => (
            <article key={l.lote} className={`card lote-card ${sevClasse(l.sev)}`}>
              <div className="lote-head">
                <div className="item-head">
                  <span className="emoji">{l.emoji}</span>
                  <span className="name">{l.nome}</span>
                </div>
                <span className="badge-cat">{l.prazo}</span>
              </div>
              <p className="lote-meta">
                Lote {l.lote} · {l.qtd} · validade {l.validade}
              </p>
              <div className="progress thin">
                <div className="fill" style={{ width: `${l.pct}%` }} />
              </div>
            </article>
          ))}
        </>
      )}
    </section>
  );
}
