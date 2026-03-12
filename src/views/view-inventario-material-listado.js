import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { materialesService } from '../services/materiales-service.js';
import { authService } from '../services/auth-service.js';

export class ViewInventarioMaterialListado extends LitElement {
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

    .card-description {
      font-size: 0.9rem;
      color: var(--text-light);
      line-height: 1.5;
      margin: 0;
    }

    .card-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      background: #f8fafc;
      padding: 1rem;
      border-radius: 12px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .info-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-light);
      font-weight: 700;
    }

    .info-value {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text);
    }

    .stock-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 800;
    }

    .stock-warning {
      background: #fff7ed;
      color: #9a3412;
    }

    .stock-ok {
      background: #f0fdf4;
      color: #166534;
    }

    .price-tag {
      color: var(--primary);
      font-weight: 800;
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
      padding: 0.75rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
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
      transform: translateY(-1px);
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
    this.materiales = [];
    this.currentPage = 1;
    this.itemsPerPage = 8;
    this.loading = true;
    this.userRole = '';
    this.filters = {
      nombre: '',
      unidad_medida: ''
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadMateriales();
  }

  async loadMateriales() {
    this.loading = true;
    try {
      const [materiales, user] = await Promise.all([
        materialesService.getMateriales(),
        authService.getUser()
      ]);
      this.materiales = materiales;
      this.userRole = user?.id_rol || '';
    } catch (error) {
      console.error('Error loading materials:', error);
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

  render() {
    if (this.loading) {
      return html`
        <div class="loading-container">
          <div class="loader"></div>
          <p style="color: var(--text-light); font-weight: 500;">Sincronizando inventario de materiales...</p>
        </div>
      `;
    }

    const filtered = this.materiales.filter(m => {
      const matchNombre = !this.filters.nombre || m.nombre?.toLowerCase().includes(this.filters.nombre.toLowerCase().trim());
      const matchUnidad = !this.filters.unidad_medida || m.unidad_medida?.toLowerCase().includes(this.filters.unidad_medida.toLowerCase().trim());
      return matchNombre && matchUnidad;
    });

    const totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedMateriales = filtered.slice(startIndex, startIndex + this.itemsPerPage);

    return html`
      <div class="header-section">
        <div class="title-group">
          <h1>Materiales e Insumos</h1>
          <p>Gestión de existencias y precios unitarios</p>
        </div>
        <div class="header-actions">
          <button class="btn-back" @click=${() => navigator.goto('/categoria/00008')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver
          </button>
          ${this.userRole !== '00002' ? html`
            <button class="btn-create" @click=${() => navigator.goto('/inventario/register/material')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
              Nuevo Material
            </button>
          ` : ''}
        </div>
      </div>

      <div class="filters-panel">
        <div class="filter-group">
          <label for="filtro-nombre">Nombre de Material</label>
          <input type="text" id="filtro-nombre" placeholder="Filtrar por nombre..." @input=${this.handleFilterChange}>
        </div>
        <div class="filter-group">
          <label for="filtro-unidad_medida">Unidad de Medida</label>
          <input type="text" id="filtro-unidad_medida" placeholder="Filtrar por unidad (Kg, L, etc)..." @input=${this.handleFilterChange}>
        </div>
      </div>
      
      <div class="grid">
        ${filtered.length === 0 ? html`<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 5rem;">No se encontraron materiales.</p>` : ''}
        ${paginatedMateriales.map(material => {
      const lowStock = parseFloat(material.stock_actual) <= parseFloat(material.stock_minimo);
      return html`
              <div class="card">
                <h2 class="card-title">${material.nombre}</h2>
                <p class="card-description">${material.descripcion || 'Sin descripción detallada'}</p>
                
                <div class="card-info-grid">
                  <div class="info-item">
                    <span class="info-label">Stock Actual</span>
                    <span class="info-value stock-badge ${lowStock ? 'stock-warning' : 'stock-ok'}">
                      ${material.stock_actual} ${material.unidad_medida}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Precio Unit.</span>
                    <span class="info-value price-tag">$${parseFloat(material.precio_unitario).toFixed(2)}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Stock Mín.</span>
                    <span class="info-value">${material.stock_minimo}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">U. Medida</span>
                    <span class="info-value">${material.unidad_medida}</span>
                  </div>
                </div>

                ${this.userRole !== '00002' ? html`
                  <div class="card-actions">
                    <button class="btn-action btn-edit" @click=${() => navigator.goto(`/inventario/edit/material/${material.id_material}`)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Editar Ficha
                    </button>
                  </div>
                ` : ''}
              </div>
            `;
    })}
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

customElements.define('view-inventario-material-listado', ViewInventarioMaterialListado);
