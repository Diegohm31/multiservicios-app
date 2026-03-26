import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { serviciosService } from '../services/servicios-service.js';
import { authService } from '../services/auth-service.js';
import { popupService } from '../utils/popup-service.js';
import { formatDate, formatDateTime } from '../utils/date-utils.js';

export class ViewServiciosOrdenDetalles extends LitElement {
  static properties = {
    ordenId: { type: String },
    id_rol: { type: String },
    orden: { type: Object },
    loading: { type: Boolean },
    currentUser: { type: Object },
    isDragging: { type: Boolean },
    showServiceDetailsModal: { type: Boolean },
    selectedServiceDetails: { type: Object }
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
      gap: 2.5rem;
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

    .jefe-badge {
      background: #e0e7ff;
      color: #4338ca;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.65rem;
      font-weight: 800;
      margin-left: 0.35rem;
      text-transform: uppercase;
      border: 1px solid #c7d2fe;
    }

    .drag-zone {
      border: 2px dashed transparent;
      border-radius: 12px;
      transition: all 0.3s;
      padding: 0.5rem;
    }

    .drag-zone.dragging {
      border-color: var(--primary);
      background: rgba(59, 130, 246, 0.05);
    }

    /* Scrollbar styles */
    div::-webkit-scrollbar {
      width: 8px;
    }

    div::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }

