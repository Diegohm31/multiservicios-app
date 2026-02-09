import { LitElement, css, html } from 'lit';
import { serviciosService } from '../services/servicios-service.js';
import { authService } from '../services/auth-service.js';

export class ViewCatalogoServicios extends LitElement {
  static properties = {
    activeCategory: { type: String },
    cart: { type: Array },
    currentPage: { type: Number },
    catalog: { type: Object },
    loading: { type: Boolean },
    submitting: { type: Boolean },
    user: { type: Object },
    orderData: { type: Object }
  };

  constructor() {
    super();
    this.activeCategory = '';
    this.cart = [];
    this.currentPage = 0;
    this.itemsPerPage = 4;
    this.catalog = {};
    this.loading = true;
    this.submitting = false;
    this.user = null;
    this.orderData = {
      direccion: '',
      fecha_inicio: '',
      fecha_fin: ''
    };

    this.categoryIcons = {
      'Herrería': '⚒️',
      'Plomería': '🚰',
      'Electricidad': '⚡',
      'Cableado y Electricidad': '⚡',
      'Construcción': '🏗️',
      'Refrigeración': '❄️',
      'Limpieza': '🧹',
      'Mantenimiento': '🔧'
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    await Promise.all([this.loadCatalog(), this.loadUser()]);
  }

  async loadUser() {
    try {
      const userData = await authService.getUser();
      if (userData) {
        this.user = userData;
        this.orderData = { ...this.orderData, direccion: userData.direccion || '' };
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  async loadCatalog() {
    this.loading = true;
    try {
      const data = await serviciosService.getCatalogoServicios();
      if (data) {
        this.catalog = data;
        if (!this.activeCategory && Object.keys(data).length > 0) {
          this.activeCategory = Object.keys(data)[0];
        }
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      this.loading = false;
    }
  }

  setCategory(id) {
    this.activeCategory = id;
    this.currentPage = 0;
  }

  isServiceInCart(id_servicio) {
    return this.cart.some(item => item.id_servicio === id_servicio);
  }

  addToCart(service) {
    if (this.isServiceInCart(service.id_servicio)) return;

    const qtyInput = this.shadowRoot.querySelector(`#qty-${service.id_servicio}`);
    const descInput = this.shadowRoot.querySelector(`#desc-${service.id_servicio}`);
    const qty = service.servicio_tabulado === 0 ? 1 : (parseInt(qtyInput.value) || 1);
    const description = descInput.value.trim();

    this.cart = [...this.cart, {
      ...service,
      qty,
      description,
      category: this.catalog[this.activeCategory].tipo_servicio,
      timestamp: Date.now()
    }];

    if (qtyInput) qtyInput.value = 1;
    if (descInput) descInput.value = '';
  }

  removeFromCart(timestamp) {
    this.cart = this.cart.filter(item => item.timestamp !== timestamp);
  }

  async submitOrder() {
    if (!this.isOrderValid() || this.submitting) return;

    this.submitting = true;
    try {
      const orderPayload = {
        id_cliente: this.user?.id_cliente || 'ANONYMOUS',
        direccion: this.orderData.direccion,
        estado: 'Pendiente',
        fecha_inicio: this.orderData.fecha_inicio,
        fecha_fin: this.orderData.fecha_fin,
        fecha_emision: new Date().toISOString().split('T')[0],
        array_servicios: this.cart.map(item => {
          const servicio = {
            id_servicio: item.id_servicio,
            descripcion: item.description || null,
            cantidad: item.qty,
            servicio_tabulado: item.servicio_tabulado
          };

          if (item.servicio_tabulado === 1) {
            servicio.precio_materiales = item.precio_materiales;
            servicio.precio_tipos_equipos = item.precio_tipos_equipos;
            servicio.precio_mano_obra = item.precio_mano_obra;
            servicio.precio_general = item.precio_general;
            servicio.descuento = item.descuento || null;
            //si no hay descuento restar 0
            servicio.precio_a_pagar = (parseFloat(item.precio_general) * item.qty) - (parseFloat(item.descuento) || 0);
          }

          return servicio;
        })
      };

      const result = await serviciosService.createOrden(orderPayload);
      if (result) {
        alert('¡Orden creada correctamente!');
        this.cart = [];
        this.orderData = {
          direccion: this.user?.direccion || '',
          fecha_inicio: '',
          fecha_fin: ''
        };
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error al crear la orden: ' + error.message);
    } finally {
      this.submitting = false;
    }
  }

  handleOrderInputChange(e) {
    const { name, value } = e.target;
    this.orderData = { ...this.orderData, [name]: value };
    this.requestUpdate();
  }

  isOrderValid() {
    const { direccion, fecha_inicio, fecha_fin } = this.orderData;
    if (!direccion || !fecha_inicio || !fecha_fin) return false;

    const start = new Date(fecha_inicio);
    const end = new Date(fecha_fin);
    return end >= start;
  }

  isDateRangeInvalid() {
    const { fecha_inicio, fecha_fin } = this.orderData;
    if (!fecha_inicio || !fecha_fin) return false;
    return new Date(fecha_fin) < new Date(fecha_inicio);
  }

  getTotal() {
    return this.cart.reduce((sum, item) => {
      const price = item.servicio_tabulado === 0 ? 0 : (parseFloat(item.precio_general) || 0);
      return sum + (price * item.qty);
    }, 0);
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading-container">
          <div class="loader"></div>
          <p>Preparando catálogo...</p>
        </div>
      `;
    }

    const activeCatData = this.catalog[this.activeCategory];
    const services = activeCatData ? (activeCatData.servicios || []) : [];
    const totalPages = Math.ceil(services.length / this.itemsPerPage);
    const paginatedServices = services.slice(
      this.currentPage * this.itemsPerPage,
      (this.currentPage + 1) * this.itemsPerPage
    );

    return html`
      <div class="container fade-in">
        <!-- 1. Categorías (Flex wrap) -->
        <nav class="categories-nav">
          ${Object.entries(this.catalog).map(([id, cat]) => html`
            <button 
              class="category-tag ${this.activeCategory === id ? 'active' : ''}"
              @click=${() => this.setCategory(id)}
            >
              <span class="tag-icon">${this.categoryIcons[cat.tipo_servicio] || '📋'}</span>
              <span class="tag-name">${cat.tipo_servicio}</span>
            </button>
          `)}
        </nav>

        <!-- 2. Header de Selección y Paginación -->
        <header class="content-header">
          <h2 class="active-category-title">${activeCatData ? activeCatData.tipo_servicio : ''}</h2>
          
          <div class="pagination-controls">
            <button 
              class="page-arrow" 
              @click=${() => this.currentPage = Math.max(0, this.currentPage - 1)}
              ?disabled=${this.currentPage === 0}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span class="page-indicator">Página ${this.currentPage + 1} de ${totalPages || 1}</span>
            <button 
              class="page-arrow" 
              @click=${() => this.currentPage = Math.min(totalPages - 1, this.currentPage + 1)}
              ?disabled=${this.currentPage >= totalPages - 1}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </header>

        <!-- 3. Grid de Servicios (2x2) -->
        <section class="services-grid">
          ${paginatedServices.map(service => {
      const inCart = this.isServiceInCart(service.id_servicio);
      return html`
              <div class="service-card ${inCart ? 'selected' : ''}">
                <div class="card-main">
                  <div class="card-left">
                    <h3 class="service-name">${service.nombre}</h3>
                    <p class="service-desc">${service.descripcion}</p>
                    <div class="details-input">
                       <textarea 
                          id="desc-${service.id_servicio}" 
                          placeholder="Detalles adicionales..."
                          ?disabled=${inCart}
                       ></textarea>
                    </div>
                  </div>
                  <div class="card-right">
                    <div class="price-display ${service.servicio_tabulado === 0 ? 'quote' : ''}">
                      ${service.servicio_tabulado === 1
          ? html`$${parseFloat(service.precio_general || 0).toFixed(2)} <span>/ ${service.unidad_medida}</span>`
          : html`Por Cotizar`
        }
                    </div>

                    <div class="qty-field ${service.servicio_tabulado === 0 ? 'hidden' : ''}">
                      <label>cantidad</label>
                      <input 
                        type="number" 
                        id="qty-${service.id_servicio}" 
                        value="1" 
                        min="1" 
                        ?disabled=${inCart}
                      >
                    </div>
                    <button 
                      class="add-action-btn ${inCart ? 'disabled' : ''}"
                      @click=${() => this.addToCart(service)}
                      ?disabled=${inCart}
                    >
                      ${inCart ? html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>` : html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>`}
                    </button>
                  </div>
                </div>
              </div>
            `;
    })}
        </section>

        <!-- 4. Resumen de la Orden (Footer) -->
        <section class="order-summary-footer">
          <div class="summary-header-row">
            <h3>Resumen de la orden</h3>
            <div class="inputs-row">
              <div class="order-field ${this.isDateRangeInvalid() ? 'error' : ''}">
                <label>inicio</label>
                <input 
                  type="date" 
                  name="fecha_inicio" 
                  .value=${this.orderData.fecha_inicio} 
                  @input=${this.handleOrderInputChange}
                >
              </div>
              <div class="order-field ${this.isDateRangeInvalid() ? 'error' : ''}">
                <label>fin</label>
                <input 
                  type="date" 
                  name="fecha_fin" 
                  .value=${this.orderData.fecha_fin} 
                  @input=${this.handleOrderInputChange}
                >
              </div>
            </div>
            ${this.isDateRangeInvalid() ? html`<p class="date-error-msg">La fecha de fin no puede ser menor a la de inicio</p>` : ''}
          </div>

          <div class="cart-list">
            ${this.cart.length === 0
        ? html`<p class="empty-cart-msg">No hay servicios seleccionados</p>`
        : this.cart.map(item => html`
                <div class="cart-row-container">
                  <div class="cart-row">
                    <span class="cart-item-info">${item.nombre} (x${item.qty} ${item.unidad_medida})</span>
                    <button class="cart-remove-btn" @click=${() => this.removeFromCart(item.timestamp)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                  ${item.description ? html`<div class="cart-item-desc">"${item.description}"</div>` : ''}
                </div>
              `)}
          </div>

          <div class="order-address-section">
            <div class="order-field full-width">
              <label>dirección detallada</label>
              <textarea 
                name="direccion" 
                .value=${this.orderData.direccion} 
                @input=${this.handleOrderInputChange}
                placeholder="Ingresa la ubicación detallada donde se realizará el servicio..."
                rows="3"
              ></textarea>
            </div>
          </div>

          <div class="final-actions">
            <div class="total-display">
               Total Estimado: <span>$${this.getTotal().toFixed(2)}</span>
            </div>
            <button 
              class="proceed-btn" 
              @click=${this.submitOrder}
              ?disabled=${this.cart.length === 0 || !this.isOrderValid() || this.submitting}
            >
               ${this.submitting ? 'Enviando...' : 'proceder con la solicitud'}
            </button>
          </div>
        </section>
      </div>
    `;
  }

  static styles = css`
    :host {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --primary-soft: #eff6ff;
      --accent: #10b981;
      --danger: #ef4444;
      --bg: #fff;
      --card-bg: #ffffff;
      --text: #1f2937;
      --text-light: #6b7280;
      --border: #e5e7eb;
      --radius: 14px;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      
      display: block;
      font-family: 'Inter', -apple-system, sans-serif;
      padding: 2.5rem 1rem;
      background: var(--bg);
      min-height: 100vh;
      color: var(--text);
    }

    .fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }

    /* 1. Categorías */
    .categories-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
    }

    .category-tag {
      padding: 0.8rem 1.4rem;
      background: var(--card-bg);
      border: 2px solid transparent;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-sm);
      color: var(--text-light);
    }

    .category-tag:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
      color: var(--text);
    }

    .category-tag.active {
      background: #ffffff;
      border-color: var(--primary);
      color: var(--primary);
      box-shadow: 0 8px 15px -3px rgba(59, 130, 246, 0.2);
    }

    .tag-icon { font-size: 1.25rem; }

    /* 2. Header Content */
    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.25rem;
      border-bottom: 1px solid var(--border);
    }

    .active-category-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text);
      margin: 0;
      letter-spacing: -0.01em;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .page-arrow {
      background: transparent;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .page-arrow:hover:not(:disabled) {
      background: var(--primary-soft);
      color: var(--primary);
    }

    .page-arrow:disabled {
      opacity: 0.2;
      cursor: not-allowed;
    }

    .page-indicator { font-size: 0.875rem; font-weight: 600; color: var(--text-light); }

    /* 3. Services Grid */
    .services-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    @media (max-width: 800px) {
      .services-grid { grid-template-columns: 1fr; }
    }

    .service-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      padding: 1.75rem;
      position: relative;
      box-shadow: var(--shadow-sm);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      border: 1px solid var(--border);
    }

    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
      border-color: #cbd5e1;
    }

