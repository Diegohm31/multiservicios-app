import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { navigator } from '../utils/navigator.js';
import { movimientosService } from '../services/movimientos-service.js';
import { materialesService } from '../services/materiales-service.js';
import { usuariosService } from '../services/usuarios-service.js';
import { authService } from '../services/auth-service.js';
import { formatDate, parseLocalDate, parseLocalDateTime, parseFilter } from '../utils/date-utils.js';

export class ViewInventarioMovimientoListado extends LitElement {
  static properties = {
    movimientos: { type: Array },
    materiales: { type: Array },
    admins: { type: Array },
    loading: { type: Boolean },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    userRole: { type: String },
    filters: { type: Object },
  };

  static styles = css`
    :host {
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

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .btn-create {
      background: var(--primary);
      color: white;
      padding: 0.75rem 1.5rem;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      border: none;
      cursor: pointer;
    }

    .btn-create:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
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

    /* Filters Panel */
    .filters-panel {
      background: var(--card-bg);
      padding: 1.5rem 2rem;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      margin-bottom: 2.5rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1.25rem 1.5rem;
      align-items: end;
      animation: fadeInUp 0.7s ease-out;
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
      padding: 0.8rem 1rem;
      border: 1px solid var(--border);
      border-radius: 12px;
      font-size: 0.95rem;
      background: white;
      color: var(--text);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
      box-sizing: border-box;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
      transform: translateY(-1px);
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
      from { 
        opacity: 0; 
        transform: translateY(10px);
      }
      to { 
        opacity: 1; 
        transform: translateY(0);
      }
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      gap: 0.4rem;
    }

    .badge-entrada {
      background: #f0fdf4;
      color: #166534;
    }

    .badge-salida {
      background: #fef2f2;
      color: #991b1b;
    }

    .admin-info {
      display: flex;
      flex-direction: column;
    }

    .admin-name {
      font-weight: 700;
      color: var(--text);
    }

    .date-text {
      font-size: 0.85rem;
      color: var(--text-light);
      font-weight: 500;
    }

    .material-name {
      font-weight: 600;
      color: var(--primary);
    }

    .cantidad-text {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
    }

    /* Paginación Styles */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-top: 2rem;
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
      .table-container {
        overflow-x: auto;
      }
    }

    @media (max-width: 640px) {
      :host { padding: 1.5rem 1rem; }
      .header-section { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
      .header-actions { width: 100%; flex-direction: column; }
      .btn-create, .btn-back { width: 100%; justify-content: center; }
      .pagination { flex-wrap: wrap; }
    }
  `;

  constructor() {
    super();
    this.movimientos = [];
    this.materiales = [];
    this.admins = [];
    this.loading = true;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.userRole = '';
    this.filters = {
      admin_nombre: '',
      material_nombre: '',
      fecha_inicio: '',
      fecha_fin: '',
      tipo_movimiento: ''
    };
  }

