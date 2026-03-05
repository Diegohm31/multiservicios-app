import { LitElement, html, css } from 'lit';
import { authService } from '../services/auth-service.js';
import { navigator } from '../utils/navigator.js';
import { popupService } from '../utils/popup-service.js';

export class ViewAuthLogin extends LitElement {

  static properties = {
    error: { type: String },
    showPassword: { type: Boolean }
  };

  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      background-color: #f4f6f9;
    }
    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 8px;
      color: #555;
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 12px;
      color: #94a3b8;
      pointer-events: none;
      top: 50%;
      transform: translateY(-50%);
    }
    .password-toggle {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      padding: 0;
      color: #94a3b8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
      width: auto;
      top: 50%;
      transform: translateY(-50%);
    }
    .password-toggle:hover {
      color: #3b82f6;
    }
    .password-toggle svg {
      width: 20px;
      height: 20px;
    }
    input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 16px;
      background-color: #ffffff !important;
      color: #000000 !important;
      transition: all 0.2s;
      padding-left: 40px;
    }
    input[name="password"] {
      padding-right: 40px;
    }
    input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
    button[type="submit"] {
      width: 100%;
      padding: 12px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
    }
    button[type="submit"]:hover {
      background: #0056b3;
    }
    .links {
      margin-top: 20px;
      text-align: center;
      font-size: 0.9em;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
  `;

  constructor() {
    super();
    this.email = '';
    this.password = '';
    this.showPassword = false;
  }

  handleInput(e) {
    this[e.target.name] = e.target.value;
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      let response = await authService.login(this.email, this.password);
      // Redirigir al CRUD
      // AVISAR A LA APP que el usuario entró (Evento burbujeante)
      if (response == true) {
        this.dispatchEvent(new CustomEvent('user-logged-in', {
          bubbles: true,
          composed: true
        }));
        navigator.goto('/categoria/00007');
      } else {
        this.error = 'Usuario o contraseña incorrectos';
      }
    } catch (error) {
      popupService.warning('Error', 'Error al iniciar sesión');
    }
  }

  render() {
    return html`
      <div class="auth-card">
        <h2>Iniciar Sesión</h2>

        <form @submit=${this.handleSubmit}>
          <div class="form-group">
            <label>Email</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              <input type="email" name="email" @input=${this.handleInput} required placeholder="">
            </div>
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input type="${this.showPassword ? 'text' : 'password'}" name="password" @input=${this.handleInput} required>
              <button type="button" class="password-toggle" @click=${() => this.showPassword = !this.showPassword} tabindex="-1">
                ${this.showPassword ? html`
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ` : html`
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                `}
              </button>
            </div>
          </div>
          <button type="submit">Entrar</button>
        </form>
        <div class="links">
          ¿No tienes cuenta? <a href="#" @click = ${() => navigator.goto('/register')}>Regístrate aquí</a>
          <br><br>
          <a href="#" @click = ${() => navigator.goto('/olvide_password')}>¿Olvidaste tu contraseña?</a>

        </div>
        ${this.error ? html`<p style="color: red;">${this.error}</p>` : ''}
      </div>
    `;
  }
}

customElements.define('view-auth-login', ViewAuthLogin);