    .service-card.selected {
      border-color: var(--primary);
      background: #f8faff;
      box-shadow: 0 0 0 1px var(--primary), 0 10px 15px -3px rgba(59, 130, 246, 0.1);
    }

    .card-main {
      display: flex;
      justify-content: space-between;
      gap: 1.5rem;
    }

    .card-left { flex: 1; }

    .service-name { font-size: 1.125rem; font-weight: 700; margin: 0 0 0.5rem 0; color: var(--text); }
    .service-desc { font-size: 0.875rem; color: var(--text-light); line-height: 1.5; margin-bottom: 1rem; }

    .details-input textarea {
      width: 100%;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0.75rem;
      font-size: 0.8125rem;
      font-family: inherit;
      resize: none;
      height: 50px;
      transition: all 0.2s;
      background: #fcfcfc;
      color: #000;
    }

    .details-input textarea:focus {
      outline: none;
      border-color: var(--primary);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .card-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
      min-width: 120px;
    }

    .price-display {
      font-size: 1.125rem;
      font-weight: 800;
      color: var(--primary);
      text-align: right;
    }

    .price-display span {
      font-size: 0.75rem;
      color: var(--text-light);
      font-weight: 500;
    }

    .price-display.quote {
      font-size: 0.875rem;
      color: #7c3aed;
      background: #f5f3ff;
      padding: 0.25rem 0.75rem;
      border-radius: 8px;
    }

