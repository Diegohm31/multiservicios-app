import { LitElement, html, css } from 'lit';
import { authService } from '../services/auth-service.js';
import { navigator } from '../utils/navigator.js';

export class ViewAuthNewPassword extends LitElement {

    static properties = {
        email: { type: String },
        codigo: { type: String },
        password: { type: String },
        error: { type: String },
        loading: { type: Boolean },
        resending: { type: Boolean },
        codeVerified: { type: Boolean } // Nuevo estado para controlar qué mostrar
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
            await authService.forgotPassword(this.email);
            alert('Se ha enviado un nuevo código a su correo electrónico.');
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
            await authService.resetPassword(this.email, this.password);
            alert('¡Contraseña actualizada con éxito!');
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
              <input type="password" name="password" @input=${this.handleInput} required placeholder="Ingrese su nueva contraseña">
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
