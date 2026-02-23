import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { navigator } from '../utils/navigator.js';
import { serviciosService } from '../services/servicios-service.js';

export class ViewReportesPagosListado extends LitElement {
  static properties = {
    reportes: { type: Array },
    filteredReportes: { type: Array },
    filters: { type: Object },
    loading: { type: Boolean },
    currentPage: { type: Number },
    itemsPerPage: { type: Number }
  };

  static styles = css`
    :host {
      --success: #22c55e;
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --text: #1e293b;
      --text-light: #64748b;
      --border: #e2e8f0;
      --bg: #fff;
      --card-bg: #ffffff;
      --radius: 16px;
      --shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      
      display: block;
      padding: 2.5rem 2rem;
      min-height: 100vh;
      background-color: var(--bg);
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--text);
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      animation: fadeInDown 0.6s ease-out;
    }

    .title-group h1 {
      font-size: 2.25rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
      color: var(--text);
    }

    .title-group p {
      color: var(--text-light);
      margin: 0.5rem 0 0;
      font-weight: 500;
    }

    .filters-panel {
      background: #f8fafc;
      padding: 1.5rem 2rem;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      margin-bottom: 2.5rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem 1.5rem;
      align-items: end;
      animation: fadeInUp 0.6s ease-out;
      box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
      max-width: 1200px; /* Previene excesivo estiramiento en pantallas grandes */
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-size: 0.7rem;
      font-weight: 750;
      text-transform: uppercase;
      color: var(--text-light);
      letter-spacing: 0.075em;
      margin-left: 0.25rem;
    }

    input, select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      font-size: 0.9rem;
      background: #ffffff;
      color: var(--text);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
      box-sizing: border-box; /* Ensuring padding doesn't cause overflow */
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
      transform: translateY(-1px);
    }

    .input-error {
      border-color: #ef4444 !important;
      background-color: #fef2f2;
    }

    .error-msg {
      color: #ef4444;
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 0.25rem;
      grid-column: 1 / -1;
    }

    input[type="date"] {
      position: relative;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: calc(100% - 12px) center;
      padding-right: 2.5rem;
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
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      overflow: hidden;
      animation: fadeInUp 0.8s ease-out;
      margin-bottom: 2.5rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      background: #f8fafc;
      padding: 1rem 1.5rem;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-light);
      border-bottom: 1px solid var(--border);
    }

    td {
      padding: 1.25rem 1.5rem;
      font-size: 0.95rem;
      color: var(--text);
      border-bottom: 1px solid var(--border);
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: #fcfdfe;
    }

    .row-animate {
      animation: fadeInRow 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes fadeInRow {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      gap: 0.4rem;
    }

    .status-pendiente { background: #fef3c7; color: #92400e; }
    .status-aceptado { background: #dcfce7; color: #166534; }
    .status-cancelado { background: #fee2e2; color: #991b1b; }

    .btn {
      padding: 0.6rem 1rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-info {
        background-color: var(--primary);
        color: white;
        box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
    }
    .btn-info:hover {
        background-color: var(--primary-hover);
        transform: translateY(-2px);
        box-shadow: 0 6px 14px rgba(59, 130, 246, 0.3);
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

    /* Paginación Styles */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      animation: fadeInUp 1s ease-out;
    }

    .page-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: white;
      color: var(--text);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .page-btn:hover:not(:disabled) {
      border-color: var(--primary);
      color: var(--primary);
      background: #eff6ff;
    }

    .page-btn.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #f8fafc;
    }

    .nav-btn {
      padding: 0 1rem;
      width: auto;
    }

    /* Loading State */
    .loading-container { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center;
      padding: 10rem 0; 
      gap: 1.5rem; 
    }
    .loader { 
      width: 48px; 
      height: 48px; 
      border: 5px solid #f1f5f9; 
      border-top-color: var(--primary); 
      border-radius: 50%; 
      animation: spin 1s linear infinite; 
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 1024px) {
      .table-container { overflow-x: auto; }
    }

    @media (max-width: 640px) {
      :host { padding: 1.5rem 1rem; }
      .header-section { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
      .filters-panel { grid-template-columns: 1fr; padding: 1.5rem; }
      .btn-back { width: 100%; justify-content: center; }
      .pagination { flex-wrap: wrap; }
    }
  `;

