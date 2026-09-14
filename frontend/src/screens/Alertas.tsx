/* Tela 4 — Alertas & Ações (Alertas / Promoções) */
import { promocoes, severidades } from '../data';
import { useApp } from '../AppContext';
import { Icon } from '../components/Icon';
import { TabBar, type TabItem } from '../components/TabBar';

export function Alertas() {
  const {
    state,
    setAba,
    irPara,
    marcarCiente,
    ativarPromo,
    recusarPromo,
    escoado,
    perda,
    setDesconto,
    alertasAtivos,
  } = useApp();

  const ativos = alertasAtivos();
  const abas: TabItem[] = [
    { id: 'alertas', label: 'Alertas', icone: 'ph-warning', badge: ativos.length || null },
    { id: 'promocoes', label: 'Promoções', icone: 'ph-tag' },
  ];

  const s = promocoes.sugestao;
  const rodando = [...promocoes.andamento, ...(state.promoExtra ? [state.promoExtra] : [])];

  return (
    <section className="view active">
      <header className="top-header">
        <h1>Alertas &amp; Ações</h1>
      </header>
      <TabBar abas={abas} ativa={state.abaAlertas} onSelect={(id) => setAba('abaAlertas', id)} />

      {state.abaAlertas === 'alertas' ? (
        ativos.length ? (
          ativos.map((a) => {
            const sev = severidades[a.sev];
            return (
              <article key={a.id} className={`alert-card ${sev.classe}`}>
                <div className="alert-head">
                  <Icon name={sev.icone} size={17} />
                  <span className="level">{sev.nivel}</span>
                  <span className="name">— {a.nome}</span>
                </div>
                <p className="alert-detail">{a.detalhe}</p>
                <div className="btn-row">
                  <button className="btn-primary" onClick={() => irPara('alertas', 'promocoes')}>
                    <Icon name="ph-check-square" size={16} />
                    Ativar Promoção
                  </button>
                  <button className="btn-ghost btn-shrink" onClick={() => marcarCiente(a.id)}>
                    Marcar Ciente
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty-state">
            <Icon name="ph-check-circle" size={34} color="var(--primary)" />
            Nenhum alerta pendente
          </div>
        )
      ) : (
        <>
          <div className="chip">
            <Icon name="ph-lightbulb" size={14} />
            Sugestões Pendentes
          </div>
          {state.sugestaoPendente ? (
            <article className="promo-card cat-quebra">
              <p className="title">
                {s.emoji} {s.nome}
              </p>
              <p className="alert-detail">{s.detalhe}</p>
              <p className="promo-line">
                <Icon name="ph-calendar-check" size={15} />
                Melhor dia: <strong>{s.melhorDia}</strong>
              </p>
              <p className="promo-line">
                <Icon name="ph-coins" size={15} />
                Margem: {s.margem} (aguenta até {s.descontoMax} de desconto)
              </p>
              <div className="discount-row">
                <span>Desconto:</span>
                <div className="discount-field">
                  <input
                    value={state.desconto}
                    maxLength={2}
                    inputMode="numeric"
                    onChange={(e) => setDesconto(e.target.value)}
                  />
                  <span>%</span>
                </div>
              </div>
              <div className="btn-row">
                <button className="btn-primary" onClick={ativarPromo}>
                  <Icon name="ph-check" size={16} />
                  Ativar Promoção
                </button>
                <button className="btn-danger btn-shrink" onClick={recusarPromo}>
                  <Icon name="ph-x" size={16} />
                  Recusar
                </button>
              </div>
            </article>
          ) : (
            <p className="section-hint">Nenhuma sugestão pendente</p>
          )}

          <div className="chip">
            <Icon name="ph-tag" size={14} />
            Em Andamento
          </div>
          {rodando.map((p) => (
            <article key={p.id} className="promo-card cat-success">
              <div className="title-row">
                <span className="title">
                  {p.emoji} {p.nome} — {p.desconto} OFF
                </span>
                <span className="tag-running">EM ANDAMENTO</span>
              </div>
              <p className="alert-detail">Ativa desde {p.desde}</p>
              <p className="promo-question">Lote foi escoado?</p>
              <div className="btn-row">
                <button className="btn-cat" onClick={() => escoado(p.lote, p.evitado)}>
                  <Icon name="ph-check" size={16} />
                  Sim, 100% vendido
                </button>
                <button className="btn-danger" onClick={() => perda(p.evitado)}>
                  <Icon name="ph-x" size={16} />
                  Não, houve perda
                </button>
              </div>
            </article>
          ))}
        </>
      )}
    </section>
  );
}
