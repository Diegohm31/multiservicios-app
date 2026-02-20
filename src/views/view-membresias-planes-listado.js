import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { planesMembresiasService } from '../services/planes-membresias-service.js';
import { authService } from '../services/auth-service.js';

export class ViewMembresiasPlanesListado extends LitElement {
    static properties = {
        planes: { type: Array },
        user: { type: Object },
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
      --radius: 20px;
      --shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      --shadow-hover: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      
      display: block;
      padding: 2.5rem 1.5rem;
      font-family: 'Inter', system-ui, sans-serif;
      color: var(--text);
      background-color: var(--bg);
      min-height: 100vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3.5rem;
    }

    .title-group h1 {
      font-size: 2.25rem;
      font-weight: 900;
      margin: 0;
      letter-spacing: -0.04em;
      color: var(--text);
    }

    .title-group p {
      color: var(--text-light);
      margin: 0.5rem 0 0;
      font-size: 1.1rem;
    }

    .btn-create {
      margin-left: auto;
      margin-top: 2rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.75rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 14px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
    }

    .btn-create:hover {
      background: var(--primary-hover);
      transform: translateY(-3px);
      box-shadow: 0 12px 25px rgba(59, 130, 246, 0.4);
    }

    .planes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2.5rem;
    }

    .plan-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      overflow: hidden;
      position: relative;
    }

    .plan-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-hover);
      border-color: var(--primary);
    }

    .card-header {
      padding: 2rem;
      background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
      border-bottom: 1px solid var(--border);
    }

    .plan-name {
      font-size: 1.5rem;
      font-weight: 800;
      margin: 0;
      color: var(--primary);
      letter-spacing: -0.02em;
    }

    .plan-price {
      margin-top: 1rem;
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
    }

    .price-value {
      font-size: 2.5rem;
      font-weight: 900;
      color: var(--text);
    }

    .price-currency {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-light);
    }

    .price-duration {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-light);
      margin-left: 0.5rem;
    }

    .card-body {
      padding: 2rem;
      flex: 1;
    }

    .plan-description {
      color: var(--text-light);
      line-height: 1.6;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }

    .services-title {
      font-size: 0.8rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-light);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .services-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .service-tag {
      background: #f1f5f9;
      color: var(--text);
      padding: 0.5rem 1rem;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid transparent;
      transition: all 0.2s;
    }

    .service-tag:hover {
      background: white;
      border-color: var(--primary);
      color: var(--primary);
    }

    .discount-badge {
      background: var(--primary);
      color: white;
      font-size: 0.7rem;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      font-weight: 800;
    }

    .card-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      background: #fafafa;
    }

    .btn-action {
      padding: 0.6rem 1.2rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-edit {
      background: #fef3c7;
      color: #92400e;
    }

    .btn-edit:hover {
      background: #fcd34d;
      transform: scale(1.05);
    }

    .btn-delete {
      background: #fee2e2;
      color: #991b1b;
    }

    .btn-delete:hover {
      background: #fecaca;
      transform: scale(1.05);
    }

    .btn-cancel {
      background: #ef4444;
      color: white;
      width: 100%;
      margin: 0;
      justify-content: center;
      padding: 0.875rem 1.75rem;
      border: none;
      border-radius: 14px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: #dc2626;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
    }

    .badge-active {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #dcfce7;
      color: #166534;
      padding: 0.5rem 1rem;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border: 1px solid #bbf7d0;
      margin-bottom: 1rem;
    }

    .loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 5rem;
      background: white;
      border-radius: var(--radius);
      border: 2px dashed var(--border);
    }

    .empty-state h3 {
      font-size: 1.5rem;
      color: var(--text-light);
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
  `;

    constructor() {
        super();
        this.planes = [];
        this.user = null;
        this.loading = true;
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadPlanes();
    }

    async loadPlanes() {
        this.loading = true;
        try {
            const [planesData, userData] = await Promise.all([
                planesMembresiasService.getPlanes(),
                authService.getUser()
            ]);
            this.planes = planesData || [];
            this.user = userData;
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            this.loading = false;
        }
    }

    async handleDelete(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este plan?')) {
            try {
                await planesMembresiasService.deletePlan(id);
                await this.loadPlanes();
                alert('Plan eliminado correctamente');
            } catch (error) {
                console.error('Error deleting plan:', error);
                alert('Ocurrió un error al eliminar el plan');
            }
        }
    }

    async handleCancelMembresia(id) {
        if (confirm('¿Estás seguro de que deseas cancelar tu membresía activa? Perderás todos tus beneficios de inmediato.')) {
            try {
                await planesMembresiasService.cancelMembresia(id);
                await this.loadPlanes();
                alert('Membresía cancelada correctamente');
            } catch (error) {
                console.error('Error canceling membership:', error);
                alert('Ocurrió un error al cancelar la membresía');
            }
        }
    }

    render() {
        if (this.loading) {
            return html`
                <div class="loader">
                    <div class="spinner"></div>
                    <p style="margin-top: 1.5rem; font-weight: 600; color: var(--text-light);">Cargando planes...</p>
                </div>
            `;
        }

        const isClient = this.user?.id_rol === '00001';

        return html`
      <div class="container">
        <header>
          <div class="title-group">
            <h1>Planes de Membresía</h1>
            <p>${isClient ? 'Activa los mejores beneficios para tu hogar (Máximo un plan activo)' : 'Gestiona los beneficios y suscripciones para tus clientes'}</p>
          </div>
          <button class="btn-back" @click=${() => navigator.goto('/categoria/00026')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
            Volver
          </button>
        </header>

        ${this.planes.length === 0 ? html`
            <div class="empty-state">
              <h3>No se encontraron planes registrados</h3>
              <p>Comienza creando un nuevo plan para tus clientes.</p>
            </div>
          ` : html`
            <div class="planes-grid">
              ${this.planes.map(plan => html`
                <article class="plan-card">
                  <div class="card-header">
                    <h2 class="plan-name">${plan.nombre}</h2>
                    <div class="plan-price">
                      <span class="price-currency">$</span>
                      <span class="price-value">${Number(plan.precio).toFixed(2)}</span>
                      <span class="price-duration">/ ${plan.duracion_meses} ${plan.duracion_meses == 1 ? 'mes' : 'meses'}</span>
                    </div>
                  </div>
                  
                  <div class="card-body">
                    <p class="plan-description">${plan.descripcion}</p>
                    
                    <div class="services-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      Servicios Incluidos
                    </div>
                    
                    <div class="services-list">
                      ${plan.array_tipos_servicios && plan.array_tipos_servicios.length > 0 ? html`
                        ${plan.array_tipos_servicios.map(ts => html`
                          <span class="service-tag">
                            ${ts.nombre_tipo_servicio || 'Servicio'}
                            <span class="discount-badge">${ts.porcentaje_descuento}% desc.</span>
                          </span>
                        `)}
                      ` : html`<span style="color: var(--text-light); font-style: italic; font-size: 0.9rem;">Sin servicios asociados</span>`}
                    </div>
                  </div>

                  <div class="card-footer" style="flex-direction: column; align-items: stretch; gap: 1rem;">
                    ${isClient ? html`
                      ${this.user.membresia_activa ? html`
                        ${this.user.membresia_activa.id_plan_membresia === plan.id_plan_membresia ? html`
                           <div class="badge-active">
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
                             Tu Plan Actual
                           </div>
                           <button class="btn-cancel" @click=${() => this.handleCancelMembresia(this.user.membresia_activa.id_membresia)}>
                             Cancelar Membresía
                           </button>
                        ` : html`
                           <button class="btn-create" style="width: 100%; margin: 0; justify-content: center; opacity: 0.5; cursor: not-allowed;" disabled>
                             Comprar Plan
                           </button>
                           <p style="font-size: 0.8rem; color: var(--text-light); text-align: center; margin: 0;">Ya tienes un plan activo</p>
                        `}
                      ` : html`
                        <button class="btn-create" style="width: 100%; margin: 0; justify-content: center;" @click=${() => navigator.goto(`/membresias/planes/pago/${plan.id_plan_membresia}`)}>
                          Comprar Plan
                        </button>
                      `}
                    ` : html`
                      <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                        <button class="btn-action btn-edit" @click=${() => navigator.goto(`/membresias/planes/edit/${plan.id_plan_membresia}`)}>
                          Editar
                        </button>
                        <button class="btn-action btn-delete" @click=${() => this.handleDelete(plan.id_plan_membresia)}>
                          Eliminar
                        </button>
                      </div>
                    `}
                  </div>
                </article>
              `)}
            </div>

            ${!isClient ? html`
              <button class="btn-create" @click=${() => navigator.goto('/membresias/planes/register')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Nuevo Plan
              </button>
            ` : ''}
        `}
      </div>
    `;
    }
}

customElements.define('view-membresias-planes-listado', ViewMembresiasPlanesListado);
