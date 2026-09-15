/* Tela 5 — Configurações */
import { conexao, perfil } from '../data';
import { useApp } from '../AppContext';
import { Icon } from '../components/Icon';

export function Config() {
  const { state, irPara, sync, logout } = useApp();

  return (
    <section className="view active">
      <header className="top-header centered">
        <span onClick={() => irPara('inicio')} style={{ cursor: 'pointer', display: 'inline-flex' }}>
          <Icon name="ph-arrow-left" size={24} color="var(--text-primary)" />
        </span>
        <h1>Configurações</h1>
      </header>

      <p className="settings-label">Status da Conexão</p>
      <section className="card">
        <div className="status-connected">
          <Icon name="ph-broadcast" size={22} color="var(--primary)" />
          <span>Conectado ao PDV</span>
        </div>
        <p className="alert-detail">Banco: {conexao.banco}</p>
        <p className="lote-meta">
          Última sync: {state.sincronizado ? 'hoje às 09:41' : conexao.ultimaSync}
        </p>
      </section>

      <p className="settings-label">Credenciais do PDV</p>
      <section className="card">
        {conexao.credenciais.map((c) => (
          <div key={c.id} className="field">
            <label>{c.label}</label>
            <div className="control">
              <input defaultValue={c.valor} />
              {c.senha ? <Icon name="ph-eye-slash" size={18} color="var(--text-secondary)" /> : null}
            </div>
          </div>
        ))}
      </section>

      <div className="btn-stack">
        <button className="btn-outline">
          <Icon name="ph-plugs-connected" size={18} />
          Testar Conexão
        </button>
        <button className="btn-primary">
          <Icon name="ph-floppy-disk" size={18} />
          Salvar Configurações
        </button>
        <button className="btn-ghost" onClick={sync}>
          <Icon name="ph-lightning" size={18} />
          Forçar Sincronização Agora
        </button>
      </div>

      <p className="settings-label">Perfil &amp; Restaurante</p>
      <section className="card">
        <div className="profile-row">
          <div className="info">
            <div className="name-row">
              <span className="name">{perfil.nome}</span>
              <span className="role">{perfil.cargo}</span>
            </div>
            <p className="lote-meta">{perfil.restaurante}</p>
          </div>
          <button className="btn-danger" onClick={logout}>
            Sair
          </button>
        </div>
      </section>
    </section>
  );
}
