import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { serviciosService } from '../services/servicios-service.js';

export class ViewReportesPagosDetalles extends LitElement {
    static properties = {
        reporteId: { type: String },
        reporte: { type: Object },
        loading: { type: Boolean },
        observaciones: { type: String }
    };

    static styles = css`
    :host {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --text: #1e293b;
      --text-light: #64748b;
      --border: #e2e8f0;
      --bg: #ffffff;
      --card-bg: #ffffff;
      --radius: 16px;
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --success: #22c55e;
      --success-hover: #16a34a;
      --danger: #ef4444; 
      --danger-hover: #dc2626;

      display: block;
      padding: 2rem;
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--text);
      max-width: 900px;
      margin: 0 auto;
    }

    .container {
        animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .header {
        display: flex;
        align-items: center;
        margin-bottom: 2rem;
        gap: 1rem;
    }

    h1 {
        margin: 0;
        font-size: 1.875rem;
        font-weight: 800;
        letter-spacing: -0.025em;
    }

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
        background: #f8fafc;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .card-title {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0;
        color: var(--primary);
    }

    .card-body {
        padding: 2rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .detail-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-light);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .value {
        font-size: 1.125rem;
        font-weight: 500;
        color: var(--text);
    }

    .value.amount {
        font-weight: 700;
        font-size: 1.5rem;
        color: var(--success);
    }

    .receipt-image {
        grid-column: 1 / -1;
        margin-top: 1rem;
        border: 2px dashed var(--border);
        border-radius: 12px;
        padding: 1rem;
        text-align: center;
    }

    .receipt-image img {
        max-width: 100%;
        max-height: 500px;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .actions-panel {
        background: #f8fafc;
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid var(--border);
        margin-top: 2rem;
    }

    textarea {
        width: 100%;
        padding: 1rem;
        border: 1px solid #cbd5e1;
        border-radius: 8px;
        box-sizing: border-box;
        font-family: inherit;
        font-size: 1rem;
        min-height: 120px;
        margin-bottom: 1.5rem;
        transition: all 0.2s;
        background-color: #ffffff;
        color: #000000;
    }

    textarea:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .btn-group {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }

    .btn-accept {
        background-color: var(--success);
        color: white;
    }

    .btn-accept:hover {
        background-color: var(--success-hover);
        transform: translateY(-2px);
    }

    .btn-cancel {
        background-color: var(--danger);
        color: white;
    }

    .btn-cancel:hover {
        background-color: var(--danger-hover);
        transform: translateY(-2px);
    }

    .btn-back {
        background: var(--text);
        color: white;
    }

    .btn-back:hover {
        background: #000;
        transform: translateX(-4px);
    }

    .status-badge {
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .status-pendiente { background: #fef3c7; color: #92400e; }
    .status-aceptado { background: #dcfce7; color: #166534; }
    .status-cancelado { background: #fee2e2; color: #991b1b; }

    .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 50vh;
    }
  `;

    constructor() {
        super();
        this.reporteId = '';
        this.reporte = null;
        this.loading = true;
        this.observaciones = '';
    }

    async connectedCallback() {
        super.connectedCallback();
        if (this.reporteId) {
            await this.loadReporte();
        }
    }

    async loadReporte() {
        this.loading = true;
        try {
            const data = await serviciosService.getOneReportePago(this.reporteId, true);
            this.reporte = data;
            this.observaciones = this.reporte?.observaciones || '';
        } catch (error) {
            console.error('Error loading reporte:', error);
            alert('Error al cargar el reporte de pago');
        } finally {
            this.loading = false;
        }
    }

    handleInput(e) {
        this.observaciones = e.target.value;
    }

    async handleAction(action) {
        if (!confirm(`¿Estás seguro de que deseas ${action} este reporte?`)) return;

        const payload = {
            id_reporte_pago: this.reporte.id_reporte_pago,
            id_orden: this.reporte.id_orden || null,
            id_plan_membresia: this.reporte.id_plan_membresia || null,
            observaciones: this.observaciones
        };

        try {
            this.loading = true;
            if (action === 'aceptar') {
                await serviciosService.aceptarReportePago(payload);
                alert('Reporte aceptado correctamente');
            } else {
                await serviciosService.cancelarReportePago(payload);
                alert('Reporte cancelado correctamente');
            }
            await this.loadReporte();
        } catch (error) {
            console.error(`Error al ${action} reporte:`, error);
            alert(`Ocurrió un error al ${action} el reporte`);
        } finally {
            this.loading = false;
        }
    }

