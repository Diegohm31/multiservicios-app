import { LitElement, html, css } from 'lit';
import { authService } from '../services/auth-service.js';
import { navigator } from '../utils/navigator.js';
import { popupService } from '../utils/popup-service.js';

export class ViewAuthNewPassword extends LitElement {

  static properties = {
    email: { type: String },
    codigo: { type: String },
    password: { type: String },
    error: { type: String },
    loading: { type: Boolean },
    resending: { type: Boolean },
    codeVerified: { type: Boolean }, // Nuevo estado para controlar qué mostrar
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
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      color: #555;
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
    }
    input::placeholder {
      color: #94a3b8;
    }
    input:focus {
      outline: none;
      border-color: #3b82f6;
      background-color: #ffffff !important;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    button {
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
    button:disabled {
      background: #ccc;
    }
    .links {
      margin-top: 20px;
      text-align: center;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
    .success-badge {
      background: #dcfce7;
      color: #166534;
      padding: 10px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
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
      padding-right: 40px !important;
    }
  `;

  constructor() {
    super();
    this.email = '';
    this.codigo = '';
    this.password = '';
    this.loading = false;
    this.resending = false;
    this.error = '';
    this.codeVerified = false;
    this.showPassword = false;
  }

  handleInput(e) {
    this[e.target.name] = e.target.value;
  }

  async handleVerifyCode(e) {
    e.preventDefault();
    this.loading = true;
    this.error = '';
    try {
      this.codeVerified = await authService.verifyCode(this.email, this.codigo);
    } catch (error) {
      this.error = error.message || 'Código incorrecto. Intente de nuevo.';
    } finally {
      this.loading = false;
    }
  }

  async handleResendCode(e) {
    e.preventDefault();
    this.resending = true; // Usar resending en lugar de loading
    this.error = '';
    try {
      popupService.sendingEmail();
      await authService.forgotPassword(this.email);
      popupService.hide();
      popupService.success('Código Enviado', 'Se ha enviado un nuevo código a su correo electrónico.');
    } catch (error) {
      this.error = error.message || 'Error al solicitar un nuevo código.';
    } finally {
      this.resending = false;
    }
  }

  async handleSubmitReset(e) {
    e.preventDefault();
    this.loading = true;
    this.error = '';
    try {
      popupService.sendingEmail();
      await authService.resetPassword(this.email, this.password);
      popupService.hide();
      popupService.success('Éxito', '¡Contraseña actualizada con éxito!');
      navigator.goto('/login');
    } catch (error) {
      this.error = error.message || 'Error al restablecer contraseña.';
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="auth-card">
        <h2>${this.codeVerified ? 'Nueva Contraseña' : 'Verificar Código'}</h2>
        
        ${this.codeVerified ? html`
          <div class="success-badge">
            ✓ Código verificado correctamente
          </div>
          <p style="text-align: center; color: #666; margin-bottom: 20px;">
            Ahora puede ingresar su nueva contraseña para <strong>${this.email}</strong>.
          </p>
          <form @submit=${this.handleSubmitReset}>
            <div class="form-group">
              <label>Nueva Contraseña</label>
              <div class="input-wrapper">
                <input type="${this.showPassword ? 'text' : 'password'}" name="password" @input=${this.handleInput} required placeholder="Ingrese su nueva contraseña">
                <button type="button" class="password-toggle" @click=${() => this.showPassword = !this.showPassword} tabindex="-1">
                  ${this.showPassword ? html`
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ` : html`
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  `}
                </button>
              </div>
            </div>
            <button type="submit" ?disabled=${this.loading}>
              ${this.loading ? 'Actualizando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        ` : html`
          <p style="text-align: center; color: #666; margin-bottom: 20px;">
            Ingresa el código enviado a <strong>${this.email}</strong>.
          </p>
          <form @submit=${this.handleVerifyCode}>
            <div class="form-group">
              <label>Código de Verificación</label>
              <input type="text" name="codigo" @input=${this.handleInput} required placeholder="Ingrese el código enviado">
            </div>
            <button type="submit" ?disabled=${this.loading}>
              ${this.loading ? 'Verificando...' : 'Verificar Código'}
            </button>
          </form>
        `}

        <div class="links">
          <a href="#" @click = ${this.handleResendCode} ?disabled=${this.resending || this.loading}>
            ${this.resending ? 'Enviando...' : 'Solicitar nuevo código'}
          </a>
        </div>
        ${this.error ? html`<p style="color: red; text-align: center; margin-top: 15px;">${this.error}</p>` : ''}
      </div>
    `;
  }
}

customElements.define('view-auth-new-password', ViewAuthNewPassword);
