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
    ratingObservations: { type: String }
  };

  static styles = css`
    :host {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --text: #1e293b;
      --text-light: #64748b;
      --border: #e2e8f0;
      --bg: #ffffff;
      
      display: block;
      padding: 2rem;
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--text);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      margin: 0;
      font-size: 1.875rem;
      font-weight: 800;
      letter-spacing: -0.025em;
    }

    /* Filters Panel */
    .filters-panel {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid var(--border);
      margin-bottom: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
      align-items: end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-light);
      letter-spacing: 0.05em;
    }

    input, select {
      width: 100%;
      padding: 0.625rem 0.875rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 0.9rem;
      background-color: #ffffff;
      color: var(--text);
      transition: all 0.2s;
      font-family: inherit;
    }

    .filters-panel .filter-group input,
    .filters-panel .filter-group select {
      flex: 1;
      padding: 0.625rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 0.875rem;
      color: var(--text);
      background: white;
      min-width: 140px;
    }
    
    input[type="datetime-local"] {
      min-width: 200px !important;
      position: relative;
    }

    /* Forzar visibilidad del icono de calendario/reloj en navegadores WebKit */
    input[type="datetime-local"]::-webkit-calendar-picker-indicator {
      display: block;
      background: transparent;
      bottom: 0;
      color: transparent;
      cursor: pointer;
      height: auto;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      width: auto;
    }

    /* Estilo para el contenedor del input para añadir un icono visual */
    .filter-group {
      position: relative;
    }

    .filter-group input[type="datetime-local"] {
      padding-right: 2.5rem;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .input-error {
      border-color: #ef4444 !important;
    }
    .input-error:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    .error-msg {
      color: #ef4444;
      font-size: 0.75rem;
      font-weight: 600;
      grid-column: 1 / -1;
      margin-top: -0.75rem;
    }

    /* Fix calendar icon visibility */
    input[type="date"] {
      position: relative;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: calc(100% - 12px) center;
      background-size: 18px;
    }

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
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }

    th {
      background-color: #f1f5f9;
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover {
      background-color: #f8fafc;
    }

    /* Status Badge */
    .status-badge {
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
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

    /* Buttons */
    .actions-cell {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      padding: 0.5rem 0.875rem;
      border-radius: 6px;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn-delete {
      background-color: #fee2e2;
      color: #dc2626;
    }
    .btn-delete:hover {
      background-color: #ef4444;
      color: white;
    }

    .btn-info {
      background-color: #e0f2fe;
      color: #0284c7;
    }
    .btn-info:hover {
      background-color: #0ea5e9;
      color: white;
    }

    .btn-success {
      background-color: #dcfce7;
      color: #166534;
    }
    .btn-success:hover {
      background-color: #22c55e;
      color: white;
    }

    .btn-purple {
      background-color: #f3e8ff;
      color: #6b21a8;
    }
    .btn-purple:hover {
      background-color: #9333ea;
      color: white;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }
    .btn-primary:hover {
      background-color: #2563eb;
    }

    .btn-amber {
      background-color: #fff1bbff;
      color: #b45309;
    }
    .btn-amber:hover {
      background-color: #f59e0bff;
      color: white;
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

    /* Rating Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      background: white;
      padding: 2.5rem;
      border-radius: 24px;
      width: 90%;
      max-width: 450px;
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      text-align: center;
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      color: var(--text);
    }

    .modal-subtitle {
      font-size: 0.9rem;
      color: var(--text-light);
      margin-bottom: 2rem;
    }

    .stars-container {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .star {
      font-size: 2.5rem;
      cursor: pointer;
      color: #e2e8f0;
      transition: all 0.2s;
      user-select: none;
    }

    .star.selected {
      color: #fbbf24;
      transform: scale(1.1);
    }

    .star:hover {
      transform: scale(1.2);
    }

    .rating-textarea {
      width: 100%;
      min-height: 120px;
      padding: 1rem;
      border: 1px solid var(--border);
      border-radius: 12px;
      margin-bottom: 1.5rem;
      font-family: inherit;
      font-size: 0.9rem;
      resize: none;
      box-sizing: border-box;
      background: white;
      color: black;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
    }

    .modal-actions .btn {
      flex: 1;
      padding: 0.75rem;
      font-size: 0.9rem;
    }
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
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadOrdenes();
  }

  async loadOrdenes() {
    const data = await serviciosService.getOrdenes();
    if (data) {
      this.ordenes = data.ordenes;
      this.id_rol = data.id_rol;
      this.applyFilters();
    }
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
    this.filteredOrdenes = this.ordenes.filter(orden => {
      const matchDireccion = !this.filters.direccion ||
        this.normalize(orden.direccion).includes(this.normalize(this.filters.direccion));

      const matchEstado = !this.filters.estado ||
        this.normalize(orden.estado) === this.normalize(this.filters.estado);

      const matchInicio = !this.filters.fecha_inicio ||
        orden.fecha_emision >= this.filters.fecha_inicio;

      const matchFin = !this.filters.fecha_fin ||
        orden.fecha_emision <= this.filters.fecha_fin;

      const matchNombre = !this.filters.nombre ||
        orden.nombre.toLowerCase().includes(this.filters.nombre.toLowerCase());

      const matchCedula = !this.filters.cedula ||
        orden.cedula.toLowerCase().includes(this.filters.cedula.toLowerCase());

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
    return html`
      <div class="header">
        <h1>Ordenes</h1>
      </div>

      <div class="filters-panel">
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
              <option value="en ejecucion">En ejecucion</option>
              <option value="completada">Completada</option>
            ` : html`
              <option value="pendiente">Pendiente</option>
              <option value="aceptada">Aceptada</option>
              <option value="presupuestada">Presupuestada</option>
              <option value="en ejecucion">En ejecucion</option>
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
        </div>
        ${this.isDateRangeInvalid() ? html`<div class="error-msg" style="grid-column: 1 / -1; margin-top: -0.5rem;">La fecha de fin no puede ser menor a la de inicio</div>` : ''}

        <!-- si es admin mostrar filtro por nombre y cedula de cliente-->
        ${this.id_rol === '00003' ? html`
          <div class="filter-group">
            <label for="filtro-nombre">Nombre</label>
            <input type="text" id="filtro-nombre" placeholder="Filtrar por nombre..." @input=${this.handleFilterChange}>
          </div>
          <div class="filter-group">
            <label for="filtro-cedula">Cedula</label>
            <input type="text" id="filtro-cedula" placeholder="Filtrar por cedula..." @input=${this.handleFilterChange}>
          </div>
        ` : ''}
      </div>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <!-- si es admin u operativo mostrar nombre y cedula de cliente-->
              ${['00003', '00002'].includes(this.id_rol) ? html`
                <th>Nombre</th>
                <th>Cedula</th>
              ` : ''}
              <th>Dirección</th>
              <th>Emisión</th>
              <th>Estado</th>
              <th style="text-align: center;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${this.filteredOrdenes.length === 0 ? html`<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-light);">No se encontraron órdenes</td></tr>` : ''}
            ${this.filteredOrdenes.map(orden => html`
              <tr>
                <td style="font-weight: 700;">#${orden.id_orden}</td>
                <!-- si es admin u operativo mostrar nombre y cedula de cliente-->
                ${['00003', '00002'].includes(this.id_rol) ? html`
                  <td>${orden.nombre}</td>
                  <td>${orden.cedula}</td>
                ` : ''}
                <td>${orden.direccion}</td>
                <td>${orden.fecha_emision}</td>
                <td>
                  <span class="status-badge ${this.getStatusClass(orden.estado)}">
                    ${orden.estado}
                  </span>
                </td>
                <td>
                  <div class="actions-cell" style="justify-content: flex-end;">
                    <button class="btn btn-info" @click=${() => this.verDetallesOrden(orden.id_orden)}>Detalles</button>
                    ${orden.estado?.toLowerCase() === 'aceptada' && this.id_rol === '00003' ? html`
                      <button class="btn btn-purple" @click=${() => this.realizarPresupuesto(orden.id_orden)}>Presupuestar</button>
                    ` : ''}
                    ${this.id_rol === '00001' && orden.estado?.toLowerCase().includes('pagar') ? html`
                      <button class="btn btn-success" @click=${() => this.pagarOrden(orden.id_orden)}>Pagar</button>
                    ` : ''}
                    ${orden.estado?.toLowerCase() === 'asignando personal' && this.id_rol === '00003' ? html`
                      <button class="btn btn-success" @click=${() => this.asignarPersonal(orden.id_orden)}>Asignar personal</button>
                    ` : ''}
                    ${orden.estado?.toLowerCase().includes('espera') && this.id_rol === '00003' ? html`
                      <button class="btn btn-primary" @click=${() => this.ponerEnEjecucion(orden.id_orden)}>Poner en ejecución</button>
                    ` : ''}
                    ${(this.normalize(orden.estado).includes('ejecucion') || this.normalize(orden.estado).includes('comp')) ? html`
                      <button class="btn btn-amber" @click=${() => this.verAvances(orden.id_orden)}>Ver avances</button>
                    ` : ''}
                    ${this.canCancel(orden.estado) && this.id_rol !== '00002' ? html`
                      <button class="btn btn-delete" @click=${() => this.cancelarOrden(orden.id_orden)}>Cancelar</button>
                    ` : ''}
                    ${this.id_rol === '00003' && this.normalize(orden.estado).includes('ejecucion') && Number(orden.porcentaje_avance) === 100 ? html`
                      <button class="btn btn-success" @click=${() => this.completarOrden(orden.id_orden)}>Completar</button>
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

      <div style="margin-top: 2.5rem; display: flex; justify-content: flex-end;">
        <button class="btn-back" @click=${() => navigator.goto('/categoria/00017')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
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
              <button class="btn btn-delete" @click=${this.closeRatingModal}>Cancelar</button>
              <button class="btn btn-primary" @click=${this.submitRating}>Enviar Calificación</button>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }

}

customElements.define('view-servicios-orden-listado', ViewServiciosOrdenListado);
