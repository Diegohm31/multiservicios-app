import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { especialidadesService } from '../services/especialidades-service.js';

export class ViewEspecialidadesListado extends LitElement {
  static properties = {
    especialidades: { type: Array },
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
    .card-cantidad {
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
    this.especialidades = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEspecialidades();
  }

  async loadEspecialidades() {
    this.especialidades = await especialidadesService.getEspecialidades();
  }

  async deleteEspecialidad(id_especialidad) {
    await especialidadesService.deleteEspecialidad(id_especialidad);
    this.loadEspecialidades();
  }

  render() {
    return html`
      <div class="header">
        <h1>Especialidades</h1>
      </div>
      
      <div class="grid">
        ${this.especialidades.map(especialidad => html`
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">${especialidad.nombre}</h2>
              <div class="card-nivel">nivel: ${especialidad.nivel}</div>
              <div class="card-tarifa">${especialidad.tarifa_hora} $/hora</div>
              <div class="card-cantidad">cantidad: ${especialidad.cantidad} empleados</div>
              <!-- acciones para editar y eliminar -->
              <div class="actions">
                <button class="btn btn-edit" @click=${(e) => { e.preventDefault(); navigator.goto(`/especialidades/edit/${especialidad.id_especialidad}`); }}>Editar</button>
                <button class="btn btn-delete" @click=${(e) => { e.preventDefault(); this.deleteEspecialidad(especialidad.id_especialidad); }}>Eliminar</button>
              </div>
            </div>
          </div>
        `)}
      </div>

      <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
        <!--<button class="btn" style="background-color: #6c757d; color: white;" @click=${() => window.history.back()}>Volver</button>-->
        <button class="btn" style="background-color: #6c757d; color: white;" @click=${() => navigator.goto('/categoria/00002')}>Volver</button>
      </div>
    `;
  }
}

customElements.define('view-especialidades-listado', ViewEspecialidadesListado);
