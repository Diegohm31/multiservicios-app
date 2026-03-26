import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { equiposService } from '../services/equipos-service.js';
import { authService } from '../services/auth-service.js';
import { popupService } from '../utils/popup-service.js';
import { formatDate, parseLocalDate, parseLocalDateTime, parseFilter, getEndOfDay, getStartOfDay } from '../utils/date-utils.js';

export class ViewInventarioEquipoListado extends LitElement {
  static properties = {
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    loading: { type: Boolean },
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

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
      animation: fadeInUp 0.8s ease-out;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }

    .card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow);
      border-color: var(--primary);
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
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: var(--text);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .badge-status {
      font-size: 0.7rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-available { background: #f0fdf4; color: #166534; }
    .status-unavailable { background: #fff1f2; color: #9f1239; }

    .card-description {
      font-size: 0.9rem;
      color: var(--text-light);
      line-height: 1.5;
      margin: 0;
    }

    .card-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      background: #f8fafc;
      padding: 1rem;
      border-radius: 12px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.850rem;
      font-weight: 600;
      color: var(--text);
    }

    .info-item svg {
      color: var(--text-light);
      flex-shrink: 0;
    }

    .card-actions {
      margin-top: auto;
      display: flex;
      gap: 0.75rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border);
    }

    .btn-action {
      flex: 1;
      padding: 0.6rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
    }

    .btn-edit {
      background: #f1f5f9;
      color: var(--text);
    }

    .btn-edit:hover {
      background: #e2e8f0;
    }

    .btn-delete {
      background: #fef2f2;
      color: #dc2626;
    }

    .btn-delete:hover {
      background: #fee2e2;
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

    @media (max-width: 640px) {
      :host { padding: 1.5rem 1rem; }
      .header-section { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
      .header-actions { width: 100%; flex-direction: column; }
      .btn-create, .btn-back { width: 100%; justify-content: center; }
    }

    /* Pagination Styles */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-top: 3rem;
      margin-bottom: 2rem;
      animation: fadeInUp 0.9s ease-out;
    }

    .page-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: white;
      color: var(--text);
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .page-btn:hover:not(:disabled) {
      border-color: var(--primary);
      color: var(--primary);
      background: #f0f7ff;
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
      padding: 0 1.25rem;
      width: auto;
    }
  `;

  constructor() {
    super();
    this.equipos = [];
    this.currentPage = 1;
    this.itemsPerPage = 8;
    this.loading = true;
    this.userRole = '';
    this.filters = {
      modelo: '',
      codigo_interno: '',
      fecha_inicio: '',
      fecha_fin: ''
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEquipos();
  }

  async loadEquipos() {
    this.loading = true;
    try {
      const [equipos, user] = await Promise.all([
        equiposService.getEquipos(),
        authService.getUser()
      ]);
      this.equipos = equipos;
      this.userRole = user?.id_rol || '';
    } catch (error) {
      console.error('Error loading equipment:', error);
    } finally {
      this.loading = false;
    }
  }

  handleFilterChange(e) {
    const { id, value } = e.target;
    const filterKey = id.replace('filtro-', '');
    this.filters = { ...this.filters, [filterKey]: value };
    this.currentPage = 1;
  }

  changePage(page) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteEquipo(id_equipo) {
    popupService.confirm(
      'Eliminar Equipo',
      '¿Está seguro de que desea eliminar este equipo?',
      async () => {
        try {
          await equiposService.deleteEquipo(id_equipo);
          this.loadEquipos();
          popupService.success('Éxito', 'Equipo eliminado correctamente');
        } catch (error) {
          popupService.warning('Acción Denegada', error.message || 'Error al eliminar equipo');
        }
      }
    );
  }

  render() {
    if (this.loading) {
      return html`
                <div class="loading-container">
                    <div class="loader"></div>
                    <p style="color: var(--text-light); font-weight: 500;">Cargando inventario de unidades...</p>
                </div>
            `;
    }

    const filtered = this.equipos.filter(e => {
      const matchModelo = !this.filters.modelo || e.modelo?.toLowerCase().includes(this.filters.modelo.toLowerCase().trim());
      const matchCodigo = !this.filters.codigo_interno || e.codigo_interno?.toLowerCase().includes(this.filters.codigo_interno.toLowerCase().trim());
      
      let matchFecha = true;
      if (this.filters.fecha_inicio || this.filters.fecha_fin) {
        const adqDate = parseLocalDateTime(e.fecha_adquisicion);
        if (adqDate) {
          if (this.filters.fecha_inicio) {
            const startDate = parseFilter(this.filters.fecha_inicio, false);
            matchFecha = matchFecha && adqDate >= startDate;
          }
          if (this.filters.fecha_fin) {
            const endDate = parseFilter(this.filters.fecha_fin, true);
            matchFecha = matchFecha && adqDate <= endDate;
          }
        }
      }

      return matchModelo && matchCodigo && matchFecha;
    });

    const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedEquipos = filtered.slice(startIndex, startIndex + this.itemsPerPage);

    return html`
      <div class="header-section">
        <div class="title-group">
          <h1>Equipos e Inventario</h1>
          <p>Control detallado de unidades y maquinaria</p>
        </div>
        <div class="header-actions">
          <button class="btn-back" @click=${() => navigator.goto('/categoria/00008')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver
          </button>
          ${this.userRole !== '00002' ? html`
            <button class="btn-create" @click=${() => navigator.goto('/inventario/register/equipo')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
              Nuevo Registro
            </button>
          ` : ''}
        </div>
      </div>

      <div class="filters-panel">
        <div class="filter-group">
          <label for="filtro-modelo">Modelo / Nombre</label>
          <input type="text" id="filtro-modelo" placeholder="Filtrar por modelo..." @input=${this.handleFilterChange}>
        </div>
        <div class="filter-group">
          <label for="filtro-codigo_interno">Código Interno</label>
          <input type="text" id="filtro-codigo_interno" placeholder="Filtrar por código..." @input=${this.handleFilterChange}>
        </div>
        <div class="filter-group">
          <label for="filtro-fecha_inicio">Adquisición Desde</label>
          <input type="date" id="filtro-fecha_inicio" .max=${this.filters.fecha_fin} @input=${this.handleFilterChange}>
        </div>
        <div class="filter-group">
          <label for="filtro-fecha_fin">Adquisición Hasta</label>
          <input type="date" id="filtro-fecha_fin" .min=${this.filters.fecha_inicio} @input=${this.handleFilterChange}>
        </div>
      </div>
      
      <div class="grid">
        ${filtered.length === 0 ? html`<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 5rem;">No se encontraron equipos registrados.</p>` : ''}
        ${paginatedEquipos.map(equipo => html`
          <div class="card">
            <div class="card-title">
              <span>${equipo.modelo}</span>
              <span class="badge-status ${equipo.disponible ? 'status-available' : 'status-unavailable'}">
                ${equipo.disponible ? 'Disponible' : 'En Uso / Mantenimiento'}
              </span>
            </div>
            
            <p class="card-description">${equipo.descripcion || 'Sin descripción detallada'}</p>

            <div class="card-info">
              <div class="info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/></svg>
                ID: ${equipo.codigo_interno}
              </div>
              <div class="info-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Adquirido: ${formatDate(equipo.fecha_adquisicion)}
              </div>
            </div>

            ${this.userRole !== '00002' ? html`
              <div class="card-actions">
                <button class="btn-action btn-edit" @click=${() => navigator.goto(`/inventario/edit/equipo/${equipo.id_equipo}`)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Editar
                </button>
                <button class="btn-action btn-delete" @click=${() => this.deleteEquipo(equipo.id_equipo)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  Eliminar
                </button>
              </div>
            ` : ''}
          </div>
        `)}
      </div>

      ${totalPages > 1 ? html`
        <div class="pagination">
          <button class="page-btn nav-btn" ?disabled=${this.currentPage === 1} @click=${() => this.changePage(this.currentPage - 1)}>
            Anterior
          </button>
          
          ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => html`
            <button class="page-btn ${this.currentPage === page ? 'active' : ''}" @click=${() => this.changePage(page)}>
              ${page}
            </button>
          `)}

          <button class="page-btn nav-btn" ?disabled=${this.currentPage === totalPages} @click=${() => this.changePage(this.currentPage + 1)}>
            Siguiente
          </button>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('view-inventario-equipo-listado', ViewInventarioEquipoListado);
