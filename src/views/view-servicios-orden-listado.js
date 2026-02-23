import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { serviciosService } from '../services/servicios-service.js';

export class ViewServiciosOrdenListado extends LitElement {
  static properties = {
    id_rol: { type: String },
    ordenes: { type: Array },
    filteredOrdenes: { type: Array },
    filters: { type: Object },
    showRatingModal: { type: Boolean },
    ratingOrderId: { type: String },
    selectedRating: { type: Number },
    ratingObservations: { type: String },
    currentPage: { type: Number },
    itemsPerPage: { type: Number },
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

    /* Filters Panel */
    .filters-panel {
      background: var(--card-bg);
      padding: 1.5rem 2rem;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      margin-bottom: 2.5rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.25rem 1.5rem;
      align-items: end;
      animation: fadeInUp 0.7s ease-out;
    }

    /* Ajustar tamaño máximo si hay pocos filtros (rol cliente) */
    .filters-panel.filters-client {
      max-width: 1100px;
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

    .input-error {
      border-color: #ef4444 !important;
      background-color: #fef2f2;
    }
    
    .error-msg {
      color: #ef4444;
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 0.25rem;
    }

    /* Estilo para asegurar visibilidad del icono de calendario/reloj */
    input[type="datetime-local"], input[type="date"] {
      position: relative;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: calc(100% - 12px) center;
      padding-right: 2.5rem;
    }

    input[type="datetime-local"]::-webkit-calendar-picker-indicator,
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

    /* Table Styles */
    .table-container {
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      overflow: hidden;
      margin-bottom: 2.5rem;
      animation: fadeInUp 0.8s ease-out;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: center;
    }

    th {
      background: #f8fafc;
      padding: 1.25rem 1.5rem;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-light);
      border-bottom: 1px solid var(--border);
      text-align: center;
    }

    td {
      padding: 1.25rem 1.5rem;
      font-size: 0.95rem;
      border-bottom: 1px solid var(--border);
      transition: background 0.2s;
      text-align: center;
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
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Status Badge - Respecting user colors but refining style */
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .status-pendiente { background: #fef3c7; color: #92400e; }
    .status-aceptada { background: #dcfce7; color: #166534; }
    .status-presupuestada { background: #f3e8ff; color: #6b21a8; }
    .status-en-ejecucion, .status-en_ejecucion { background: #e0f2fe; color: #075985; }
    .status-completada { background: #dcfce7; color: #15803d; }
    .status-cancelada { background: #fee2e2; color: #991b1b; }
    .status-en_espera { background: #e0f2fe; color: #075985; }
    .status-por-pagar { background: #ffedd5; color: #c2410c; }
    .status-verificando_pago { background: #e0e7ff; color: #3730a3; }
    .status-asignando_personal { background: #dcfce7; color: #166534; }

    /* Action Buttons - Respecting user colors but refining style */
    .actions-cell {
      display: flex;
      justify-content: center;
      gap: 0.6rem;
      flex-wrap: nowrap;
    }

    .btn {
      padding: 0.6rem 1rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .btn:hover {
      transform: translateY(-2px);
      filter: brightness(0.95);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .btn-delete { background-color: #fee2e2; color: #dc2626; }
    .btn-delete:hover { background-color: #dc2626; color: white; }
    
    .btn-info { background-color: #e0f2fe; color: #0284c7; }
    .btn-info:hover { background-color: #0284c7; color: white; }
    
    .btn-success { background-color: #dcfce7; color: #166534; }
    .btn-success:hover { background-color: #166534; color: white; }
    
    .btn-purple { background-color: #f3e8ff; color: #6b21a8; }
    .btn-purple:hover { background-color: #6b21a8; color: white; }
    
    .btn-primary { background-color: var(--primary); color: white; }
    .btn-primary:hover { background-color: var(--primary-hover); }
    
    .btn-amber { background-color: #fff1bbff; color: #b45309; }
    .btn-amber:hover { background-color: #b45309; color: white; }

    .btn-back {
      background: var(--text);
      color: #ffffff;
      border: none;
      padding: 0.8rem 1.75rem;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeInUp 1s ease-out;
    }

    .btn-back:hover {
      background: #000;
      transform: translateX(-4px);
    }

    /* Pagination Styles */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2.5rem;
      animation: fadeInUp 0.9s ease-out;
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

    /* Rating Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      background: white;
      padding: 3rem;
      border-radius: 24px;
      width: 90%;
      max-width: 480px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      text-align: center;
    }

    .modal-title {
      font-size: 1.75rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      color: var(--text);
    }

    .modal-subtitle {
      font-size: 0.95rem;
      color: var(--text-light);
      margin-bottom: 2rem;
    }

    .stars-container {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .star {
      font-size: 3rem;
      cursor: pointer;
      color: #e2e8f0;
      transition: all 0.2s;
      user-select: none;
    }

    .star.selected { color: #fbbf24; transform: scale(1.1); }
    .star:hover { transform: scale(1.2); }

    .rating-textarea {
      width: 100%;
      min-height: 140px;
      padding: 1.25rem;
      border: 1px solid var(--border);
      border-radius: 16px;
      margin-bottom: 2.5rem;
      font-family: inherit;
      resize: none;
      box-sizing: border-box;
      background: #f8fafc;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
    }

    .modal-actions .btn {
      flex: 1;
      padding: 0.8rem;
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
      padding: 5rem;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1.5rem;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `;

  constructor() {
    super();
    this.id_rol = '';
    this.ordenes = [];
    this.filteredOrdenes = [];
    this.filters = {
      direccion: '',
      estado: '',
      fecha_inicio: '',
      fecha_fin: ''
    };
    this.showRatingModal = false;
    this.ratingOrderId = '';
    this.selectedRating = 0;
    this.ratingObservations = '';
    this.currentPage = 1;
    this.itemsPerPage = 7;
    this.loading = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadOrdenes();
  }

  async loadOrdenes() {
    this.loading = true;
    try {
      const data = await serviciosService.getOrdenes();
      if (data) {
        this.ordenes = data.ordenes || [];
        this.id_rol = data.id_rol;
        this.applyFilters();
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      this.loading = false;
    }
  }

  changePage(page) {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async cancelarOrden(id) {
    if (confirm('¿Está seguro de que desea cancelar la orden?')) {
      await serviciosService.cancelarOrden(id);
      this.loadOrdenes();
    }
  }

  async asignarPersonal(id) {
    navigator.goto(`/servicios/orden/asignar-personal/${id}`);
  }

  async completarOrden(id) {
    if (confirm('¿Desea marcar esta orden como completada?')) {
      try {
        await serviciosService.completarOrden(id);
        alert('Orden completada correctamente.');
        this.loadOrdenes();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  }

  openRatingModal(id) {
    this.ratingOrderId = id;
    this.selectedRating = 0;
    this.ratingObservations = '';
    this.showRatingModal = true;
  }

  closeRatingModal() {
    this.showRatingModal = false;
  }

  setRating(rating) {
    this.selectedRating = rating;
  }

  async submitRating() {
    if (this.selectedRating === 0) {
      alert('Por favor selecciona una calificación de 1 a 5 estrellas.');
      return;
    }

    try {
      await serviciosService.calificarOrden(
        this.ratingOrderId,
        this.selectedRating,
        this.ratingObservations
      );
      this.closeRatingModal();
      await this.loadOrdenes();
      alert('¡Gracias por tu calificación!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Ocurrió un error al enviar la calificación.');
    }
  }

  verDetallesOrden(id) {
    navigator.goto(`/servicios/orden/detalles/${id}`);
  }

  realizarPresupuesto(id) {
    navigator.goto(`/servicios/orden/presupuesto/${id}`);
  }

  pagarOrden(id) {
    navigator.goto(`/servicios/orden/pago/${id}`);
  }

  // Normalizar strings para comparaciones (quitar acentos y pasar a minúsculas)
  normalize(str) {
    return (str || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  verAvances(id) {
    navigator.goto(`/servicios/orden/avances/${id}`);
  }

  async ponerEnEjecucion(id) {
    if (confirm('¿Desea poner esta orden en ejecución? Esto descontará los materiales del inventario.')) {
      try {
        await serviciosService.ponerEnEjecucion(id);
        alert('Orden puesta en ejecución correctamente.');
        this.loadOrdenes();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  }

  handleFilterChange(e) {
    const { id, value } = e.target;
    const filterKey = id.replace('filtro-', '').replace('-', '_');
    this.filters = { ...this.filters, [filterKey]: value };
    this.currentPage = 1;
    this.applyFilters();
  }

  isDateRangeInvalid() {
    if (!this.filters.fecha_inicio || !this.filters.fecha_fin) return false;
    return new Date(this.filters.fecha_fin) < new Date(this.filters.fecha_inicio);
  }

  applyFilters() {
    if (this.isDateRangeInvalid()) {
      this.filteredOrdenes = [];
      return;
    }
    this.filteredOrdenes = (this.ordenes || []).filter(orden => {
      const matchDireccion = !this.filters.direccion ||
        this.normalize(orden.direccion).includes(this.normalize(this.filters.direccion));

      const matchEstado = !this.filters.estado ||
        this.normalize(orden.estado) === this.normalize(this.filters.estado);

      const matchInicio = !this.filters.fecha_inicio ||
        orden.fecha_emision >= this.filters.fecha_inicio;

      const matchFin = !this.filters.fecha_fin ||
        orden.fecha_emision <= this.filters.fecha_fin;

      const matchNombre = !this.filters.nombre ||
        orden.nombre?.toLowerCase().includes(this.filters.nombre.toLowerCase());

      const matchCedula = !this.filters.cedula ||
        orden.cedula?.toLowerCase().includes(this.filters.cedula.toLowerCase());

      return matchDireccion && matchEstado && matchInicio && matchFin && matchNombre && matchCedula;
    });
  }

  getStatusClass(status) {
    const s = this.normalize(status);
    if (s.includes('pend')) return 'status-pendiente';
    if (s.includes('acept')) return 'status-aceptada';
    if (s.includes('presu')) return 'status-presupuestada';
    if (s.includes('ejecucion')) return 'status-en-ejecucion';
    if (s.includes('espera')) return 'status-en_espera';
    if (s.includes('comp')) return 'status-completada';
    if (s.includes('canc')) return 'status-cancelada';
    if (s.includes('pagar')) return 'status-por-pagar';
    if (s.includes('verificando')) return 'status-verificando_pago';
    if (s.includes('asignando personal')) return 'status-asignando_personal';
    return '';
  }

  canCancel(status) {
    const s = this.normalize(status);
    // No se puede cancelar si ya está completada, cancelada o en ejecucion, o verificando pago
    if (s.includes('comp') || s.includes('canc') || s.includes('ejecucion') || s.includes('verificando')) {
      return false;
    }
    return true;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="header-section">
          <div class="title-group">
            <h1>Libro de Órdenes</h1>
            <p>Monitoreo y gestión de solicitudes de servicios</p>
          </div>
        </div>
        <div class="loader-container">
          <div class="spinner"></div>
          <p>Sincronizando información...</p>
        </div>
      `;
    }

    const totalPages = Math.ceil(this.filteredOrdenes.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedOrdenes = this.filteredOrdenes.slice(startIndex, startIndex + this.itemsPerPage);

    return html`
      <div class="header-section">
        <div class="title-group">
          <h1>Libro de Órdenes</h1>
          <p>Monitoreo y gestión de solicitudes de servicios</p>
        </div>
      </div>

      <div class="filters-panel ${this.id_rol === '00001' ? 'filters-client' : ''}">
        <div class="filter-group">
          <label for="filtro-direccion">Dirección</label>
          <input type="text" id="filtro-direccion" placeholder="Filtrar por dirección..." @input=${this.handleFilterChange}>
        </div>

        <div class="filter-group">
          <label for="filtro-estado">Estado</label>
          <select id="filtro-estado" @change=${this.handleFilterChange}>
            <option value="">Todos los estados</option>
            ${this.id_rol === '00002' ? html`
              <option value="en espera">En espera</option>
              <option value="en ejecucion">En ejecución</option>
              <option value="completada">Completada</option>
            ` : html`
              <option value="pendiente">Pendiente</option>
              <option value="aceptada">Aceptada</option>
              <option value="presupuestada">Presupuestada</option>
              <option value="en ejecucion">En ejecución</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
              <option value="en espera">En espera</option>
              <option value="verificando pago">Verificando pago</option>
              <option value="asignando personal">Asignando personal</option>
            `}
          </select>
        </div>

        <div class="filter-group">
          <label for="filtro-fecha-inicio">Desde</label>
          <input type="datetime-local" id="filtro-fecha-inicio" @change=${this.handleFilterChange}>
        </div>

        <div class="filter-group">
          <label for="filtro-fecha-fin">Hasta</label>
          <input 
            type="datetime-local" 
            id="filtro-fecha-fin" 
            class="${this.isDateRangeInvalid() ? 'input-error' : ''}" 
            .min=${this.filters.fecha_inicio} 
            @change=${this.handleFilterChange}
          >
          ${this.isDateRangeInvalid() ? html`<div class="error-msg">Rango de fechas inválido</div>` : ''}
        </div>

        ${this.id_rol === '00003' || this.id_rol === '00002' ? html`
          <div class="filter-group">
            <label for="filtro-nombre">Nombre de Cliente</label>
            <input type="text" id="filtro-nombre" placeholder="Filtrar por nombre..." @input=${this.handleFilterChange}>
          </div>
          <div class="filter-group">
            <label for="filtro-cedula">Identificación</label>
            <input type="text" id="filtro-cedula" placeholder="Filtrar por cédula..." @input=${this.handleFilterChange}>
          </div>
        ` : ''}
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 80px;">ID</th>
              ${['00003', '00002'].includes(this.id_rol) ? html`
                <th>Cliente</th>
                <th>Cédula</th>
              ` : ''}
              <th>Dirección de Entrega</th>
              <th>Fecha Emisión</th>
              <th>Estado Actual</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedOrdenes.length === 0 ? html`
              <tr>
                <td colspan="7" style="text-align: center; padding: 4rem; color: var(--text-light);">
                  No se encontraron órdenes registradas para este criterio.
                </td>
              </tr>
            ` : ''}
            ${paginatedOrdenes.map(orden => html`
              <tr class="row-animate">
                <td style="font-weight: 800; color: var(--text-light);">#${orden.id_orden}</td>
                ${['00003', '00002'].includes(this.id_rol) ? html`
                  <td style="font-weight: 700;">${orden.nombre}</td>
                  <td style="font-family: monospace;">${orden.cedula}</td>
                ` : ''}
                <td>${orden.direccion}</td>
                <td style="color: var(--text-light); font-weight: 500;">${orden.fecha_emision}</td>
                <td>
                  <span class="status-badge ${this.getStatusClass(orden.estado)}">
                    ${orden.estado}
                  </span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="btn btn-info" @click=${() => this.verDetallesOrden(orden.id_orden)}>Detalles</button>
                    ${orden.estado?.toLowerCase() === 'aceptada' && this.id_rol === '00003' ? html`
                      <button class="btn btn-purple" @click=${() => this.realizarPresupuesto(orden.id_orden)}>Presupuestar</button>
                    ` : ''}
                    ${this.id_rol === '00001' && orden.estado?.toLowerCase().includes('pagar') ? html`
                      <button class="btn btn-success" @click=${() => this.pagarOrden(orden.id_orden)}>Pagar</button>
                    ` : ''}
                    ${orden.estado?.toLowerCase() === 'asignando personal' && this.id_rol === '00003' ? html`
                      <button class="btn btn-success" @click=${() => this.asignarPersonal(orden.id_orden)}>Asignar</button>
                    ` : ''}
                    ${orden.estado?.toLowerCase().includes('espera') && this.id_rol === '00003' ? html`
                      <button class="btn btn-primary" @click=${() => this.ponerEnEjecucion(orden.id_orden)}>Ejecutar</button>
                    ` : ''}
                    ${(this.normalize(orden.estado).includes('ejecucion') || this.normalize(orden.estado).includes('comp')) ? html`
                      <button class="btn btn-amber" @click=${() => this.verAvances(orden.id_orden)}>Avances</button>
                    ` : ''}
                    ${this.canCancel(orden.estado) && this.id_rol !== '00002' ? html`
                      <button class="btn btn-delete" @click=${() => this.cancelarOrden(orden.id_orden)}>X</button>
                    ` : ''}
                    ${this.id_rol === '00003' && this.normalize(orden.estado).includes('ejecucion') && Number(orden.porcentaje_avance) === 100 ? html`
                      <button class="btn btn-success" @click=${() => this.completarOrden(orden.id_orden)}>Finalizar</button>
                    ` : ''}
                    ${this.id_rol === '00001' && this.normalize(orden.estado).includes('comp') && !orden.calificacion ? html`
                      <button class="btn btn-primary" @click=${() => this.openRatingModal(orden.id_orden)}>Calificar</button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>

      ${totalPages > 1 ? html`
        <div class="pagination">
          <button class="page-btn nav-btn" ?disabled=${this.currentPage === 1} @click=${() => this.changePage(this.currentPage - 1)}>Anterior</button>
          ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => html`
            <button class="page-btn ${this.currentPage === page ? 'active' : ''}" @click=${() => this.changePage(page)}>${page}</button>
          `)}
          <button class="page-btn nav-btn" ?disabled=${this.currentPage === totalPages} @click=${() => this.changePage(this.currentPage + 1)}>Siguiente</button>
        </div>
      ` : ''}

      <div style="display: flex; justify-content: flex-end;">
        <button class="btn-back" @click=${() => navigator.goto('/categoria/00017')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver
        </button>
      </div>

      ${this.showRatingModal ? html`
        <div class="modal-overlay">
          <div class="modal-content">
            <h2 class="modal-title">¿Cómo fue tu experiencia?</h2>
            <p class="modal-subtitle">Tu opinión nos ayuda a mejorar la calidad de nuestros servicios.</p>
            
            <div class="stars-container">
              ${[1, 2, 3, 4, 5].map(num => html`
                <span class="star ${this.selectedRating >= num ? 'selected' : ''}" 
                      @click=${() => this.setRating(num)}>
                  ★
                </span>
              `)}
            </div>

            <textarea 
              class="rating-textarea" 
              placeholder="Cuéntanos más sobre el servicio (opcional)..."
              .value=${this.ratingObservations}
              @input=${(e) => this.ratingObservations = e.target.value}
            ></textarea>

            <div class="modal-actions">
              <button class="btn btn-info" @click=${this.closeRatingModal}>Ignorar</button>
              <button class="btn btn-primary" @click=${this.submitRating}>Enviar Opinión</button>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('view-servicios-orden-listado', ViewServiciosOrdenListado);
