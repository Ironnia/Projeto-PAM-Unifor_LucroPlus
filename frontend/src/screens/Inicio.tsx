/* Tela 1 — Início (dashboard) */
import { dashboard, perfil } from '../data';
import { useApp } from '../AppContext';
import { Icon } from '../components/Icon';
import type { Tela } from '../types';

export function Inicio() {
  const { state, abrirConfig, irPara, sync, alertasAtivos, promocoesAtivas } = useApp();

  const pills: {
    classe: string;
    icone: string;
    l1: string;
    l2: string;
    tela: Tela;
    aba?: 'alertas' | 'promocoes';
  }[] = [
    { classe: 'cat-success', icone: 'ph-shield-check', l1: dashboard.prejuizoEvitado, l2: 'salvos', tela: 'inicio' },
    { classe: 'cat-danger', icone: 'ph-warning', l1: `${alertasAtivos().length} lotes`, l2: 'críticos', tela: 'alertas', aba: 'alertas' },
    { classe: 'cat-estrela', icone: 'ph-tag', l1: `${promocoesAtivas()} proms.`, l2: 'ativas', tela: 'alertas', aba: 'promocoes' },
  ];

  return (
    <section className="view active">
      <header className="top-header">
        <div>
          <h1>LucroPlus</h1>
          <p className="greeting">Bom dia, {perfil.nome.split(' ')[0]} 👋</p>
        </div>
        <span onClick={abrirConfig} style={{ cursor: 'pointer', display: 'inline-flex' }}>
          <Icon name="ph-gear" size={24} color="var(--text-secondary)" />
        </span>
      </header>

      <section className="card card-faturamento">
        <p className="subtitle font-accent">FATURAMENTO</p>
        <div className="value-row">
          <h2 className="value font-accent text-gradient-primary">{dashboard.faturamento}</h2>
          <Icon name="ph-trend-up" size={30} color="var(--primary)" />
        </div>
        <p className="comparison">
          {dashboard.periodo} | <span>{dashboard.variacao}</span>
        </p>
      </section>

      <section className="status-grid">
        {pills.map((p, i) => (
          <div
            key={i}
            className={`status-pill ${p.classe}`}
            onClick={() => irPara(p.tela, p.aba)}
          >
            <Icon name={p.icone} size={16} />
            <span>
              {p.l1}
              <br />
              {p.l2}
            </span>
          </div>
        ))}
      </section>

      <section className="card">
        <h3 className="chart-title">Vendas — 7 dias</h3>
        <div className="chart-bars">
          {dashboard.vendasSemana.map((d) => (
            <div key={d.dia} className="chart-col">
              <div className="bar" style={{ height: `${d.pct}%` }} />
              <span className="day">{d.dia}</span>
            </div>
          ))}
        </div>
      </section>

      <button className={`btn-outline ${state.sincronizando ? 'is-loading' : ''}`} onClick={sync}>
        <Icon name={state.sincronizando ? 'ph-circle-notch' : 'ph-arrows-clockwise'} size={18} />
        {state.sincronizando ? 'Sincronizando…' : state.sincronizado ? 'Sincronizado agora' : 'Sincronizar PDV'}
      </button>
    </section>
  );
}
