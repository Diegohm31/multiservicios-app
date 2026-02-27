import { LitElement, html, css } from 'lit';
import { authService } from '../services/auth-service.js';
import { navigator } from '../utils/navigator.js';
import { popupService } from '../utils/popup-service.js';

export class ViewAuthOlvidePassword extends LitElement {

  static properties = {
    error: { type: String },
    loading: { type: Boolean }
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
      background-color: #ffffff;
      color: #000000;
      transition: all 0.2s;
    }
    input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
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
    button:hover {
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
    this.loading = false;
  }

  handleInput(e) {
    this[e.target.name] = e.target.value;
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.loading = true;
    this.error = '';
    try {
      await authService.forgotPassword(this.email);
      popupService.success('Email Enviado', 'Se ha enviado un código de verificación a su correo electrónico.');
      navigator.goto(`/new_password/${this.email}`);
    } catch (error) {
      this.error = error.message || 'Error al procesar la solicitud.';
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="auth-card">
        <h2>Recuperar Contraseña</h2>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">
          Ingrese su correo electrónico y le enviaremos un código para restablecer su contraseña.
        </p>

        <form @submit=${this.handleSubmit}>
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" @input=${this.handleInput} required placeholder="tu@email.com">
          </div>
          
          <button type="submit" ?disabled=${this.loading}>
            ${this.loading ? 'Enviando...' : 'Enviar Código'}
          </button>
        </form>
        <div class="links">
          <a href="#" @click = ${() => navigator.goto('/login')}>Volver al Login</a>
        </div>
        ${this.error ? html`<p style="color: red; text-align: center; margin-top: 15px;">${this.error}</p>` : ''}
      </div>
    `;
  }
}

customElements.define('view-auth-olvide-password', ViewAuthOlvidePassword);