    div::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
      transition: background 0.2s;
    }

    div::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `;

  constructor() {
    super();
    this.ordenId = '';
    this.id_rol = '';
    this.orden = null;
    this.loading = true;
    this.currentUser = null;
    this.isDragging = false;
    this.showServiceDetailsModal = false;
    this.selectedServiceDetails = null;
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
        this.id_rol = String(data.id_rol);
      }
      if (!this.currentUser) {
        this.currentUser = await authService.getUser();
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

  openServiceDetails(servicio) {
    this.selectedServiceDetails = servicio;
    this.showServiceDetailsModal = true;
  }

  closeServiceDetails() {
    this.showServiceDetailsModal = false;
    this.selectedServiceDetails = null;
  }

  getUserRolesInfo(servicio) {
    if (!this.currentUser || !servicio.operativos_asignados) return null;

    const myId = String(this.currentUser.id);
    const myAssignments = servicio.operativos_asignados.filter(op => String(op.id_user) === myId);

    if (myAssignments.length === 0) return null;

    const esJefe = myAssignments.some(op => Number(op.es_jefe) === 1);

    return {
      assignments: myAssignments,
      esJefe: esJefe
    };
  }

  async cancelarOrden(id) {
    const observaciones = this.shadowRoot.getElementById('observaciones-admin')?.value;
    popupService.confirm(
      'Cancelar Orden',
      '¿Está seguro de que desea cancelar la orden?',
      async () => {
        await serviciosService.cancelarOrden(id, observaciones);
        await this.loadOrden();
      }
    );
  }

  async aceptarOrden(id) {
    const observaciones = this.shadowRoot.getElementById('observaciones-admin')?.value;
    popupService.confirm(
      'Aceptar Orden',
      '¿Está seguro de que desea aceptar la orden?',
      async () => {
        await serviciosService.aceptarOrden(id, observaciones);
        await this.loadOrden();
      }
    );
  }

  async aceptarPresupuesto(id) {
    popupService.confirm(
      'Aceptar Presupuesto',
      '¿Está seguro de que desea aceptar el presupuesto?',
      async () => {
        await serviciosService.aceptarPresupuesto(id);
        await this.loadOrden();
      }
    );
  }

  async cancelarPresupuesto(id) {
    popupService.confirm(
      'Cancelar Presupuesto',
      '¿Está seguro de que desea cancelar el presupuesto?',
      async () => {
        await serviciosService.cancelarPresupuesto(id);
        await this.loadOrden();
      }
    );
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
      popupService.success('Éxito', 'Archivo de peritaje subido correctamente');
    } catch (error) {
      console.error('Error uploading peritaje:', error);
      popupService.warning('Error', 'Error al subir el archivo: ' + error.message);
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

  viewFactura() {
    const pdfPath = this.orden.presupuesto?.pdf_factura || this.orden.pdf_factura;
    if (pdfPath) {
      const url = `${serviciosService.baseUrl}/storage/${pdfPath}`;
      window.open(url, '_blank');
    }
  }

  handleDragOver(e) {
    if (this.id_rol !== '00003') return;
    e.preventDefault();
    this.isDragging = true;
  }

  handleDragLeave() {
    this.isDragging = false;
  }

  handleDrop(e) {
    if (this.id_rol !== '00003') return;
    e.preventDefault();
    this.isDragging = false;
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        popupService.warning('Error', 'Por favor, suba solo archivos PDF.');
        return;
      }
      this.handleFileUpload({ target: { files: [file] } });
    }
  }

  renderTotal(total) {
    const s = this.orden.estado?.toLowerCase() || '';
    const isPreBudget = s.includes('pend') || s.includes('acept');
    const servicios = this.orden.servicios || this.orden.array_servicios || [];

    if (isPreBudget) {
      return servicios.some(item => Number(item.servicio_tabulado) === 0)
        ? html`<div style="font-weight: 800; font-size: 1.25rem; color: var(--primary);">Por Cotizar</div>`
        : html`<div style="font-weight: 800; font-size: 1.25rem; color: var(--primary);">Total Estimado: $${total.toFixed(2)}</div>`;
    }

    if (s.includes('cancelada')) {
      return html`<div style="font-weight: 800; font-size: 1.25rem; color: var(--primary);">Orden Cancelada</div>`;
    }
    return html`<div style="font-weight: 800; font-size: 1.25rem; color: var(--primary);">Total: $${total.toFixed(2)}</div>`;
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
    const subtotal = servicios.reduce((acc, s) => acc + parseFloat((s.pivot && s.pivot.precio_a_pagar) ? s.pivot.precio_a_pagar : (s.precio_a_pagar || 0)), 0);
    const iva = parseFloat((this.orden.presupuesto && this.orden.presupuesto.iva) ? this.orden.presupuesto.iva : (this.orden.iva || 0));
    const total = subtotal + iva;

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
                ${this.orden.pdf_peritaje ? html`
                  <button class="btn-outline-danger" @click=${this.viewPeritaje}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    Visualizar Peritaje
                  </button>
                ` : ''}

                <div 
                  class="drag-zone ${this.isDragging ? 'dragging' : ''}"
                  @dragover=${this.handleDragOver}
                  @dragleave=${this.handleDragLeave}
                  @drop=${this.handleDrop}
                >
                  <button class="btn-outline-danger" @click=${this.triggerFileUpload}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    ${!this.orden.pdf_peritaje ? (this.isDragging ? 'Soltar PDF aquí' : 'Subir Peritaje') : (this.isDragging ? 'Soltar nuevo PDF' : 'Actualizar Peritaje')}
                  </button>
                  <input 
                    type="file" 
                    id="peritaje-input" 
                    accept=".pdf" 
                    style="display: none;" 
                    @change=${this.handleFileUpload}
                  >
                </div>
                <!-- Botón de Factura/Presupuesto -->
                ${(this.orden.presupuesto?.pdf_factura || this.orden.pdf_factura) ? html`
                  <button class="btn-outline-danger" @click=${this.viewFactura}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Visualizar Factura
                  </button>
                ` : ''}
              ` : this.id_rol === '00001' ? html`
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

                <!-- Botón de Factura para Cliente -->
                ${(this.orden.presupuesto?.pdf_factura || this.orden.pdf_factura) ? html`
                  <button class="btn-outline-danger" @click=${this.viewFactura}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Visualizar Factura
                  </button>
                ` : ''}
              ` : ''}
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
            ${this.id_rol !== '00002' ? this.renderTotal(total) : ''}
          </div>
          <div class="card-body">
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Fecha de Emisión</span>
                <span class="detail-value">${formatDateTime(this.orden.fecha_emision)}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Rango de Fechas</span>
                ${this.orden.fecha_inicio && this.orden.fecha_fin ? html`
                  <span class="detail-value">${formatDateTime(this.orden.fecha_inicio)} al <br>${formatDateTime(this.orden.fecha_fin)}</span>
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
                    
                    ${(this.id_rol === '00003' && ['en espera', 'en ejecucion', 'completada'].includes(this.orden.estado?.toLowerCase())) ? html`
                      <button class="btn-outline-primary" style="margin-top: 0.75rem; padding: 0.4rem 0.8rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 0.4rem; border: 2px solid var(--primary); background: transparent; color: var(--primary); font-weight: 700; border-radius: 8px; cursor: pointer;" @click=${() => this.openServiceDetails(servicio)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        Ver Detalle
                      </button>
                    ` : ''}
                  </div>
                  <div class="service-meta">
                    <div class="service-qty">Cantidad: ${servicio.pivot?.cantidad || servicio.cantidad || 0}</div>
                    ${this.id_rol !== '00002' ? html`
                      ${(servicio.pivot?.precio_a_pagar || servicio.precio_a_pagar) ? html`
                        <div class="service-price">$${parseFloat(servicio.pivot?.precio_a_pagar || servicio.precio_a_pagar).toFixed(2)}</div>
                      ` : html`<div class="service-price">Por Cotizar</div>`}
                    ` : html`
                      <div class="service-roles" style="margin-top: 0.5rem; text-align: right;">
                        <div class="detail-label" style="font-size: 0.65rem;">Mi Rol:</div>
                        <div style="font-weight: 700; color: var(--primary); font-size: 0.9rem; display: flex; align-items: center; justify-content: flex-end;">
                          ${(() => {
          const info = this.getUserRolesInfo(servicio);
          if (!info) return html`<span>N/A</span>`;
          return html`
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                ${info.assignments.map(ass => html`
                  <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="color: var(--text-light); font-size: 0.8rem; font-weight: 500;">
                        ${ass.nombre_especialidad} (${ass.nivel})
                      </span>
                      <span style="color: var(--success); font-weight: 800; font-family: 'JetBrains Mono', monospace;">
                        $${parseFloat(ass.ingreso || 0).toFixed(2)}
                      </span>
                    </div>
                    ${ass.fecha_inicio && ass.fecha_fin ? html`
                      <div style="font-size: 0.7rem; color: var(--text-light); opacity: 0.85; font-weight: 500; font-style: italic;">
                        ${formatDateTime(ass.fecha_inicio)} → ${formatDateTime(ass.fecha_fin)}
                      </div>
                    ` : ''}
                  </div>
                `)}
                ${info.esJefe ? html`<span class="jefe-badge" style="margin-top: 2px;">Jefe de Obra</span>` : ''}
              </div>
            `;
        })()}
                        </div>
                      </div>
                    `}
                  </div>
                </div>
              `)}
            </div>
          </div>
        </section>
        <!-- Si es admin mostrar botones para aceptar o cancelar orden -->
        ${this.id_rol === '00003' && this.orden.estado?.toLowerCase() === 'pendiente' ? html`
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

        <!-- Si es admin y el estado es Asignando personal -->
        ${this.id_rol === '00003' && this.orden.estado?.toLowerCase() === 'asignando personal' ? html`
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

        <!-- Si es cliente y el estado de esa orden es Presupuestada mostrar botones para aceptar o cancelar presupuesto -->
        ${this.id_rol === '00001' && (this.orden.estado?.toLowerCase() === 'presupuestada') ? html`
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Acciones del Presupuesto</h2>
            </div>
            <div class="card-body">
              <p style="margin-bottom: 1.5rem; color: var(--text-light);">El presupuesto para esta orden está listo. Por favor, revíselo y decida si desea aceptarlo para proceder con el servicio.</p>
              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button class="btn-success" @click=${() => this.aceptarPresupuesto(this.orden.id_orden)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Aceptar Presupuesto
                </button>
                <button class="btn-danger" @click=${() => this.cancelarPresupuesto(this.orden.id_orden)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  Rechazar Presupuesto
                </button>
              </div>
            </div>
          </div>
        ` : ''}
        
        <!-- Modal Detalle Específico de Servicio -->
        ${this.showServiceDetailsModal && this.selectedServiceDetails ? html`
          <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
            <div style="background: white; border-radius: 16px; width: 90%; max-width: 600px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
              <div style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: #fcfcfc;">
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 700; color: var(--primary);">Ejecución de ${this.selectedServiceDetails.nombre || 'Servicio'}</h3>
                <button @click=${this.closeServiceDetails} style="background: transparent; border: none; cursor: pointer; color: var(--text-light); padding: 0.5rem; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: background 0.2s;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div style="padding: 1.5rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem; flex: 1;">
                
                <!-- Operativos -->
                <div>
                  <h4 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: var(--text); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; text-transform: uppercase; font-weight: 800;">Personal Asignado</h4>
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${(this.selectedServiceDetails.operativos_asignados || []).length === 0 ? html`<p style="margin:0; color:var(--text-light); font-size: 0.9rem; font-style: italic;">No asociado...</p>` : ''}
                    ${(this.selectedServiceDetails.operativos_asignados || []).map(op => html`
                      <div style="padding: 0.75rem; background: #fff; border: 1px solid var(--border); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; flex-direction: column;">
                          <div style="font-weight: 700; font-size: 0.95rem;">${op.nombre_operativo} ${Number(op.es_jefe) === 1 ? html`<span class="jefe-badge">Jefe</span>` : ''}</div>
                          <div style="font-size: 0.8rem; color: var(--text-light);">${op.nombre_especialidad} (${op.nivel})</div>
                        </div>
                        ${op.fecha_inicio && op.fecha_fin ? html`
                        <div style="font-size: 0.75rem; text-align: right; color: var(--text-light); line-height: 1.4;">
                          <div><strong>Inicio:</strong> ${formatDateTime(op.fecha_inicio)}</div>
                          <div><strong>Fin:</strong> ${formatDateTime(op.fecha_fin)}</div>
                        </div>
                        ` : ''}
                      </div>
                    `)}
                  </div>
                </div>

                <!-- Equipos -->
                <div>
                  <h4 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: var(--text); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; text-transform: uppercase; font-weight: 800;">Equipos Utilizados</h4>
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${(this.selectedServiceDetails.equipos_asignados || []).length === 0 ? html`<p style="margin:0; color:var(--text-light); font-size: 0.9rem; font-style: italic;">No asociado...</p>` : ''}
                    ${(this.selectedServiceDetails.equipos_asignados || []).map(eq => html`
                      <div style="padding: 0.75rem; background: #fff; border: 1px solid var(--border); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; flex-direction: column;">
                          <div style="font-weight: 700; font-size: 0.95rem;">${eq.nombre_equipo}</div>
                          <div style="font-size: 0.8rem; color: var(--text-light);">${eq.marca || ''} ${eq.modelo || ''}</div>
                        </div>
                        ${eq.fecha_inicio && eq.fecha_fin ? html`
                        <div style="font-size: 0.75rem; text-align: right; color: var(--text-light); line-height: 1.4;">
                          <div><strong>Inicio:</strong> ${formatDateTime(eq.fecha_inicio)}</div>
                          <div><strong>Fin:</strong> ${formatDateTime(eq.fecha_fin)}</div>
                        </div>
                        ` : ''}
                      </div>
                    `)}
                  </div>
                </div>

                <!-- Materiales -->
                <div>
                  <h4 style="margin: 0 0 0.75rem 0; font-size: 1rem; color: var(--text); border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; text-transform: uppercase; font-weight: 800;">Materiales Consumidos</h4>
                  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                    ${(this.selectedServiceDetails.materiales_asignados || []).length === 0 ? html`<p style="margin:0; color:var(--text-light); font-size: 0.9rem; font-style: italic;">No asociado...</p>` : ''}
                    ${(this.selectedServiceDetails.materiales_asignados || []).map(mat => html`
                      <div style="padding: 0.75rem; background: #fff; border: 1px solid var(--border); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-weight: 700; font-size: 0.95rem;">${mat.nombre_material}</div>
                        <div style="font-weight: 800; color: var(--primary); background: #f0f7ff; padding: 0.2rem 0.6rem; border-radius: 4px;">x${mat.cantidad_usada}</div>
                      </div>
                    `)}
                  </div>
                </div>

              </div>
            </div>
          </div>
        ` : ''}

      </div>
  `;
  }
}

customElements.define('view-servicios-orden-detalles', ViewServiciosOrdenDetalles);