  constructor() {
    super();
    this.reportes = [];
    this.filteredReportes = [];
    this.loading = true;
    this.currentPage = 1;
    this.itemsPerPage = 7;
    this.filters = {
      id_orden: '',
      plan_membresia_nombre: '',
      estado: '',
      fecha_inicio: '',
      fecha_fin: '',
      metodo_pago: ''
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadReportes();
  }

  async loadReportes() {
    this.loading = true;
    try {
      const reportes = await serviciosService.getReportesPagos();
      if (reportes) {
        this.reportes = Array.isArray(reportes) ? reportes : [];
        this.applyFilters();
      }
    } catch (error) {
      console.error('Error loading reportes:', error);
    } finally {
      this.loading = false;
    }
  }

  handleFilterChange(e) {
    const { id, value } = e.target;
    const filterKey = id.replace('filtro-', '').replace('-', '_');
    this.filters = { ...this.filters, [filterKey]: value };
    this.currentPage = 1; // Reset to first page on filter
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

  changePage(page) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (this.loading) {
      return html`
                <div class="loading-container">
                    <div class="loader"></div>
                    <p style="color: var(--text-light); font-weight: 500;">Sincronizando reportes de pagos...</p>
                </div>
            `;
    }

    const totalPages = Math.ceil(this.filteredReportes.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedReportes = this.filteredReportes.slice(startIndex, startIndex + this.itemsPerPage);

    return html`
      <div class="header-section">
        <div class="title-group">
          <h1>Reportes de Pagos</h1>
          <p>Gestión y validación de comprobantes recibidos</p>
        </div>
        <button class="btn-back" @click=${() => navigator.goto('/categoria/00024')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver
        </button>
      </div>

      <div class="filters-panel">
        <div class="filter-group">
          <label for="filtro-id-orden">ID Orden</label>
          <input type="text" id="filtro-id-orden" placeholder="Nº de Orden..." @input=${this.handleFilterChange}>
        </div>

        <div class="filter-group">
          <label for="filtro-plan-membresia-nombre">Plan / Membresía</label>
          <input type="text" id="filtro-plan-membresia-nombre" placeholder="Nombre del plan..." @input=${this.handleFilterChange}>
        </div>

        <div class="filter-group">
          <label for="filtro-estado">Estado de Pago</label>
          <select id="filtro-estado" @change=${this.handleFilterChange}>
            <option value="">Todos los estados</option>
            <option value="Pendiente">⏳ Pendiente</option>
            <option value="Aceptado">✅ Aceptado</option>
            <option value="Cancelado">❌ Cancelado</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="filtro-fecha-inicio">Fecha Inicio</label>
          <input type="date" id="filtro-fecha-inicio" @change=${this.handleFilterChange}>
        </div>

        <div class="filter-group">
          <label for="filtro-fecha-fin">Fecha Fin</label>
          <input 
            type="date" 
            id="filtro-fecha-fin" 
            class="${this.isDateRangeInvalid() ? 'input-error' : ''}" 
            .min=${this.filters.fecha_inicio} 
            @change=${this.handleFilterChange}
          >
        </div>
        ${this.isDateRangeInvalid() ? html`<div class="error-msg">La fecha de fin no puede ser anterior al inicio</div>` : ''}
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID Reporte</th>
              <th>Orden / Plan</th>
              <th>Cliente / Cédula</th>
              <th>Validado por</th>
              <th>Monto</th>
              <th>Emisión</th>
              <th>Estado</th>
              <th style="text-align: center;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedReportes.length === 0 ? html`<tr><td colspan="8" style="text-align: center; padding: 4rem; color: var(--text-light); font-weight: 500;">No se encontraron reportes con los criterios seleccionados</td></tr>` : ''}
            ${repeat(paginatedReportes, (rep) => rep.id_reporte_pago, (reporte) => html`
              <tr class="row-animate">
                <td style="font-weight: 800; color: var(--text-light);">#${reporte.id_reporte_pago}</td>
                <td>
                  <div style="font-weight: 700; color: var(--text);">${reporte.id_orden ? `Orden #${reporte.id_orden}` : 'Suscripción'}</div>
                  <div style="font-size: 0.8rem; color: var(--text-light);">${reporte.plan_membresia_nombre || 'N/A'}</div>
                </td>
                <td>
                  <div style="font-weight: 600;">${reporte.cliente_nombre || 'N/A'}</div>
                  <div style="font-size: 0.8rem; color: var(--text-light);">${reporte.cliente_cedula || 'N/A'}</div>
                </td>
                <td style="font-style: italic; font-size: 0.85rem; color: ${reporte.admin_nombre ? 'var(--text)' : 'var(--text-light)'};">
                  ${reporte.admin_nombre || 'Pendiente'}
                </td>
                <td style="font-weight: 800; color: var(--success); font-family: 'JetBrains Mono', monospace;">
                   $${parseFloat(reporte.monto).toFixed(2)}
                </td>
                <td style="font-size: 0.85rem; font-weight: 500;">${reporte.fecha_emision}</td>
                <td>
                  <span class="status-badge ${this.getStatusClass(reporte.estado)}">
                    ${reporte.estado}
                  </span>
                </td>
                <td>
                  <div style="display: flex; justify-content: center;">
                    <button class="btn btn-info" @click=${() => this.verDetalles(reporte.id_reporte_pago)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                      Ver detalle
                    </button>
                  </div>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>

      ${totalPages > 1 ? html`
        <div class="pagination">
          <button 
            class="page-btn nav-btn" 
            ?disabled=${this.currentPage === 1}
            @click=${() => this.changePage(this.currentPage - 1)}
          >
            Anterior
          </button>

          ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => html`
            <button 
              class="page-btn ${this.currentPage === page ? 'active' : ''}"
              @click=${() => this.changePage(page)}
            >
              ${page}
            </button>
          `)}

          <button 
            class="page-btn nav-btn" 
            ?disabled=${this.currentPage === totalPages}
            @click=${() => this.changePage(this.currentPage + 1)}
          >
            Siguiente
          </button>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('view-reportes-pagos-listado', ViewReportesPagosListado);
