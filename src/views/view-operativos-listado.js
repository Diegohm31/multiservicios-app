import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { operativosService } from '../services/operativos-service.js';
import { usuariosService } from '../services/usuarios-service.js';

export class ViewOperativosListado extends LitElement {
  static properties = {
    operativos: { type: Array },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
    loading: { type: Boolean },
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
      gap: 1.5rem;
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

    .card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .avatar-placeholder {
      width: 48px;
      height: 48px;
      background: #eff6ff;
      color: var(--primary);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.25rem;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: var(--text);
    }

    .card-subtitle {
      font-size: 0.875rem;
      color: var(--text-light);
      font-weight: 500;
    }

    .info-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9rem;
      color: var(--text);
      font-weight: 500;
    }

    .info-item svg {
      color: var(--text-light);
    }

    .specialties-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .specialty-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.35rem 0.75rem;
      background: #f1f5f9;
      color: #475569;
      border-radius: 9999px;
      border: 1px solid var(--border);
    }

    .card-actions {
      margin-top: auto;
      display: flex;
      gap: 0.75rem;
      padding-top: 1.5rem;
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

    /* Loading state */
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
    this.operativos = [];
    this.currentPage = 1;
    this.itemsPerPage = 4;
    this.loading = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadOperativos();
  }

  async loadOperativos() {
    this.loading = true;
    try {
      this.operativos = await operativosService.getAllOperativosWithDeleted();
    } catch (error) {
      console.error('Error loading operativos:', error);
    } finally {
      this.loading = false;
    }
  }

  changePage(page) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async handleToggleStatus(id_usuario, is_deleted) {
    const newActiveValue = is_deleted ? 1 : 0; // Si is_deleted=1 (Inactivo/Borrado), activamos con 1.
    const action = newActiveValue ? 'activar' : 'inactivar';
    if (confirm(`¿Está seguro de que desea ${action} a este operativo?`)) {
      try {
        await usuariosService.toggleStatus(id_usuario, newActiveValue);
        this.loadOperativos();
      } catch (error) {
        alert('Error al cambiar el estado del operativo');
      }
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading-container">
          <div class="loader"></div>
          <p style="color: var(--text-light); font-weight: 500;">Cargando personal operativo...</p>
        </div>
      `;
    }

    const totalPages = Math.ceil(this.operativos.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedOperativos = this.operativos.slice(startIndex, startIndex + this.itemsPerPage);

    return html`
      <div class="header-section">
        <div class="title-group">
          <h1>Personal Operativo</h1>
          <p>Gestiona el equipo técnico y sus especialidades</p>
        </div>
        <div class="header-actions">
          <button class="btn-back" @click=${() => navigator.goto('/categoria/00001')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver
          </button>
          <button class="btn-create" @click=${() => navigator.goto('/operativos/register')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
            Nuevo Operativo
          </button>
        </div>
      </div>
      
      <div class="grid">
        ${this.operativos.length === 0 ? html`<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 5rem;">No se encontraron operativos registrados.</p>` : ''}
        ${paginatedOperativos.map(operativo => html`
          <div class="card">
            <span class="status-badge ${!operativo.is_deleted ? 'status-active' : 'status-inactive'}" style="position: absolute; top: 1.25rem; right: 1.25rem; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; background: ${!operativo.is_deleted ? '#dcfce7' : '#fee2e2'}; color: ${!operativo.is_deleted ? '#166534' : '#991b1b'};">
              ${!operativo.is_deleted ? 'Activo' : 'Inactivo'}
            </span>
            <div class="card-header">
              <div class="avatar-placeholder">
                ${(operativo.nombre || 'O').charAt(0).toUpperCase()}
              </div>
              <div class="card-meta">
                <h2 class="card-title">${operativo.nombre}</h2>
                <div class="card-subtitle">ID: ${operativo.id_operativo}</div>
              </div>
            </div>

            <div class="info-list">
              <div class="info-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                CI: ${operativo.cedula}
              </div>
              <div class="info-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                ${operativo.telefono}
              </div>
              
              <div class="specialties-container">
                ${operativo.array_especialidades.map(e => html`
                  <div class="specialty-badge" title="Tarifa: $${e.tarifa_hora}/h">
                    ${e.nombre} Nivel ${e.nivel}
                  </div>
                `)}
              </div>
            </div>

            <div class="card-actions">
              <button class="btn-action btn-edit" @click=${() => navigator.goto(`/operativos/edit/${operativo.id_operativo}`)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar
              </button>
              <button class="btn-action ${!operativo.is_deleted ? 'btn-delete' : 'btn-edit'}" style="background: ${!operativo.is_deleted ? '#fee2e2' : '#dcfce7'}; color: ${!operativo.is_deleted ? '#dc2626' : '#166534'};" @click=${() => this.handleToggleStatus(operativo.id_user, operativo.is_deleted)}>
                ${!operativo.is_deleted ? html`
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                  Inactivar
                ` : html`
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5L20 7"/></svg>
                  Activar
                `}
              </button>
            </div>
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

customElements.define('view-operativos-listado', ViewOperativosListado);