    .qty-field { 
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .qty-field.hidden { visibility: hidden; }

    .qty-field label { 
      font-size: 0.7rem; 
      font-weight: 700; 
      text-transform: uppercase; 
      color: var(--text-light); 
      letter-spacing: 0.025em;
    }

    .qty-field input { 
      width: 60px; 
      text-align: center; 
      padding: 0.5rem; 
      border: 1px solid var(--border); 
      border-radius: 10px; 
      font-weight: 700;
      transition: all 0.2s;
      color: #000;
      background: #ffffff;
      font-size: 1rem;
    }

    .qty-field input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }

    .add-action-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: var(--text);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .add-action-btn:hover:not(.disabled) { 
      background: #000;
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }

    .add-action-btn.disabled { 
      background: var(--accent); 
      color: white; 
      cursor: not-allowed; 
      transform: none; 
      box-shadow: none; 
    }

    .price-ribbon {
      display: none;
    }

    /* 4. Order Summary Footer */
    .order-summary-footer {
      background: #ffffff;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 -10px 25px -5px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .summary-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 2rem;
    }

    .summary-header-row h3 { margin: 0; font-size: 1.25rem; font-weight: 800; color: var(--text); }

    .inputs-row { display: flex; gap: 1.5rem; flex-wrap: wrap; }

