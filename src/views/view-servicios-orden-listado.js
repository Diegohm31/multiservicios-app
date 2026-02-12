import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { serviciosService } from '../services/servicios-service.js';

export class ViewServiciosOrdenListado extends LitElement {
  static properties = {
    id_rol: { type: String },
    ordenes: { type: Array },
    filteredOrdenes: { type: Array },
    filters: { type: Object }
  };

  static styles = css`
    :host {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --text: #1e293b;
      --text-light: #64748b;
      --border: #e2e8f0;
      --bg: #ffffff;
      
      display: block;
      padding: 2rem;
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--text);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      font-size: 1.875rem;
      font-weight: 800;
      letter-spacing: -0.025em;
    }

    /* Filters Panel */
    .filters-panel {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid var(--border);
      margin-bottom: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-light);
      letter-spacing: 0.05em;
    }

    input, select {
      width: 100%;
      padding: 0.625rem 0.875rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 0.9rem;
      background-color: #ffffff;
      color: var(--text);
      transition: all 0.2s;
      font-family: inherit;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .input-error {
      border-color: #ef4444 !important;
    }
    .input-error:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    .error-msg {
      color: #ef4444;
      font-size: 0.75rem;
      font-weight: 600;
      grid-column: 1 / -1;
      margin-top: -0.75rem;
    }

    /* Fix calendar icon visibility */
    input[type="date"] {
      position: relative;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: calc(100% - 12px) center;
      background-size: 18px;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      color: transparent;
      cursor: pointer;
    }

    /* Table Styles */
    .table-container {
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }

    th {
      background-color: #f1f5f9;
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover {
      background-color: #f8fafc;
    }

    /* Status Badge */
    .status-badge {
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-pendiente { background: #fef3c7; color: #92400e; }
    .status-aceptada { background: #dcfce7; color: #166534; }
    .status-presupuestada { background: #f3e8ff; color: #6b21a8; }
    .status-en-proceso, .status-en_proceso { background: #e0f2fe; color: #075985; }
    .status-completada { background: #dcfce7; color: #15803d; }
    .status-cancelada { background: #fee2e2; color: #991b1b; }
    .status-en_espera { background: #e0f2fe; color: #075985; }
    .status-por-pagar { background: #ffedd5; color: #c2410c; }
    .status-verificando_pago { background: #e0e7ff; color: #3730a3; }

    /* Buttons */
    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.5rem 0.875rem;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn-delete {
      background-color: #fee2e2;
      color: #dc2626;
    }
    .btn-delete:hover {
      background-color: #ef4444;
      color: white;
    }

    .btn-info {
      background-color: #e0f2fe;
      color: #0284c7;
    }
    .btn-info:hover {
      background-color: #0ea5e9;
      color: white;
    }

    .btn-success {
      background-color: #dcfce7;
      color: #166534;
    }
    .btn-success:hover {
      background-color: #22c55e;
      color: white;
    }

    .btn-purple {
      background-color: #f3e8ff;
      color: #6b21a8;
    }
    .btn-purple:hover {
      background-color: #9333ea;
      color: white;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--text);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }

    .btn-back:hover {
      background: #000;
      transform: translateX(-4px);
    }
  `;

