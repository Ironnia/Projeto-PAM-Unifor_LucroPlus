/* Tela 3 — Cardápio (Ranking / Matriz BCG) */
import { categorias, pratos } from '../data';
import { useApp } from '../AppContext';
import { TabBar, type TabItem } from '../components/TabBar';
import type { CategoriaKey } from '../types';

const dirClasse = (dir: number) => (dir > 0 ? 'up' : dir < 0 ? 'down' : 'flat');
const dirSeta = (dir: number) => (dir > 0 ? '▲' : dir < 0 ? '▼' : '●');

const ABAS: TabItem[] = [
  { id: 'ranking', label: 'Ranking', icone: 'ph-trophy' },
  { id: 'bcg', label: 'Matriz BCG', icone: 'ph-puzzle-piece' },
];

const ORDEM_BCG: CategoriaKey[] = ['ESTRELA', 'BURRO', 'QUEBRA', 'CAO'];

export function Cardapio() {
  const { state, setAba, irPara, abrirPrato } = useApp();

  return (
    <section className="view active">
      <header className="top-header">
        <h1>Cardápio</h1>
      </header>
      <TabBar abas={ABAS} ativa={state.abaCardapio} onSelect={(id) => setAba('abaCardapio', id)} />

      {state.abaCardapio === 'ranking' ? (
        <>
          <p className="section-hint">Score = Margem × Volume | Comparado ao mês anterior</p>
          {pratos.map((p, idx) => {
            const c = categorias[p.cat];
            return (
              <article
                key={p.id}
                className={`card rank-row ${c.classe} ${idx === 0 ? 'is-first' : ''}`}
                onClick={() => abrirPrato(p.id)}
              >
                <div className="rank-pos">
                  <span className="pos">{p.pos}</span>
                  <span className={`delta ${dirClasse(p.dir)}`}>
                    {dirSeta(p.dir)} {p.delta}
                  </span>
                </div>
                <div className="rank-divider" />
                <div className="rank-body">
                  <div className="rank-title-row">
                    <span className="name">{p.nome}</span>
                    <span className={`badge-cat ${p.cat === 'ESTRELA' ? 'solid' : ''}`}>{c.badge}</span>
                  </div>
                  <p className="rank-metrics">
                    Margem: <strong>{p.margem}</strong> | Vendas: <strong>{p.vendas}</strong>
                  </p>
                  {p.nota ? <p className={`rank-note ${dirClasse(p.dir)}`}>{p.nota}</p> : null}
                  {p.cat === 'QUEBRA' ? (
                    <button
                      className="link-action"
                      onClick={(e) => {
                        e.stopPropagation();
                        irPara('alertas', 'promocoes');
                      }}
                    >
                      Sugerir Promoção
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </>
      ) : (
        ORDEM_BCG.map((k) => {
          const c = categorias[k];
          const itens = pratos.filter((p) => p.cat === k);
          const acaoClasse = k === 'QUEBRA' ? 'boxed' : k === 'CAO' ? 'muted' : '';
          return (
            <section key={k} className={`bcg-group ${c.classe}`}>
              <h3>
                <span>{c.emoji}</span>
                {c.grupo}
              </h3>
              {itens.map((p) => (
                <div key={p.id} className="bcg-item" onClick={() => abrirPrato(p.id)}>
                  <div className="bcg-item-head">
                    <span className="name">{p.curto}</span>
                    <span className={`badge-cat ${k === 'ESTRELA' ? 'solid' : ''}`}>{c.badge}</span>
                  </div>
                  <div className="bcg-item-foot">
                    <div className="metrics">
                      <div>
                        Margem: <strong>{p.margem}</strong>
                      </div>
                      <div>
                        Vendas: <strong>{p.vendas}</strong>
                      </div>
                    </div>
                    {c.acao ? <span className={`hint-action ${acaoClasse}`}>{c.acao}</span> : null}
                  </div>
                </div>
              ))}
            </section>
          );
        })
      )}
    </section>
  );
}
