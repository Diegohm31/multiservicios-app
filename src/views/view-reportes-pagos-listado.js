import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { serviciosService } from '../services/servicios-service.js';

export class ViewReportesPagosListado extends LitElement {
    static properties = {
        reportes: { type: Array },
        filteredReportes: { type: Array },
        filters: { type: Object }
    };

    static styles = css`
    :host {
      --success: #22c55e;
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

    .status-badge {
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-pendiente { background: #fef3c7; color: #92400e; }
    .status-aceptado { background: #dcfce7; color: #166534; }
    .status-cancelado { background: #fee2e2; color: #991b1b; }

    .btn {
      padding: 0.5rem 0.875rem;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn-info {
        background-color: #e0f2fe;
        color: #0284c7;
    }
    .btn-info:hover {
        background-color: #0ea5e9;
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
        this.reportes = [];
        this.filteredReportes = [];
        this.filters = {
            id_orden: '',
            plan_membresia_nombre: '',
            estado: '',
            fecha_inicio: '',
            fecha_fin: '',
            // metodo_pago: '' // Removed as requested to remove column, though filter could stay, user said "quita las columnas metodo de pago y referencia". I'll keep filter if useful, but maybe remove it to cleanup? User said "agrega el input para filtrar por id_plan_membresia". I'll keep method filter for now as it wasn't explicitly asked to be removed from filters, only columns.
            metodo_pago: ''
        };
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadReportes();
    }

    async loadReportes() {
        try {
            const reportes = await serviciosService.getReportesPagos();

            if (reportes) {
                this.reportes = Array.isArray(reportes) ? reportes : [];
                this.applyFilters();
            }
        } catch (error) {
            console.error('Error loading reportes:', error);
        }
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
            this.filteredReportes = [];
            return;
        }

        this.filteredReportes = this.reportes.filter(reporte => {
            const matchOrden = !this.filters.id_orden ||
                (reporte.id_orden && reporte.id_orden.toString().includes(this.filters.id_orden));

            const matchPlan = !this.filters.plan_membresia_nombre ||
                (reporte.plan_membresia_nombre && reporte.plan_membresia_nombre.toLowerCase().includes(this.filters.plan_membresia_nombre.toLowerCase()));

            const matchEstado = !this.filters.estado ||
                (reporte.estado && reporte.estado.toLowerCase() === this.filters.estado.toLowerCase());

            const matchMetodo = !this.filters.metodo_pago ||
                (reporte.metodo_pago && reporte.metodo_pago.toLowerCase().includes(this.filters.metodo_pago.toLowerCase()));

            const matchInicio = !this.filters.fecha_inicio ||
                reporte.fecha_emision >= this.filters.fecha_inicio;

            const matchFin = !this.filters.fecha_fin ||
                reporte.fecha_emision <= this.filters.fecha_fin;

            return matchOrden && matchPlan && matchEstado && matchMetodo && matchInicio && matchFin;
        });
    }

    getStatusClass(status) {
        const s = status?.toLowerCase() || '';
        if (s.includes('pend')) return 'status-pendiente';
        if (s.includes('aprob') || s.includes('acept')) return 'status-aceptado';
        if (s.includes('rechaz') || s.includes('cancel')) return 'status-cancelado';
        return '';
    }

    verDetalles(id) {
        navigator.goto(`/reportes-pagos/detalles/${id}`);
    }

    render() {
        return html`
      <div class="header">
        <h1>Reportes de Pagos</h1>
      </div>

      <div class="filters-panel">
        <div class="filter-group">
          <label for="filtro-id-orden">ID Orden</label>
          <input type="text" id="filtro-id-orden" placeholder="Buscar por ID Orden..." @input=${this.handleFilterChange}>
        </div>

        <div class="filter-group">
          <label for="filtro-plan-membresia-nombre">Nombre del Plan</label>
          <input type="text" id="filtro-plan-membresia-nombre" placeholder="Buscar por nombre del plan..." @input=${this.handleFilterChange}>
        </div>

        <div class="filter-group">
          <label for="filtro-estado">Estado</label>
          <select id="filtro-estado" @change=${this.handleFilterChange}>
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aceptado">Aceptado</option>
            <option value="Cancelado">Cancelado</option>
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
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID Reporte</th>
              <th>ID Orden</th>
              <th>Plan</th>
              <th>Cliente</th>
              <th>Cédula</th>
              <th>Admin</th>
              <th>Monto</th>
              <th>Fecha de Emisión</th>
              <th>Estado</th>
              <th style="text-align: center;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${this.filteredReportes.length === 0 ? html`<tr><td colspan="10" style="text-align: center; padding: 2rem; color: var(--text-light);">No se encontraron reportes</td></tr>` : ''}
            ${this.filteredReportes.map(reporte => html`
              <tr>
                <td style="font-weight: 700;">#${reporte.id_reporte_pago}</td>
                <td>${reporte.id_orden || 'N/A'}</td>
                <td>${reporte.plan_membresia_nombre || 'N/A'}</td>
                <td>${reporte.cliente_nombre || 'N/A'}</td>
                <td>${reporte.cliente_cedula || 'N/A'}</td>
                <td style="font-style: italic; color: ${reporte.admin_nombre ? 'var(--text)' : 'var(--text-light)'};">
                  ${reporte.admin_nombre || 'Pendiente de validación'}
                </td>
                <td style="font-weight: 700; color: var(--success);">$${parseFloat(reporte.monto).toFixed(2)}</td>
                <td>${reporte.fecha_emision}</td>
                <td>
                  <span class="status-badge ${this.getStatusClass(reporte.estado)}">
                    ${reporte.estado}
                  </span>
                </td>
                <td>
                  <div style="display: flex; justify-content: center;">
                    <button class="btn btn-info" @click=${() => this.verDetalles(reporte.id_reporte_pago)}>
                      Ver detalle
                    </button>
                  </div>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 2.5rem; display: flex; justify-content: flex-end;">
        <button class="btn-back" @click=${() => navigator.goto('/categoria/00024')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
          Volver
        </button>
      </div>
    `;
    }
}

customElements.define('view-reportes-pagos-listado', ViewReportesPagosListado);
