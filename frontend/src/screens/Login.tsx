/* Tela 0 — Login */
import { perfil } from '../data';
import { useApp } from '../AppContext';
import { Icon } from '../components/Icon';

export function Login() {
  const { state, login, toggleSenha } = useApp();

  return (
    <section id="login" className="view active">
      <div className="brand">
        <h1>LucroPlus</h1>
        <Icon name="ph-trend-up" size={26} />
      </div>
      <p className="tagline">
        Gestão inteligente do
        <br />
        seu restaurante
      </p>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <div className="control">
            <Icon name="ph-envelope-simple" size={18} />
            <input type="email" placeholder={perfil.email} />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <Icon name="ph-lock-simple" size={18} />
            <input type={state.senhaVisivel ? 'text' : 'password'} defaultValue="senha12345" />
            <span onClick={toggleSenha} style={{ cursor: 'pointer', display: 'inline-flex' }}>
              <Icon name={state.senhaVisivel ? 'ph-eye' : 'ph-eye-slash'} size={18} />
            </span>
          </div>
        </div>
        <button className="btn-primary" onClick={login}>
          Entrar
        </button>
      </form>
      <div className="biometria" onClick={login}>
        <Icon name="ph-fingerprint" size={18} />
        Usar biometria
      </div>
    </section>
  );
}