  constructor() {
    super();
    this.id_rol = '';
    this.ordenes = [];
    this.filteredOrdenes = [];
    this.filters = {
      direccion: '',
      estado: '',
      fecha_inicio: '',
      fecha_fin: ''
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadOrdenes();
  }

  async loadOrdenes() {
    const data = await serviciosService.getOrdenes();
    if (data) {
      this.ordenes = data.ordenes;
      this.id_rol = data.id_rol;
      this.applyFilters();
    }
  }

  async cancelarOrden(id) {
    if (confirm('¿Está seguro de que desea cancelar la orden?')) {
      await serviciosService.cancelarOrden(id);
      this.loadOrdenes();
    }
  }

  verDetallesOrden(id) {
    navigator.goto(`/servicios/orden/detalles/${id}`);
  }

  realizarPresupuesto(id) {
    navigator.goto(`/servicios/orden/presupuesto/${id}`);
  }

  pagarOrden(id) {
    navigator.goto(`/servicios/orden/pago/${id}`);
  }

  handleFilterChange(e) {
    const { id, value } = e.target;
    const filterKey = id.replace('filtro-', '').replace('-', '_');
    this.filters = { ...this.filters, [filterKey]: value };
    this.applyFilters();
  }

  isDateRangeInvalid() {
    if (!this.filters.fecha_inicio || !this.filters.fecha_fin) return false;
    return new Date(this.filters.fecha_fin) < new Date(this.filters.fecha_inicio);
  }

  applyFilters() {
    if (this.isDateRangeInvalid()) {
      this.filteredOrdenes = [];
      return;
    }
    this.filteredOrdenes = this.ordenes.filter(orden => {
      const matchDireccion = !this.filters.direccion ||
        orden.direccion.toLowerCase().includes(this.filters.direccion.toLowerCase());

      const matchEstado = !this.filters.estado ||
        orden.estado.toLowerCase() === this.filters.estado.toLowerCase();

      const matchInicio = !this.filters.fecha_inicio ||
        orden.fecha_emision >= this.filters.fecha_inicio;

      const matchFin = !this.filters.fecha_fin ||
        orden.fecha_emision <= this.filters.fecha_fin;

      const matchNombre = !this.filters.nombre ||
        orden.nombre.toLowerCase().includes(this.filters.nombre.toLowerCase());

      const matchCedula = !this.filters.cedula ||
        orden.cedula.toLowerCase().includes(this.filters.cedula.toLowerCase());

      return matchDireccion && matchEstado && matchInicio && matchFin && matchNombre && matchCedula;
    });
  }

  getStatusClass(status) {
    const s = status?.toLowerCase() || '';
    if (s.includes('pend')) return 'status-pendiente';
    if (s.includes('acept')) return 'status-aceptada';
    if (s.includes('presu')) return 'status-presupuestada';
    if (s.includes('proce') || s.includes('progr')) return 'status-en-proceso';
    if (s.includes('espera')) return 'status-en_espera';
    if (s.includes('comp')) return 'status-completada';
    if (s.includes('canc')) return 'status-cancelada';
    if (s.includes('pagar')) return 'status-por-pagar';
    if (s.includes('verificando')) return 'status-verificando_pago';
    return '';
  }

  canCancel(status) {
    const s = status?.toLowerCase() || '';
    // No se puede cancelar si ya está completada, cancelada o en proceso, o verificando pago
    if (s.includes('comp') || s.includes('canc') || s.includes('proce') || s.includes('progr') || s.includes('verificando')) {
      return false;
    }
    return true;
  }

  render() {
    return html`
      <div class="header">
        <h1>Ordenes</h1>
      </div>

      <div class="filters-panel">
        <div class="filter-group">
          <label for="filtro-direccion">Dirección</label>
          <input type="text" id="filtro-direccion" placeholder="Filtrar por dirección..." @input=${this.handleFilterChange}>
        </div>

        <div class="filter-group">
          <label for="filtro-estado">Estado</label>
          <select id="filtro-estado" @change=${this.handleFilterChange}>
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="aceptada">Aceptada</option>
            <option value="presupuestada">Presupuestada</option>
            <option value="en_proceso">En Proceso</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
            <option value="en_espera">En espera</option>
            <option value="verificando pago">Verificando Pago</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="filtro-fecha-inicio">Desde</label>
          <input type="date" id="filtro-fecha-inicio" @change=${this.handleFilterChange}>
        </div>

        <div class="filter-group">
          <label for="filtro-fecha-fin">Hasta</label>
          <input 
            type="date" 
            id="filtro-fecha-fin" 
            class="${this.isDateRangeInvalid() ? 'input-error' : ''}" 
            .min=${this.filters.fecha_inicio} 
            @change=${this.handleFilterChange}
          >
        </div>
        ${this.isDateRangeInvalid() ? html`<div class="error-msg">La fecha de fin no puede ser menor a la de inicio</div>` : ''}

        <!-- si es admin mostrar filtro por nombre y cedula de cliente-->
        ${this.id_rol === '00003' ? html`
          <div class="filter-group">
            <label for="filtro-nombre">Nombre</label>
            <input type="text" id="filtro-nombre" placeholder="Filtrar por nombre..." @input=${this.handleFilterChange}>
          </div>
          <div class="filter-group">
            <label for="filtro-cedula">Cedula</label>
            <input type="text" id="filtro-cedula" placeholder="Filtrar por cedula..." @input=${this.handleFilterChange}>
          </div>
        ` : ''}
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <!-- si es admin mostrar nombre y cedula de cliente-->
              ${this.id_rol === '00003' ? html`
                <th>Nombre</th>
                <th>Cedula</th>
              ` : ''}
              <th>Dirección</th>
              <th>Emisión</th>
              <th>Estado</th>
              <th style="text-align: center;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${this.filteredOrdenes.length === 0 ? html`<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-light);">No se encontraron órdenes</td></tr>` : ''}
            ${this.filteredOrdenes.map(orden => html`
              <tr>
                <td style="font-weight: 700;">#${orden.id_orden}</td>
                <!-- si es admin mostrar nombre y cedula de cliente-->
                ${this.id_rol === '00003' ? html`
                  <td>${orden.nombre}</td>
                  <td>${orden.cedula}</td>
                ` : ''}
                <td>${orden.direccion}</td>
                <td>${orden.fecha_emision}</td>
                <td>
                  <span class="status-badge ${this.getStatusClass(orden.estado)}">
                    ${orden.estado}
                  </span>
                </td>
                <td>
                  <div class="actions-cell" style="justify-content: flex-end;">
                    <button class="btn btn-info" @click=${() => this.verDetallesOrden(orden.id_orden)}>Detalles</button>
                    ${orden.estado?.toLowerCase() === 'aceptada' && this.id_rol === '00003' ? html`
                      <button class="btn btn-purple" @click=${() => this.realizarPresupuesto(orden.id_orden)}>Presupuestar</button>
                    ` : ''}
                    ${this.id_rol === '00001' && orden.estado?.toLowerCase().includes('pagar') ? html`
                      <button class="btn btn-success" @click=${() => this.pagarOrden(orden.id_orden)}>Pagar</button>
                    ` : ''}
                    ${this.canCancel(orden.estado) ? html`
                      <button class="btn btn-delete" @click=${() => this.cancelarOrden(orden.id_orden)}>Cancelar</button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 2.5rem; display: flex; justify-content: flex-end;">
        <button class="btn-back" @click=${() => navigator.goto('/categoria/00017')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
          Volver
        </button>
      </div>
    `;
  }

}

customElements.define('view-servicios-orden-listado', ViewServiciosOrdenListado);