    getStatusClass(status) {
        const s = status?.toLowerCase() || '';
        if (s.includes('pend')) return 'status-pendiente';
        if (s.includes('aprob') || s.includes('acept')) return 'status-aceptado';
        if (s.includes('rechaz') || s.includes('cancel')) return 'status-cancelado';
        return '';
    }

    render() {
        if (this.loading) {
            return html`
                <div class="loading-container">
                    <p>Cargando detalles del reporte...</p>
                </div>
            `;
        }

        if (!this.reporte) {
            return html`
                <div class="container">
                    <p style="text-align: center; color: var(--danger);">No se encontró el reporte.</p>
                    <button class="btn btn-back" @click=${() => navigator.goto('/reportesPagos/listado')}>
                        Volver al Listado
                    </button>
                </div>
            `;
        }

        return html`
            <div class="container">
                <div class="header">
                    <h1>Detalle del Reporte de Pago #${this.reporte.id_reporte_pago}</h1>
                    <span class="status-badge ${this.getStatusClass(this.reporte.estado)}">
                        ${this.reporte.estado}
                    </span>
                    <button class="btn btn-back" @click=${() => navigator.goto('/reportesPagos/listado')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
                        Volver
                    </button>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Información General</h2>
                        <p class="value" style="font-size: 0.9rem; color: var(--text-light);">Fecha de Emisión: ${this.reporte.fecha_emision}</p>
                    </div>
                    <div class="card-body">
                        <div class="detail-group">
                            <span class="label">Orden / Plan</span>
                            <span class="value">
                                ${this.reporte.id_orden ? `Orden #${this.reporte.id_orden}` : `Plan deMembresía: ${this.reporte.plan_membresia_nombre || 'Plan de Membresía'}`}
                            </span>
                        </div>
                        <div class="detail-group">
                            <span class="label">Cliente</span>
                            <span class="value">${this.reporte.cliente_nombre || 'N/A'}</span>
                            <span class="value" style="font-size: 0.9rem; color: var(--text-light);">C.I: ${this.reporte.cliente_cedula || ''}</span>
                        </div>
                        <div class="detail-group">
                            <span class="label">Monto Reportado</span>
                            <span class="value amount">$${parseFloat(this.reporte.monto).toFixed(2)}</span>
                        </div>
                        <div class="detail-group">
                            <span class="label">Método de Pago</span>
                            <span class="value">${this.reporte.metodo_pago}</span>
                        </div>
                        <div class="detail-group">
                            <span class="label">Referencia</span>
                            <span class="value" style="font-family: monospace;">${this.reporte.num_referencia}</span>
                        </div>
                         <div class="detail-group">
                            <span class="label">Validado Por</span>
                            <span class="value">${this.reporte.admin_nombre || 'Pendiente de validación'}</span>
                        </div>

                        ${this.reporte.image ? html`
                            <div class="receipt-image">
                                <span class="label" style="display: block; margin-bottom: 0.5rem;">Comprobante de Pago</span>
                                <img src="${serviciosService.baseUrl}/storage/${this.reporte.imagePath}" alt="Comprobante de Pago">
                            </div>
                        ` : ''}
                    </div>
                </div>

                ${this.reporte.estado === 'Pendiente' ? html`
                    <div class="actions-panel">
                        <h3 class="card-title" style="margin-bottom: 1rem;">Acciones Administrativas</h3>
                        <div class="detail-group">
                            <label class="label" for="observaciones">Observaciones (Opcional)</label>
                            <textarea 
                                id="observaciones" 
                                .value=${this.observaciones} 
                                @input=${this.handleInput}
                                placeholder="Ingrese observaciones sobre la validación o rechazo del pago..."
                            ></textarea>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-cancel" @click=${() => this.handleAction('cancelar')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                Rechazar Pago
                            </button>
                            <button class="btn btn-accept" @click=${() => this.handleAction('aceptar')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                Aceptar Pago
                            </button>
                        </div>
                    </div>
                ` : html`
                     <div class="card" style="margin-top: 2rem;">
                        <div class="card-header">
                            <h2 class="card-title">Detalles de Validación</h2>
                        </div>
                        <div class="card-body">
                             <div class="detail-group" style="grid-column: 1 / -1;">
                                <span class="label">Observaciones</span>
                                <p class="value" style="margin-top: 0.5rem;">${this.reporte.observaciones || 'Sin observaciones registradas.'}</p>
                            </div>
                        </div>
                     </div>
                `}
            </div>
        `;
    }
}

customElements.define('view-reportes-pagos-detalles', ViewReportesPagosDetalles);
