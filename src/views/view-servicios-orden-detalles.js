import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { serviciosService } from '../services/servicios-service.js';

export class ViewServiciosOrdenDetalles extends LitElement {
  static properties = {
    ordenId: { type: String },
    id_rol: { type: String },
    orden: { type: Object },
    loading: { type: Boolean }
  };

  static styles = css`
    :host {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --bg: #fff;
      --card-bg: #ffffff;
      --text: #1e293b;
      --text-light: #64748b;
      --border: #e2e8f0;
      --radius: 16px;
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --success: #10b981;
      --success-hover: #059669;
      --danger: #ef4444;
      --danger-hover: #dc2626;
      
      display: block;
      padding: 2rem 1rem;
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--text);
      background-color: var(--bg);
      min-height: 100vh;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 3rem;
      flex: 1;
    }

    h1 {
      font-size: 1.875rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
    }

    .status-badge {
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-pendiente { background: #fef3c7; color: #92400e; }
    .status-aceptada { background: #dcfce7; color: #166534; }
    .status-presupuestada { background: #f3e8ff; color: #6b21a8; }
    .status-completada { background: #dcfce7; color: #15803d; }
    .status-cancelada { background: #fee2e2; color: #991b1b; }
    .status-en-ejecucion { background: #e0f2fe; color: #075985; }
    .status-en-espera { background: #e0f2fe; color: #075985; }
    .status-por-pagar { background: #ffedd5; color: #c2410c; }
    .status-verificando_pago { background: #e0e7ff; color: #3730a3; }
    .status-asignando_personal { background: #dcfce7; color: #166534; }

    .card {
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
      background: #fcfcfc;
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 700;
      margin: 0;
      color: var(--primary);
    }

    .card-body {
      padding: 1.5rem;
    }

    .btn-outline-danger {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.2rem;
      background: transparent;
      color: var(--danger);
      border: 2px solid var(--danger);
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-outline-danger:hover {
      background: var(--danger);
      color: white;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-light);
      letter-spacing: 0.05em;
    }

    .detail-value {
      font-size: 1rem;
      font-weight: 500;
    }

    .services-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .service-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: all 0.2s;
    }

    .service-item:hover {
      border-color: var(--primary);
      background: #f8fbff;
    }

    .service-info {
      flex: 1;
    }

    .service-name {
      font-weight: 700;
      font-size: 1.05rem;
      margin-bottom: 0.25rem;
    }

    .service-description {
      font-size: 0.875rem;
      color: var(--text-light);
      font-style: italic;
    }

    .service-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
      min-width: 120px;
    }

    .service-qty {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-light);
    }

    .service-price {
      font-size: 1.125rem;
      font-weight: 800;
      color: var(--primary);
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      gap: 1rem;
    }

    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid var(--border);
      border-bottom-color: var(--primary);
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 640px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .service-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
      .service-meta {
        align-items: flex-start;
        width: 100%;
        border-top: 1px solid var(--border);
        padding-top: 0.75rem;
      }
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--primary);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }

    .btn-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-4px);
    }

    .btn-success {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--success);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }

    .btn-success:hover {
      background: var(--success-hover);
      transform: translateY(-4px);
    }

    .btn-danger {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--danger);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }

    .btn-danger:hover {
      background: var(--danger-hover);
      transform: translateY(-4px);
    }

    textarea {
      width: 100%;
      min-height: 100px;
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: 12px;
      font-family: inherit;
      font-size: 0.9rem;
      resize: vertical;
      margin-bottom: 1rem;
      background: white;
      color: black;
      box-sizing: border-box;
    }

    textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  `;