  changePage(page) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadAllData();
  }

  async loadAllData() {
    this.loading = true;
    try {
      const [, , , user] = await Promise.all([
        this.loadMovimientos(),
        this.loadMateriales(),
        this.loadAdmins(),
        authService.getUser()
      ]);
      this.userRole = user?.id_rol || '';
    } catch (error) {
      console.error('Error loading movements history:', error);
    } finally {
      this.loading = false;
    }
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

  handleFilterChange(e) {
    const { id, value } = e.target;
    const filterKey = id.replace('filtro-', '');
    this.filters = { ...this.filters, [filterKey]: value };
    this.currentPage = 1;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading-container">
          <div class="loader"></div>
          <p style="color: var(--text-light); font-weight: 500;">Cargando historial de movimientos...</p>
        </div>
      `;
    }

    const filtered = this.movimientos.filter(mov => {
      const admin = this.admins.find(a => a.id_admin == mov.id_admin);
      const material = this.materiales.find(m => m.id_material == mov.id_material);

      const matchAdmin = !this.filters.admin_nombre || admin?.nombre?.toLowerCase().includes(this.filters.admin_nombre.toLowerCase().trim());
      const matchMaterial = !this.filters.material_nombre || material?.nombre?.toLowerCase().includes(this.filters.material_nombre.toLowerCase().trim());
      const matchTipo = !this.filters.tipo_movimiento || mov.tipo_movimiento === this.filters.tipo_movimiento;

      let matchFecha = true;
      if (this.filters.fecha_inicio || this.filters.fecha_fin) {
        const movDate = parseLocalDateTime(mov.fecha_movimiento);
        if (movDate) {
          if (this.filters.fecha_inicio) {
            const startDate = parseFilter(this.filters.fecha_inicio, false);
            matchFecha = matchFecha && movDate >= startDate;
          }
          if (this.filters.fecha_fin) {
            const endDate = parseFilter(this.filters.fecha_fin, true);
            matchFecha = matchFecha && movDate <= endDate;
          }
        }
      }

      return matchAdmin && matchMaterial && matchTipo && matchFecha;
    });

    const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedMovimientos = filtered.slice(startIndex, startIndex + this.itemsPerPage);

    return html`
      <div class="header-section">
        <div class="title-group">
          <h1>Historial de Movimientos</h1>
          <p>Registro cronológico de entradas y salidas de almacén</p>
        </div>
        <div class="header-actions">
          <button class="btn-back" @click=${() => navigator.goto('/categoria/00008')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver
          </button>
          ${this.userRole !== '00002' ? html`
            <button class="btn-create" @click=${() => navigator.goto('/inventario/register/movimiento')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
              Nuevo Movimiento
            </button>
          ` : ''}
        </div>
      </div>

      <div class="filters-panel">
        <div class="filter-group">
          <label for="filtro-admin_nombre">Administrador</label>
          <input type="text" id="filtro-admin_nombre" placeholder="Filtrar por admin..." @input=${this.handleFilterChange}>
        </div>
        <div class="filter-group">
          <label for="filtro-material_nombre">Nombre Material</label>
          <input type="text" id="filtro-material_nombre" placeholder="Filtrar por material..." @input=${this.handleFilterChange}>
        </div>
        <div class="filter-group">
          <label for="filtro-tipo_movimiento">Tipo Movimiento</label>
          <select id="filtro-tipo_movimiento" @change=${this.handleFilterChange}>
            <option value="">Todos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="filtro-fecha_inicio">Desde</label>
          <input type="date" id="filtro-fecha_inicio" .max=${this.filters.fecha_fin} @input=${this.handleFilterChange}>
        </div>
        <div class="filter-group">
          <label for="filtro-fecha_fin">Hasta</label>
          <input type="date" id="filtro-fecha_fin" .min=${this.filters.fecha_inicio} @input=${this.handleFilterChange}>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Administrador / Fecha</th>
              <th>Material Involucrado</th>
              <th>Cantidad</th>
              <th>Tipo de Registro</th>
            </tr>
          </thead>
          <tbody>
            ${repeat(paginatedMovimientos, (mov) => mov.id_movimiento_material, (movimiento) => {
      const admin = this.admins.find(a => a.id_admin == movimiento.id_admin);
      const material = this.materiales.find(m => m.id_material == movimiento.id_material);
      const isEntrada = movimiento.tipo_movimiento === 'entrada';

      return html`
                <tr class="row-animate">
                  <td>
                    <span style="font-weight: 800; color: var(--text-light);">#${movimiento.id_movimiento_material}</span>
                  </td>
                  <td>
                    <div class="admin-info">
                      <span class="admin-name">${admin?.nombre || 'N/A'}</span>
                      <span class="date-text">${formatDate(movimiento.fecha_movimiento)}</span>
                    </div>
                  </td>
                  <td>
                    <span class="material-name">${material?.nombre || 'Material eliminado'}</span>
                  </td>
                  <td>
                    <span class="cantidad-text">${movimiento.cantidad}</span>
                    <span style="font-size: 0.75rem; color: var(--text-light); font-weight: 600;">${material?.unidad_medida || ''}</span>
                  </td>
                  <td>
                    <span class="badge ${isEntrada ? 'badge-entrada' : 'badge-salida'}">
                      ${isEntrada ? html`
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M12 5v14M5 12h14"/></svg>
                        Entrada
                      ` : html`
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M5 12h14"/></svg>
                        Salida
                      `}
                    </span>
                  </td>
                </tr>
              `;
    })}
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

customElements.define('view-inventario-movimiento-listado', ViewInventarioMovimientoListado);
