import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { movimientosService } from '../services/movimientos-service.js';
import { materialesService } from '../services/materiales-service.js';
import { usuariosService } from '../services/usuarios-service.js';

export class ViewInventarioMovimientoListado extends LitElement {
  static properties = {
    movimientos: { type: Array },
    materiales: { type: Array },
    admins: { type: Array },
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

    /* estilos bonitos para la tabla */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th,td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
    }

    th {
      background-color: #f2f2f2;
    }
  `;

  constructor() {
    super();
    this.movimientos = [];
    this.materiales = [];
    this.admins = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadMovimientos();
    this.loadMateriales();
    this.loadAdmins();
  }

  async loadMovimientos() {
    this.movimientos = await movimientosService.getMovimientos();
  }

  async loadMateriales() {
    this.materiales = await materialesService.getMateriales();
  }

  async loadAdmins() {
    this.admins = await usuariosService.getAdmins();
  }

  render() {
    return html`
      <div class="header">
        <h1>Movimientos</h1>
      </div>

      <!-- generar tabla -->
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Administrador</th>
            <th>Fecha</th>
            <th>Material</th>
            <th>Cantidad</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          ${this.movimientos.map(movimiento => html`
            <tr>
              <td>${movimiento.id_movimiento_material}</td>
              <td>${this.admins.find(admin => admin.id_admin == movimiento.id_admin)?.nombre}</td>
              <td>${movimiento.fecha_movimiento}</td>
              <td>${this.materiales.find(material => material.id_material == movimiento.id_material)?.nombre}</td>
              <td>${movimiento.cantidad}</td>
              <!-- en caso de ser una entrada mostrar el texto tipo_movimiento de color verde, en caso de una salida de color rojo -->
              <td style="color: ${movimiento.tipo_movimiento === 'entrada' ? 'green' : 'red'}">${movimiento.tipo_movimiento}</td>
            </tr>
          `)}
        </tbody>
      </table>
      
      <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
        <!--<button class="btn" style="background-color: #6c757d; color: white;" @click=${() => window.history.back()}>Volver</button>-->
        <button class="btn" style="background-color: #6c757d; color: white;" @click=${() => navigator.goto('/categoria/00008')}>Volver</button>
      </div>
    `;
  }
}

customElements.define('view-inventario-movimiento-listado', ViewInventarioMovimientoListado);
