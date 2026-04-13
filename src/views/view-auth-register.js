import { LitElement, html, css } from 'lit';
import { authService } from '../services/auth-service.js';
import { navigator } from '../utils/navigator.js';
import { popupService } from '../utils/popup-service.js';
import '../components/address-map.js';

export class ViewAuthRegister extends LitElement {
  static properties = {
    showPassword: { type: Boolean },
    direccion: { type: String }
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
      margin: 4rem 0;
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.75rem;
      color: #334155;
      font-weight: 600;
      font-size: 0.9rem;
    }
    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
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
    input, textarea {
      width: 100%;
      padding: 12px 16px;
      padding-left: 40px;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      box-sizing: border-box;
      font-size: 16px;
      background-color: #ffffff !important;
      color: #000000 !important;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
      resize: none;
    }
    input[name="password"] {
      padding-right: 40px;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #3b82f6;
      background-color: #ffffff;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }
    textarea {
      min-height: 100px;
      line-height: 1.5;
      padding-left: 16px; /* textareas don't need icons usually but if they did we'd adjust */
    }
    textarea::-webkit-scrollbar { width: 8px; }
    textarea::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
    textarea::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid #f1f5f9; }
    textarea::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    button[type="submit"] {
      width: 100%;
      padding: 12px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
    }
    button[type="submit"]:hover {
      background: #218838;
      transform: translateY(-1px);
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
    this.name = '';
    this.email = '';
    this.password = '';
    this.cedula = '';
    this.telefono = '';
    this.direccion = '';
    this.showPassword = false;
  }

  handleInput(e) {
    this[e.target.name] = e.target.value;
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {

      if (!this.name || !this.email || !this.password || !this.cedula || !this.telefono || !this.direccion) {
        popupService.info('Campo Falante', 'Por favor, completa todos los campos.');
        return;
      }

      let $user = {
        name: this.name,
        email: this.email,
        password: this.password,
        cedula: this.cedula,
        telefono: this.telefono,
        direccion: this.direccion
      };

      popupService.sendingEmail();
      let response = await authService.register($user);
      popupService.hide();

      if (response) {
        popupService.success('Registro Exitoso', 'Registro exitoso. Por favor inicia sesión.');
        navigator.goto('/login');
      }
    } catch (error) {
      popupService.warning('Error', 'Error en el registro');
    }
  }

  render() {
    return html`
      <div class="auth-card">
        <h2>Registro de Cliente</h2>
        <form @submit=${this.handleSubmit}>
          <div class="form-group">
            <label>Nombre Completo</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input type="text" name="name" @input=${this.handleInput} required>
            </div>
          </div>
          <div class="form-group">
            <label>Email</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              <input type="email" name="email" @input=${this.handleInput} required>
            </div>
          </div>
          <div class="form-group">
            <label>Cédula</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="12" y2="16"/>
              </svg>
              <input type="text" name="cedula" @input=${this.handleInput} required>
            </div>
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <input type="text" name="telefono" @input=${this.handleInput} required>
            </div>
          </div>
          <div class="form-group">
            <label>Dirección</label>
            <div class="input-wrapper" style="margin-bottom: 8px;">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <input type="text" name="direccion" .value=${this.direccion} @input=${this.handleInput} required>
            </div>
            <address-map @address-changed=${(e) => { this.direccion = e.detail.address; this.requestUpdate(); }}></address-map>
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
          <button type="submit">Registrarse</button>
        </form>
        <div class="links">
          ¿Ya tienes cuenta? <a href="/login">Inicia Sesión</a>
        </div>
      </div>
    `;
  }
}

customElements.define('view-auth-register', ViewAuthRegister);
