import { LitElement, html, css } from 'lit';
import { authService } from '../services/auth-service.js';
import { navigator } from '../utils/navigator.js';
import { popupService } from '../utils/popup-service.js';

export class ViewAuthLogin extends LitElement {

  static properties = {
    error: { type: String }
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
            <input type="email" name="email" @input=${this.handleInput} required>
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" name="password" @input=${this.handleInput} required>
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
