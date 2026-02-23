import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { navigator } from '../utils/navigator.js';
import { tiposServiciosService } from '../services/tipos-servicios-service.js';

export class ViewServiciosTipoServicioListado extends LitElement {
  static properties = {
    tipos_servicios: { type: Array },
    loading: { type: Boolean }
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

    .btn-create {
      background: var(--primary);
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      cursor: pointer;
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
      transform: scale(1.05);
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

    .actions-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 2rem;
      animation: fadeInUp 1s ease-out;
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
  `;

  constructor() {
    super();
    this.tipos_servicios = [];
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadTiposServicios();
  }

  async loadTiposServicios() {
    this.loading = true;
    try {
      this.tipos_servicios = await tiposServiciosService.getTiposServicios() || [];
    } catch (error) {
      console.error('Error loading types:', error);
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="header-section">
        <div class="title-group">
          <h1>Tipos de Servicios</h1>
          <p>Gestiona las categorías principales de los servicios ofrecidos</p>
        </div>
        <button class="btn-create" @click=${() => navigator.goto('/servicios/register/tipo_servicio')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Nuevo Tipo
        </button>
      </div>
      
      <div class="table-container">
        ${this.loading ? html`
          <div class="loader-container">
            <div class="spinner"></div>
            <p>Cargando información...</p>
          </div>
        ` : html`
          <table>
            <thead>
              <tr>
                <th>Nombre de Categoría</th>
                <th>Descripción Detallada</th>
                <th style="width: 120px; text-align: center;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${repeat(this.tipos_servicios, (tipo) => tipo.id_tipo_servicio, (tipo_servicio) => html`
                <tr>
                  <td style="font-weight: 700; color: var(--primary);">${tipo_servicio.nombre}</td>
                  <td style="color: var(--text-light); line-height: 1.5;">${tipo_servicio.descripcion || 'Sin descripción disponible'}</td>
                  <td style="text-align: center;">
                    <button class="btn-edit" @click=${() => navigator.goto(`/servicios/edit/tipo_servicio/${tipo_servicio.id_tipo_servicio}`)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      Editar
                    </button>
                  </td>
                </tr>
              `)}
              ${this.tipos_servicios.length === 0 ? html`
                <tr>
                  <td colspan="3" style="text-align: center; padding: 3rem; color: var(--text-light);">
                    No se encontraron tipos de servicios registrados.
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        `}
      </div>

      <div class="actions-footer">
        <button class="btn-back" @click=${() => navigator.goto('/categoria/00017')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver
        </button>
      </div>
    `;
  }
}

customElements.define('view-servicios-tipo-servicio-listado', ViewServiciosTipoServicioListado);
