import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { equiposService } from '../services/equipos-service.js';
import { authService } from '../services/auth-service.js';
import { popupService } from '../utils/popup-service.js';

export class ViewInventarioEquipoListado extends LitElement {
  static properties = {
    equipos: { type: Array },
    loading: { type: Boolean },
    userRole: { type: String },
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
  `;

  constructor() {
    super();
    this.equipos = [];
    this.loading = true;
    this.userRole = '';
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
          popupService.error('Error', 'Error al eliminar equipo');
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
      
      <div class="grid">
        ${this.equipos.map(equipo => html`
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
                Adquirido: ${new Date(equipo.fecha_adquisicion).toLocaleDateString()}
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
    `;
  }
}

customElements.define('view-inventario-equipo-listado', ViewInventarioEquipoListado);
