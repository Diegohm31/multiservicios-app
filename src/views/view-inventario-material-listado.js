import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { materialesService } from '../services/materiales-service.js';

export class ViewInventarioMaterialListado extends LitElement {
    static properties = {
        materiales: { type: Array },
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

    /* estilos bonitos para el contenido de los cards */

    .card-body {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .card-body .card-title {
      font-size: 1.25em;
      margin: 0 0 10px;
      font-weight: bold;
    }

    .card-body .card-price {
      color: #28a745;
      font-weight: bold;
      font-size: 1.1em;
      margin-bottom: 10px;
    }

    .card-body .card-desc {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 15px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-body .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .card-body .btn {
      padding: 5px 10px;
      border-radius: 4px;
      text-decoration: none;
      cursor: pointer;
      border: none;
      font-size: 0.9em;
    }

    .card-body .btn-edit {
      background-color: #ffc107;
      color: #333;
    }
  `;

    constructor() {
        super();
        this.materiales = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadMateriales();
    }

    async loadMateriales() {
        this.materiales = await materialesService.getMateriales();
    }

    render() {
        return html`
      <div class="header">
        <h1>Materiales</h1>
      </div>
      
      <div class="grid">
        ${this.materiales.map(material => html`
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">${material.nombre}</h2>
              <div class="card-desc">${material.descripcion}</div>
              <div class="card-unidad_medida">unidad_medida: ${material.unidad_medida}</div>
              <div class="card-stock_actual">stock_actual: ${material.stock_actual} unidades</div>
              <div class="card-stock_minimo">stock_minimo: ${material.stock_minimo} unidades</div>
              <div class="card-precio_unitario card-price">${material.precio_unitario} $/und</div>
              <!-- acciones para editar -->
              <div class="actions">
                <button class="btn btn-edit" @click=${(e) => { e.preventDefault(); navigator.goto(`/inventario/edit/material/${material.id_material}`); }}>Editar</button>
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

customElements.define('view-inventario-material-listado', ViewInventarioMaterialListado);