  constructor() {
    super();
    this.ordenId = '';
    this.id_rol = '';
    this.orden = null;
    this.loading = true;
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.ordenId) {
      await this.loadOrden();
    }
  }

  async loadOrden() {
    this.loading = true;
    try {
      const data = await serviciosService.getOneOrden(this.ordenId);
      if (data) {
        this.orden = data.orden;
        this.id_rol = data.id_rol;
      }
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      this.loading = false;
    }
  }

  getStatusClass(status) {
    const s = status?.toLowerCase() || '';
    if (s.includes('pend')) return 'status-pendiente';
    if (s.includes('acept')) return 'status-aceptada';
    if (s.includes('presu')) return 'status-presupuestada';
    if (s.includes('comp')) return 'status-completada';
    if (s.includes('canc')) return 'status-cancelada';
    if (s.includes('ejecucion') || s.includes('ejecucion')) return 'status-en-ejecucion';
    if (s.includes('espera')) return 'status-en-espera';
    if (s.includes('pagar')) return 'status-por-pagar';
    if (s.includes('verificando')) return 'status-verificando_pago';
    if (s.includes('asignando personal')) return 'status-asignando_personal';
    return '';
  }

  async cancelarOrden(id) {
    const observaciones = this.shadowRoot.getElementById('observaciones-admin')?.value;
    if (confirm('¿Está seguro de que desea cancelar la orden?')) {
      await serviciosService.cancelarOrden(id, observaciones);
      await this.loadOrden();
    }
  }

  async aceptarOrden(id) {
    const observaciones = this.shadowRoot.getElementById('observaciones-admin')?.value;
    if (confirm('¿Está seguro de que desea aceptar la orden?')) {
      await serviciosService.aceptarOrden(id, observaciones);
      await this.loadOrden();
    }
  }

  async aceptarPresupuesto(id) {
    if (confirm('¿Está seguro de que desea aceptar el presupuesto?')) {
      await serviciosService.aceptarPresupuesto(id);
      await this.loadOrden();
    }
  }

  async cancelarPresupuesto(id) {
    if (confirm('¿Está seguro de que desea cancelar el presupuesto?')) {
      await serviciosService.cancelarPresupuesto(id);
      await this.loadOrden();
    }
  }

  async triggerFileUpload() {
    this.shadowRoot.getElementById('peritaje-input').click();
  }

  async handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      this.loading = true;
      await serviciosService.subirPeritaje(this.orden.id_orden, file);
      await this.loadOrden();
      alert('Archivo de peritaje subido correctamente');
    } catch (error) {
      console.error('Error uploading peritaje:', error);
      alert('Error al subir el archivo: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  viewPeritaje() {
    if (this.orden.pdf_peritaje) {
      const url = `${serviciosService.baseUrl}/storage/${this.orden.pdf_peritaje}`;
      window.open(url, '_blank');
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading-container">
          <div class="loader"></div>
          <p>Cargando detalles de la orden...</p>
        </div>
      `;
    }

    if (!this.orden) {
      return html`
        <div class="container" style="text-align: center; padding-top: 4rem;">
          <h2>No se encontró la orden</h2>
          <button class="btn-back" @click=${() => navigator.goto('/servicios/listado/orden')}>
            Volver al listado
          </button>
        </div>
      `;
    }

    const servicios = this.orden.servicios || this.orden.array_servicios || [];
    const total = servicios.reduce((acc, s) => acc + parseFloat(s.pivot?.precio_a_pagar || s.precio_a_pagar || 0), 0);

    return html`
      <div class="container">
        <header class="header">
          <div class="header-title">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <h1>Orden #${this.orden.id_orden}</h1>
              <span class="status-badge ${this.getStatusClass(this.orden.estado)}">
                ${this.orden.estado}
              </span>
            </div>

            <!-- Botones de Peritaje -->
            <div style="display: flex; gap: 1rem; align-items: center;">
              ${this.id_rol === '00003' ? html`
                <!-- Admin -->
                ${!this.orden.pdf_peritaje ? html`
                  <button class="btn-outline-danger" @click=${this.triggerFileUpload}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Subir Peritaje
                  </button>
                ` : html`
                  <button class="btn-outline-danger" @click=${this.viewPeritaje}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    Visualizar Peritaje
                  </button>
                  <button class="btn-outline-danger" @click=${this.triggerFileUpload}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Actualizar Peritaje
                  </button>
                `}
                <input 
                  type="file" 
                  id="peritaje-input" 
                  accept=".pdf" 
                  style="display: none;" 
                  @change=${this.handleFileUpload}
                >
              ` : html`
                <!-- Cliente -->
                ${this.orden.pdf_peritaje ? html`
                  <button class="btn-outline-danger" @click=${this.viewPeritaje}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    Visualizar Peritaje
                  </button>
                ` : html`
                  <span style="font-size: 0.85rem; color: var(--text-light); font-weight: 600; font-style: italic;">
                    Aun no se ha subido el Archivo de Peritaje
                  </span>
                `}
              `}
            </div>
          </div>
          
          <button class="btn-back" @click=${() => navigator.goto('/servicios/listado/orden')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Volver
          </button>
        </header>

        <section class="card">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <h2 class="card-title">Información General</h2>
            <!-- Lógica de total inteligente para estados previos a ser presupuestada -->
            ${(() => {
        const s = this.orden.estado?.toLowerCase() || '';
        const isPreBudget = s.includes('pend') || s.includes('acept');
        if (isPreBudget) {
          return servicios.some(item => Number(item.servicio_tabulado) === 0)
            ? html`<div style="font-weight: 800; font-size: 1.25rem; color: var(--primary);">Por Cotizar</div>`
            : html`<div style="font-weight: 800; font-size: 1.25rem; color: var(--primary);">Total Estimado: $${total.toFixed(2)}</div>`;
        }
        return html`<div style="font-weight: 800; font-size: 1.25rem; color: var(--primary);">Total: $${total.toFixed(2)}</div>`;
      })()}
          </div>
          <div class="card-body">
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Fecha de Emisión</span>
                <span class="detail-value">${this.orden.fecha_emision}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Rango de Fechas</span>
                ${this.orden.fecha_inicio && this.orden.fecha_fin ? html`
                  <span class="detail-value">${this.orden.fecha_inicio} al ${this.orden.fecha_fin}</span>
                ` : html`
                  <span class="detail-value">Aún no definido</span>
                `}
              </div>
              <div class="detail-item">
                <span class="detail-label">Ubicación / Dirección</span>
                <span class="detail-value">${this.orden.direccion}</span>
              </div>
              ${this.orden.observaciones ? html`
                <div class="detail-item" style="grid-column: 1 / -1;">
                  <span class="detail-label">Observaciones del Administrador</span>
                  <span class="detail-value" style="font-style: italic; color: var(--text-light);">${this.orden.observaciones}</span>
                </div>
              ` : ''}
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-header">
            <h2 class="card-title">Servicios Solicitados</h2>
          </div>
          <div class="card-body">
            <div class="services-list">
              ${servicios.length === 0 ? html`<p>No hay servicios registrados en esta orden.</p>` : ''}
              ${servicios.map(servicio => html`
                <div class="service-item">
                  <div class="service-info">
                    <div class="service-name">${servicio.nombre || 'Servicio'}</div>
                    ${servicio.descripcion ? html`<div class="service-description">"${servicio.descripcion}"</div>` : ''}
                  </div>
                  <div class="service-meta">
                    <div class="service-qty">Cantidad: ${servicio.pivot?.cantidad || servicio.cantidad || 0}</div>
                    ${(servicio.pivot?.precio_a_pagar || servicio.precio_a_pagar) ? html`
                      <div class="service-price">$${parseFloat(servicio.pivot?.precio_a_pagar || servicio.precio_a_pagar).toFixed(2)}</div>
                    ` : html`<div class="service-price">Por Cotizar</div>`}
                  </div>
                </div>
              `)}
            </div>
          </div>
        </section>

        <!-- si es admin mostrar botones para aceptar o cancelar orden-->
        ${this.id_rol === '00003' && this.orden.estado === 'Pendiente' ? html`
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Acciones</h2>
            </div>
            <div class="card-body">
              <div style="margin-bottom: 1rem;">
                <label class="detail-label" style="display: block; margin-bottom: 0.5rem;">Observaciones del Administrador</label>
                <textarea id="observaciones-admin" placeholder="Ingrese observaciones adicionales si es necesario..."></textarea>
              </div>
              <div style="display: flex; gap: 1rem;">
                <button class="btn-success" @click=${() => this.aceptarOrden(this.orden.id_orden)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Aceptar Orden
                </button>
                <button class="btn-danger" @click=${() => this.cancelarOrden(this.orden.id_orden)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  Cancelar Orden
                </button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- si es admin y el estado es Asignando personal -->
        ${this.id_rol === '00003' && this.orden.estado === 'Asignando personal' ? html`

          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Acciones</h2>
            </div>
            <div class="card-body">
              <button class="btn-success" @click=${() => navigator.goto(`/servicios/orden/asignar-personal/${this.orden.id_orden}`)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
                Asignar Personal y Fechas
              </button>
            </div>
          </div>
        ` : ''}


        <!-- si es cliente y el estado de esa orden es Presupuestada mostrar botones para aceptar o cancelar presupuesto -->
        ${this.id_rol === '00001' && this.orden.estado === 'Presupuestada' ? html`
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Acciones</h2>
            </div>
            <div class="card-body">
              <div style="display: flex; gap: 1rem;">
                <button class="btn-success" @click=${() => this.aceptarPresupuesto(this.orden.id_orden)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Aceptar Presupuesto
                </button>
                <button class="btn-danger" @click=${() => this.cancelarPresupuesto(this.orden.id_orden)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  Cancelar Presupuesto
                </button>
              </div>
            </div>
          </div>
        ` : ''}

      </div>
    `;
  }
}

customElements.define('view-servicios-orden-detalles', ViewServiciosOrdenDetalles);
