import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { navigator } from '../utils/navigator.js';
import { serviciosService } from '../services/servicios-service.js';

export class ViewServiciosServicioListado extends LitElement {
  static properties = {
    servicios: { type: Array },
    loading: { type: Boolean },
    currentPage: { type: Number },
    itemsPerPage: { type: Number }
  };

  static styles = css`
    :host {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --danger: #ef4444;
      --danger-hover: #dc2626;
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
      border-bottom: 1px solid var(--border);
      transition: background 0.2s;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: #f8fbff;
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

    .btn-create {
      background: var(--primary);
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      font-weight: 700;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-create:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-edit {
      background: #f1f5f9;
      color: var(--primary);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .btn-edit:hover {
      background: var(--primary);
      color: white;
      transform: translateY(-2px);
    }

    .btn-delete {
      background: #fee2e2;
      color: var(--danger);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      margin-left: 0.5rem;
    }

    .btn-delete:hover {
      background: var(--danger);
      color: white;
      transform: translateY(-2px);
    }

    .btn-back {
      background: var(--text);
      color: #ffffff;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.3s;
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

    .actions-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 2rem;
      animation: fadeInUp 1s ease-out;
    }

    .price-value {
      font-weight: 800;
      color: var(--primary);
    }

    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 640px) {
      .pagination { flex-wrap: wrap; }
    }
  `;

  constructor() {
    super();
    this.servicios = [];
    this.loading = false;
    this.currentPage = 1;
    this.itemsPerPage = 7;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadServicios();
  }

  async loadServicios() {
    this.loading = true;
    try {
      this.servicios = await serviciosService.getServicios() || [];
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      this.loading = false;
    }
  }

  async deleteServicio(id) {
    if (confirm('¿Está seguro de que desea eliminar permanentemente este servicio?')) {
      try {
        await serviciosService.deleteServicio(id);
        this.loadServicios();
      } catch (error) {
        alert('Error al eliminar: ' + error.message);
      }
    }
  }

  changePage(page) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    if (this.loading) {
      return html`
        <div class="header-section">
          <div class="title-group">
            <h1>Catálogo de Servicios</h1>
            <p>Gestiona los servicios técnicos y su configuración de costos</p>
          </div>
        </div>
        <div class="loader-container">
          <div class="spinner"></div>
          <p>Cargando servicios...</p>
        </div>
      `;
    }

    const totalPages = Math.ceil(this.servicios.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedServicios = this.servicios.slice(startIndex, startIndex + this.itemsPerPage);

    return html`
      <div class="header-section">
        <div class="title-group">
          <h1>Catálogo de Servicios</h1>
          <p>Gestiona los servicios técnicos y su configuración de costos</p>
        </div>
        <button class="btn-create" @click=${() => navigator.goto('/servicios/register/servicio')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nuevo Servicio
        </button>
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 80px;">ID</th>
              <th>Nombre del Servicio</th>
              <th>Tipo</th>
              <th>Precio Base</th>
              <th style="width: 250px; text-align: center;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${repeat(paginatedServicios, (s) => s.id_servicio, (servicio) => html`
              <tr class="row-animate">
                <td style="font-family: monospace; font-weight: 600; color: var(--text-light);">${servicio.id_servicio}</td>
                <td style="font-weight: 700;">${servicio.nombre}</td>
                <td>
                  <span style="background: #eff6ff; color: var(--primary); padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600;">
                    ${servicio.nombre_tipo_servicio}
                  </span>
                </td>
                <td>
                  ${servicio.precio_general ? html`
                    <span class="price-value">$${parseFloat(servicio.precio_general).toFixed(2)}</span>
                  ` : html`<span style="color: var(--text-light); font-style: italic;">Por cotizar</span>`}
                </td>
                <td style="text-align: center;">
                  <button class="btn-edit" @click=${() => navigator.goto(`/servicios/edit/servicio/${servicio.id_servicio}`)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    Editar
                  </button>
                  <button class="btn-delete" @click=${() => this.deleteServicio(servicio.id_servicio)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    Eliminar
                  </button>
                </td>
              </tr>
            `)}
            ${this.servicios.length === 0 ? html`
              <tr>
                <td colspan="5" style="text-align: center; padding: 4rem; color: var(--text-light);">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <p>No se encontraron servicios registrados en el sistema.</p>
                </td>
              </tr>
            ` : ''}
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

      <div class="actions-footer">
        <button class="btn-back" @click=${() => navigator.goto('/categoria/00017')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver
        </button>
      </div>
    `;
  }
}

customElements.define('view-servicios-servicio-listado', ViewServiciosServicioListado);