    .order-field { display: flex; flex-direction: column; gap: 0.5rem; }
    .order-field label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-light); }
    .order-field input { 
      padding: 0.75rem 1rem; 
      border: 1px solid var(--border); 
      border-radius: 12px; 
      font-size: 0.9rem;
      transition: all 0.2s;
      background: #ffffff;
      color: #000;
    }
    .order-field.error label { color: var(--danger); }
    .order-field.error input { border-color: var(--danger); box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
    
    .date-error-msg {
      font-size: 0.75rem;
      color: var(--danger);
      font-weight: 600;
      margin-top: 0.5rem;
      animation: fadeIn 0.3s ease-out;
    }

    /* Forzar visibilidad absoluta del icono de calendario */
    input[type="date"] {
      position: relative;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: calc(100% - 12px) center;
      background-size: 18px;
      padding-right: 40px !important;
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
      opacity: 0; /* Lo ocultamos pero dejamos que sea clickable */
    }

    .order-field.full-width { width: 100%; }
    .order-field textarea {
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 12px;
      font-size: 0.9rem;
      transition: all 0.2s;
      background: #ffffff;
      color: #000;
      resize: vertical;
      min-height: 80px;
      font-family: inherit;
    }
    .order-field textarea:focus { border-color: var(--primary); outline: none; background: #fff; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }

    .order-address-section {
      padding: 1rem 0;
      border-top: 1px solid #f8f8f8;
    }

    .cart-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }

    .cart-row-container {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      border-bottom: 1px solid #f8f8f8;
      padding-bottom: 0.75rem;
    }

    .cart-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .cart-item-info { font-weight: 600; font-size: 1rem; color: var(--text); }
    .cart-item-desc { 
      font-size: 0.85rem; 
      color: var(--text-light); 
      font-style: italic; 
      padding-left: 0.25rem;
      word-break: break-word;
      overflow-wrap: break-word;
      white-space: normal;
    }

    .cart-remove-btn {
      background: #fee2e2;
      border: none;
      color: var(--danger);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .cart-remove-btn:hover { background: var(--danger); color: white; transform: rotate(90deg); }

    .final-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 1.25rem;
      padding-top: 1.5rem;
      border-top: 2px solid var(--border);
    }

    .total-display { 
      font-size: 1rem; 
      font-weight: 600; 
      color: var(--text-light);
      background: #f8fafc;
      padding: 0.6rem 1.25rem;
      border-radius: 12px;
      border: 1px dashed var(--border);
    }
    .total-display span { font-size: 1.4rem; font-weight: 900; color: var(--text); margin-left: 0.75rem; }

    .proceed-btn {
      padding: 0.8rem 2.5rem;
      background: #ffffff;
      border: 2px solid var(--text);
      border-radius: 16px;
      font-size: 1rem;
      font-weight: 800;
      color: var(--text);
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      text-transform: capitalize;
    }

    .proceed-btn:hover:not(:disabled) {
      background: var(--text);
      color: white;
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.15);
    }

    .proceed-btn:disabled { opacity: 0.3; cursor: not-allowed; }

    /* Loader */
    .loading-container { display: flex; flex-direction: column; align-items: center; padding: 10rem 0; gap: 1.5rem; }
    .loader { width: 48px; height: 48px; border: 5px solid #e5e7eb; border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;

}

customElements.define('view-catalogo-servicios', ViewCatalogoServicios);
