import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { navigator } from '../utils/navigator.js';
import { movimientosService } from '../services/movimientos-service.js';
import { materialesService } from '../services/materiales-service.js';
import { usuariosService } from '../services/usuarios-service.js';

export class ViewInventarioMovimientoListado extends LitElement {
  static properties = {
    movimientos: { type: Array },
    materiales: { type: Array },
    admins: { type: Array },
    loading: { type: Boolean },
    currentPage: { type: Number },
    itemsPerPage: { type: Number }
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
    this.itemsPerPage = 7;
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
      await Promise.all([
        this.loadMovimientos(),
        this.loadMateriales(),
        this.loadAdmins()
      ]);
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

  render() {
    if (this.loading) {
      return html`
        <div class="loading-container">
          <div class="loader"></div>
          <p style="color: var(--text-light); font-weight: 500;">Cargando historial de movimientos...</p>
        </div>
      `;
    }

    const totalPages = Math.ceil(this.movimientos.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedMovimientos = this.movimientos.slice(startIndex, startIndex + this.itemsPerPage);

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
          <button class="btn-create" @click=${() => navigator.goto('/inventario/register/movimiento')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
            Nuevo Movimiento
          </button>
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
                      <span class="date-text">${movimiento.fecha_movimiento}</span>
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
