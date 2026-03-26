import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { tiposEquiposService } from '../services/tipos-equipos-service.js';
import { authService } from '../services/auth-service.js';
import { popupService } from '../utils/popup-service.js';

export class ViewInventarioTipoEquipoListado extends LitElement {
  static properties = {
    tipos_equipos: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    loading: { type: Boolean },
    user: { type: Object },
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
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--primary);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .card:hover::before {
      opacity: 1;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: var(--text);
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

    .card-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .info-label {
      color: var(--text-light);
    }

    .info-value {
      color: var(--text);
      font-weight: 700;
    }

    .cost-badge {
      background: #f0fdf4;
      color: #166534;
      padding: 0.25rem 0.75rem;
      border-radius: 8px;
      font-weight: 800;
    }

    .stock-highlight {
      color: var(--primary);
      font-size: 1rem;
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
    this.tipos_equipos = [];
    this.currentPage = 1;
    this.itemsPerPage = 8;
    this.loading = true;
    this.filters = {
      nombre: '',
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadTiposEquipos();
  }

  async loadTiposEquipos() {
    this.loading = true;
    try {
      const [tipos, user] = await Promise.all([
        tiposEquiposService.getTiposEquipos(),
        authService.getUser()
      ]);
      this.tipos_equipos = tipos;
      this.user = user;
    } catch (error) {
      console.error('Error loading equipo types:', error);
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

  async deleteTipoEquipo(id_tipo_equipo) {
    popupService.confirm(
      'Eliminar Tipo de Equipo',
      '¿Está seguro de que desea eliminar este tipo de equipo?',
      async () => {
        try {
          await tiposEquiposService.deleteTipoEquipo(id_tipo_equipo);
          this.loadTiposEquipos();
          popupService.success('Éxito', 'Tipo de equipo eliminado correctamente');
        } catch (error) {
          popupService.warning('Acción Denegada', error.message || 'Error al eliminar tipo de equipo');
        }
      }
    );
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading-container">
          <div class="loader"></div>
          <p style="color: var(--text-light); font-weight: 500;">Cargando inventario de equipos...</p>
        </div>
      `;
    }

    const filtered = this.tipos_equipos.filter(t => {
      const matchNombre = !this.filters.nombre || t.nombre?.toLowerCase().includes(this.filters.nombre.toLowerCase().trim());
      return matchNombre;
    });

    const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedTiposEquipos = filtered.slice(startIndex, startIndex + this.itemsPerPage);

    return html`
      <div class="header-section">
        <div class="title-group">
          <h1>Tipos de Equipos</h1>
          <p>Control de inventario y costos operativos</p>
        </div>
        <div class="header-actions">
          <button class="btn-back" @click=${() => navigator.goto('/categoria/00008')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver
          </button>
          ${this.user?.id_rol !== '00002' ? html`
            <button class="btn-create" @click=${() => navigator.goto('/inventario/register/tipo_equipo')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
              Nuevo Equipo
            </button>
          ` : ''}
        </div>
      </div>

      <div class="filters-panel">
        <div class="filter-group">
          <label for="filtro-nombre">Nombre de Tipo de Equipo</label>
          <input type="text" id="filtro-nombre" placeholder="Filtrar por nombre..." @input=${this.handleFilterChange}>
        </div>
      </div>
      
      <div class="grid">
        ${filtered.length === 0 ? html`<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 5rem;">No se encontraron tipos de equipos.</p>` : ''}
        ${paginatedTiposEquipos.map(tipo_equipo => html`
          <div class="card">
            <h2 class="card-title">${tipo_equipo.nombre}</h2>
            
            <div class="card-info">
              <div class="info-row">
                <span class="info-label">Costo Operativo</span>
                <span class="info-value cost-badge">$${parseFloat(tipo_equipo.costo_hora).toFixed(2)}/h</span>
              </div>
              <div class="info-row">
                <span class="info-label">Stock Actual</span>
                <span class="info-value stock-highlight">${tipo_equipo.cantidad} ${tipo_equipo.cantidad === 1 ? 'unidad' : 'unidades'}</span>
              </div>
            </div>

            ${this.user?.id_rol !== '00002' ? html`
            <div class="card-actions">
              <button class="btn-action btn-edit" @click=${() => navigator.goto(`/inventario/edit/tipo_equipo/${tipo_equipo.id_tipo_equipo}`)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar
              </button>
              <button class="btn-action btn-delete" @click=${() => this.deleteTipoEquipo(tipo_equipo.id_tipo_equipo)}>
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

customElements.define('view-inventario-tipo-equipo-listado', ViewInventarioTipoEquipoListado);
