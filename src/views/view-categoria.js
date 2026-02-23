import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { authService } from '../services/auth-service.js';

export class ViewCategoria extends LitElement {
  static properties = {
    id_padre: { type: String },
    nombre_categoria: { type: String },
    opciones: { type: Array },
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
      --radius: 20px;
      --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

      display: block;
      padding: 2rem;
      min-height: 100vh;
      background-color: var(--bg);
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--text);
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      animation: fadeInDown 0.6s ease-out;
    }

    .title-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    h1 {
      font-size: 2.25rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
      color: var(--text);
    }

    .subtitle {
      font-size: 0.95rem;
      color: var(--text-light);
      font-weight: 500;
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

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
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
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: var(--primary);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
      border-color: var(--primary);
    }

    .card:hover::before {
      opacity: 1;
    }

    .icon-box {
      width: 56px;
      height: 56px;
      background: #f0f7ff;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      transition: all 0.3s;
    }

    .card:hover .icon-box {
      background: var(--primary);
      color: white;
      transform: scale(1.1) rotate(5deg);
    }

    .card-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: var(--text);
    }

    .card-description {
      font-size: 0.875rem;
      color: var(--text-light);
      line-height: 1.5;
    }

    .card-action {
      margin-top: auto;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary);
      font-weight: 700;
      font-size: 0.9rem;
      opacity: 0.8;
      transition: all 0.3s;
    }

    .card:hover .card-action {
      opacity: 1;
      gap: 0.75rem;
    }

    /* Loader */
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
      :host { padding: 1rem; }
      h1 { font-size: 1.75rem; }
      .header-section { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
      .btn-back { width: 100%; justify-content: center; }
    }
  `;

  constructor() {
    super();
    this.opciones = [];
    this.id_padre = '';
    this.nombre_categoria = '';
    this.loading = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadOpcionesHijas();
  }

  updated(changedProperties) {
    if (changedProperties.has('id_padre') && this.id_padre) {
      this.loadOpcionesHijas();
    }
  }

  async loadOpcionesHijas() {
    this.loading = true;
    try {
      this.opciones = await authService.getOpcionesHijas(this.id_padre);
    } catch (error) {
      console.error('Error al cargar opciones:', error);
    } finally {
      this.loading = false;
    }
  }

  getIcon(opcion) {
    const n = (opcion.nombre || '').toLowerCase();
    const r = (opcion.ruta || '').toLowerCase();
    const iconBaseUrl = `${authService.baseUrl}/storage/iconos_opciones`;

    // Prioridad 1: Imágenes específicas según la ruta (Listado o Registrar)
    if (r.includes('listado')) {
      return html`<img src="${iconBaseUrl}/icon_listado.png" alt="Listado" style="width: 32px; height: 32px; object-fit: contain;">`;
    }
    if (r.includes('register') || r.includes('nuevo') || r.includes('crear')) {
      return html`<img src="${iconBaseUrl}/icon_registrar.png" alt="Registrar" style="width: 32px; height: 32px; object-fit: contain;">`;
    }
    if (r.includes('catalogo')) {
      return html`<img src="${iconBaseUrl}/icon_carrito.png" alt="Carrito" style="width: 32px; height: 32px; object-fit: contain;">`;
    }

    // Prioridad 2: Iconos SVG temáticos para categorías principales/especiales
    if (n.includes('inventario')) return html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`;
    if (n.includes('servicio')) return html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
    if (n.includes('personal') || n.includes('operativo')) return html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
    if (n.includes('reporte') || n.includes('pago')) return html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`;
    if (n.includes('especialidad')) return html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m4.93 4.93 14.14 14.14"/><path d="M2 12h20"/><path d="m4.93 19.07 14.14-14.14"/></svg>`;
    if (n.includes('orden')) return html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`;
    if (n.includes('membresia') || n.includes('plan')) return html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`;

    return html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
  }

  render() {
    if (this.loading) {
      return html`
        <div class="loading-container">
          <div class="loader"></div>
          <p style="color: var(--text-light); font-weight: 500;">Cargando módulos...</p>
        </div>
      `;
    }

    return html`
      <div class="header-section">
        <div class="title-wrapper">
          <h1>Módulos Disponibles</h1>
          <div class="subtitle">Explora y gestiona las opciones de tu plataforma con precisión</div>
        </div>
        <button class="btn-back" @click=${() => window.history.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver
        </button>
      </div>

      <div class="grid">
        ${this.opciones.map(opcion => html`
          <div class="card" @click=${() => navigator.goto(`/${opcion.ruta}`)}>
            <div class="icon-box">
              ${this.getIcon(opcion)}
            </div>
            <div class="card-content">
              <h2 class="card-title">${opcion.nombre}</h2>
              <p class="card-description">
                ${opcion.descripcion || `Acceder a las herramientas de gestión para ${opcion.nombre.toLowerCase()}.`}
              </p>
            </div>
            <div class="card-action">
              Entrar al módulo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </div>
        `)}
      </div>

      ${this.opciones.length === 0 ? html`
        <div style="text-align: center; padding: 4rem; color: var(--text-light);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; opacity: 0.5;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p>No hay submódulos disponibles en esta categoría actualmente.</p>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('view-categoria', ViewCategoria);
