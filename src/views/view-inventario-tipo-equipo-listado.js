import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { tiposEquiposService } from '../services/tipos-equipos-service.js';

export class ViewInventarioTipoEquipoListado extends LitElement {
  static properties = {
    tipos_equipos: { type: Array },
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
    .card-nivel {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 15px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .card-tarifa {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 15px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;

  constructor() {
    super();
    this.tipos_equipos = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadTiposEquipos();
  }

  async loadTiposEquipos() {
    this.tipos_equipos = await tiposEquiposService.getTiposEquipos();
  }

  async deleteTipoEquipo(id_tipo_equipo) {
    await tiposEquiposService.deleteTipoEquipo(id_tipo_equipo);
    this.loadTiposEquipos();
  }

  render() {
    return html`
      <div class="header">
        <h1>Tipos de Equipos</h1>
      </div>
      
      <div class="grid">
        ${this.tipos_equipos.map(tipo_equipo => html`
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">${tipo_equipo.nombre}</h2>
              <div class="card-nivel">${tipo_equipo.costo_hora} $/hora</div>
              <div class="card-tarifa">stock actual: ${tipo_equipo.cantidad} ${tipo_equipo.cantidad > 1 ? 'unidades' : 'unidad'}</div>
              <!-- acciones para editar y eliminar -->
              <div class="actions">
                <button class="btn btn-edit" @click=${(e) => { e.preventDefault(); navigator.goto(`/inventario/edit/tipo_equipo/${tipo_equipo.id_tipo_equipo}`); }}>Editar</button>
                <button class="btn btn-delete" @click=${(e) => { e.preventDefault(); this.deleteTipoEquipo(tipo_equipo.id_tipo_equipo); }}>Eliminar</button>
              </div>
            </div>
          </div>
        `)}
      </div>

      <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
        <!--<button class="btn" style="background-color: #6c757d; color: white;" @click=${() => window.history.back()}>Volver</button>-->
        <button class="btn" style="background-color: #6c757d; color: white;" @click=${() => navigator.goto('/categoria/00008')}>Volver</button>
      </div>
    `;
  }
}

customElements.define('view-inventario-tipo-equipo-listado', ViewInventarioTipoEquipoListado);
