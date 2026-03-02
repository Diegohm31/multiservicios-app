import { LitElement, html, css } from 'lit';
import { authService } from '../services/auth-service.js';
import { navigator } from '../utils/navigator.js';
import { popupService } from '../utils/popup-service.js';
import '../components/address-map.js';

export class ViewAuthRegister extends LitElement {
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
    input, textarea {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      box-sizing: border-box;
      font-size: 16px;
      background-color: #f8fafc;
      color: #1e293b;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
      resize: none;
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
    }
    textarea::-webkit-scrollbar { width: 8px; }
    textarea::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
    textarea::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid #f1f5f9; }
    textarea::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    button {
      width: 100%;
      padding: 12px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
    }
    button:hover {
      background: #218838;
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

      let response = await authService.register($user);

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
            <input type="text" name="name" @input=${this.handleInput} required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" @input=${this.handleInput} required>
          </div>
          <div class="form-group">
            <label>Cedula</label>
            <input type="text" name="cedula" @input=${this.handleInput} required>
          </div>
          <div class="form-group">
            <label>Telefono</label>
            <input type="text" name="telefono" @input=${this.handleInput} required>
          </div>
          <div class="form-group">
            <label>Direccion</label>
            <input type="text" name="direccion" .value=${this.direccion} @input=${this.handleInput} required>
            <address-map @address-changed=${(e) => { this.direccion = e.detail.address; this.requestUpdate(); }}></address-map>
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" name="password" @input=${this.handleInput} required>
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
