import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { tiposServiciosService } from '../services/tipos-servicios-service.js';

export class ViewServiciosTipoServicioListado extends LitElement {
  static properties = {
    tipos_servicios: { type: Array },
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
      color: #000000;
      background-color: #d4cfcf;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
    tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    tr:hover {
      background-color: #f1f1f1;
    }
  `;

  constructor() {
    super();
    this.tipos_servicios = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadTiposServicios();
  }

  async loadTiposServicios() {
    this.tipos_servicios = await tiposServiciosService.getTiposServicios();
  }

  render() {
    return html`
      <div class="header">
        <h1>Tipo de Servicio</h1>
      </div>
      
      <!-- generar tabla con los tipos de servicio -->
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${this.tipos_servicios.map(tipo_servicio => html`
            <tr>
              <td>${tipo_servicio.nombre}</td>
              <td>${tipo_servicio.descripcion}</td>
              <td>
                <button class="btn btn-edit" @click=${(e) => { e.preventDefault(); navigator.goto(`/servicios/edit/tipo_servicio/${tipo_servicio.id_tipo_servicio}`); }}>Editar</button>
              </td>
            </tr>
          `)}
        </tbody>
      </table>

      <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
        <!--<button class="btn" style="background-color: #6c757d; color: white;" @click=${() => window.history.back()}>Volver</button>-->
        <button class="btn" style="background-color: #6c757d; color: white;" @click=${() => navigator.goto('/categoria/00017')}>Volver</button>
      </div>
    `;
  }
}

customElements.define('view-servicios-tipo-servicio-listado', ViewServiciosTipoServicioListado);
