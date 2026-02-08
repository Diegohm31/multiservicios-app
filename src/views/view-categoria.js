import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { authService } from '../services/auth-service.js';

export class ViewCategoria extends LitElement {
  static properties = {
    id_padre: { type: String },
    nombre_categoria: { type: String },
    opciones: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    h1 {
      margin: 0;
      color: #333;
    }
    .btn-create {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .btn-create:hover {
      background-color: #0056b3;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
    }
    .card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .card-body {
      padding: 15px;
    }
    .card-title {
      font-size: 1.25em;
      margin: 0 0 10px;
      font-weight: bold;
    }
    .card-price {
      color: #28a745;
      font-weight: bold;
      font-size: 1.1em;
      margin-bottom: 10px;
    }
    .card-desc {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 15px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn {
      padding: 5px 10px;
      border-radius: 4px;
      text-decoration: none;
      cursor: pointer;
      border: none;
      font-size: 0.9em;
    }
    .btn-edit {
      background-color: #ffc107;
      color: #333;
    }
    .btn-delete {
      background-color: #dc3545;
      color: white;
    }
  `;

  constructor() {
    super();
    this.opciones = [];
    this.id_padre = '';
    this.nombre_categoria = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadOpcionesHijas();
  }

  updated(changedProperties) {
    if (changedProperties.has('id_padre') && this.id_padre) {
      this.loadOpcionesHijas();
    }
  }

  async loadOpcionesHijas() {
    this.opciones = await authService.getOpcionesHijas(this.id_padre);
  }

  render() {
    return html`      
      <div class="grid">
        ${this.opciones.map(opcion => html`
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">${opcion.nombre}</h2>
              <div class="actions">
                <button class="btn btn-edit" @click=${(e) => { e.preventDefault(); navigator.goto(`/${opcion.ruta}`); }}>Seleccionar</button>
              </div>
            </div>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('view-categoria', ViewCategoria);
