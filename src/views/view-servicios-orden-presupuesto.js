import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { serviciosService } from '../services/servicios-service.js';
import { popupService } from '../utils/popup-service.js';
import { materialesService } from '../services/materiales-service.js';
import { tiposEquiposService } from '../services/tipos-equipos-service.js';
import { especialidadesService } from '../services/especialidades-service.js';

export class ViewServiciosOrdenPresupuesto extends LitElement {
    static properties = {
        ordenId: { type: String },
        orden: { type: Object },
        materiales: { type: Array },
        tiposEquipos: { type: Array },
        especialidades: { type: Array },
        loading: { type: Boolean },
        serviciosEditados: { type: Array }
    };

    static styles = css`
    :host {
      --primary: #2563eb; /* Blue */
      --primary-hover: #1d4ed8;
      --success: #10b981;
      --danger: #ef4444;
      --bg: #fff;
      --card-bg: #ffffff;
      --text: #1e293b;
      --text-light: #64748b;
      --border: #e2e8f0;
      --radius: 16px;
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      
      display: block;
      padding: 2rem 1rem;
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--text);
      background-color: var(--bg);
      min-height: 100vh;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .header {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    h1 {
      font-size: 1.875rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
    }

    .card {
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
      background: #fcfcfc;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .service-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .service-qty-badge {
      background: #eef2ff;
      color: var(--primary);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .card-body {
      padding: 1.5rem;
    }

    .service-description {
      background: #f1f5f9;
      padding: 1rem;
      border-radius: 12px;
      font-size: 0.9rem;
      color: var(--text-light);
      margin-bottom: 1.5rem;
      border-left: 4px solid var(--primary);
      white-space: pre-wrap;
    }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 1rem;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.5rem;
    }

    .tab {
      padding: 0.75rem 1rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-light);
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }

    .tab:hover {
      color: var(--primary);
    }

    .tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    .tab-count {
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 6px;
      font-size: 0.75rem;
      margin-left: 4px;
    }

    /* Selection Section */
    .selection-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    select, input {
      padding: 0.625rem 1rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: inherit;
      background: white;
      color: black;
    }

    select:focus, input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    input.error {
      border-color: var(--danger) !important;
      color: var(--danger) !important;
      background-color: #fef2f2 !important;
    }

    input.error:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }

    .flex-grow { flex: 1; }

    /* Tables */
    .table-container {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    th {
      text-align: left;
      padding: 0.75rem;
      color: var(--text-light);
      font-weight: 600;
      border-bottom: 1px solid var(--border);
    }

    td {
      padding: 0.75rem;
      border-bottom: 1px solid #f8fafc;
    }

    .btn-remove {
      background: #fee2e2;
      color: #ef4444;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-remove:hover {
      background: #ef4444;
      color: white;
    }

    /* Totals Footer */
    .totals-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: #fcfcfc;
      border-top: 1px solid var(--border);
    }

    .service-total {
      font-size: 1.125rem;
      font-weight: 800;
      color: var(--primary);
      text-align: right;
    }

    .service-total span {
      display: block;
      font-size: 0.75rem;
      color: var(--text-light);
      text-transform: uppercase;
      font-weight: 600;
    }

    .global-footer {
      position: sticky;
      bottom: 2rem;
      background: var(--text);
      color: white;
      padding: 1.5rem 2rem;
      border-radius: var(--radius);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
      margin-top: 3rem;
    }

    .global-total-label {
      font-size: 0.875rem;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .global-total-value {
      font-size: 1.75rem;
      font-weight: 800;
    }

    .info-badge {
      display: flex;
      flex-direction: column;
      background: #f8fafc;
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      border: 1px solid var(--border);
      font-size: 0.85rem;
    }

    .info-badge span {
      font-weight: 700;
      color: var(--primary);
    }

    .info-badge label {
      font-size: 0.7rem;
      text-transform: uppercase;
      color: var(--text-light);
      font-weight: 600;
      letter-spacing: 0.025em;
    }

    .btn-save {
      background: var(--success);
      color: white;
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-save:hover {
      background: #059669;
      transform: translateY(-2px);
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

    .loader-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
    }

    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid #e2e8f0;
      border-bottom-color: var(--primary);
      border-radius: 50%;
      animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

    constructor() {
        super();
        this.ordenId = '';
        this.orden = null;
        this.materiales = [];
        this.tiposEquipos = [];
        this.especialidades = [];
        this.loading = true;
        this.serviciosEditados = [];
    }

    async connectedCallback() {
        super.connectedCallback();
        if (this.ordenId) {
            await this.loadData();
        }
    }

    async loadData() {
        this.loading = true;
        try {
            const [orderData, m, te, e] = await Promise.all([
                serviciosService.getOneOrden(this.ordenId, true),
                materialesService.getMateriales(),
                tiposEquiposService.getTiposEquipos(),
                especialidadesService.getEspecialidades()
            ]);

            if (orderData && orderData.orden) {
                this.orden = orderData.orden;
                this.materiales = m || [];
                this.tiposEquipos = te || [];
                this.especialidades = e || [];

                // Initialize editable services
                const arrayServicios = this.orden.array_servicios || [];
                this.serviciosEditados = arrayServicios.map(s => ({
                    id_orden_servicio: s.id_orden_servicio,
                    id_servicio: s.id_servicio,
                    nombre: s.nombre,
                    categoria_nombre: s.categoria_nombre,
                    cantidad: Number(s.cantidad) || 1,
                    descripcion: s.descripcion || '',
                    activeTab: 'materiales',
                    selectedMateriales: (s.array_materiales || []).map(item => ({
                        ...item,
                        cantidad: Number(item.cantidad_servicio || item.cantidad || 1)
                    })),
                    selectedEquipos: (s.array_tipos_equipos || []).map(item => ({
                        ...item,
                        cantidad: Number(item.cantidad_servicio || item.cantidad || 1),
                        horas_uso: Number(item.horas_uso || 1)
                    })),
                    selectedEspecialidades: (s.array_especialidades || []).map(item => {
                        const baseData = this.especialidades.find(e => e.id_especialidad === item.id_especialidad) || {};
                        return {
                            ...item,
                            nivel: baseData.nivel || item.nivel || '',
                            cantidad: Number(item.cantidad_servicio || item.cantidad || 1),
                            horas_hombre: Number(item.horas_hombre || 1)
                        };
                    })
                }));
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            this.loading = false;
        }
    }

    viewPeritaje() {
        if (this.orden?.pdf_peritaje) {
            const url = `${serviciosService.baseUrl}/storage/${this.orden.pdf_peritaje}`;
            window.open(url, '_blank');
        }
    }

    updateServiceItem(serviceIndex, arrayName, idField, id, field, value) {
        const nuevosServicios = [...this.serviciosEditados];
        const servicio = nuevosServicios[serviceIndex];

        servicio[arrayName] = servicio[arrayName].map(item => {
            if (item[idField] === id) {
                return { ...item, [field]: value };
            }
            return item;
        });

        this.serviciosEditados = nuevosServicios;
        this.requestUpdate();
    }

    addItem(serviceIndex, type, e) {
        const id = e.target.value;
        if (!id) return;

        const nuevosServicios = [...this.serviciosEditados];
        const servicio = nuevosServicios[serviceIndex];

        if (type === 'material') {
            const item = this.materiales.find(m => m.id_material === id);
            if (item && !servicio.selectedMateriales.find(m => m.id_material === id)) {
                servicio.selectedMateriales = [...servicio.selectedMateriales, { ...item, cantidad: 1 }];
            }
        } else if (type === 'equipo') {
            const item = this.tiposEquipos.find(te => te.id_tipo_equipo === id);
            if (item && !servicio.selectedEquipos.find(te => te.id_tipo_equipo === id)) {
                servicio.selectedEquipos = [...servicio.selectedEquipos, { ...item, cantidad: 1, horas_uso: 1 }];
            }
        } else if (type === 'especialidad') {
            const item = this.especialidades.find(esp => esp.id_especialidad === id);
            if (item && !servicio.selectedEspecialidades.find(esp => esp.id_especialidad === id)) {
                servicio.selectedEspecialidades = [...servicio.selectedEspecialidades, { ...item, cantidad: 1, horas_hombre: 1 }];
            }
        }

        this.serviciosEditados = nuevosServicios;
        e.target.value = '';
        this.requestUpdate();
    }

    removeItem(serviceIndex, arrayName, idField, id) {
        const nuevosServicios = [...this.serviciosEditados];
        nuevosServicios[serviceIndex][arrayName] = nuevosServicios[serviceIndex][arrayName].filter(item => item[idField] !== id);
        this.serviciosEditados = nuevosServicios;
        this.requestUpdate();
    }

    switchTab(serviceIndex, tab) {
        const nuevosServicios = [...this.serviciosEditados];
        nuevosServicios[serviceIndex].activeTab = tab;
        this.serviciosEditados = nuevosServicios;
        this.requestUpdate();
    }

    // Calculations (Now items reflect TOTAL quantity of the order)
    calculateTotalMat(s) {
        return s.selectedMateriales.reduce((acc, m) => acc + (Number(m.cantidad) * Number(m.precio_unitario || 0)), 0);
    }

    calculateTotalEqu(s) {
        return s.selectedEquipos.reduce((acc, e) => acc + (Number(e.cantidad) * Number(e.horas_uso) * Number(e.costo_hora || 0)), 0);
    }

    calculateTotalMO(s) {
        return s.selectedEspecialidades.reduce((acc, esp) => acc + (Number(esp.cantidad) * Number(esp.horas_hombre) * Number(esp.tarifa_hora || 0)), 0);
    }

    // New Unit-based calculations
    calculateUnitMat(s) {
        return this.calculateTotalMat(s);
    }

    calculateUnitEqu(s) {
        return this.calculateTotalEqu(s);
    }

    calculateUnitMO(s) {
        return this.calculateTotalMO(s);
    }

    calculatePrecioGeneralUnitario(s) {
        return this.calculateUnitMat(s) + this.calculateUnitEqu(s) + this.calculateUnitMO(s);
    }

    getDiscountForCategory(categoryName) {
        if (!this.orden?.cliente?.user?.membresia_activa?.plan?.array_tipos_servicios) return null;

        const ts = this.orden.cliente.user.membresia_activa.plan.array_tipos_servicios.find(
            item => item.nombre_tipo_servicio === categoryName
        );

        return ts ? ts.porcentaje_descuento : null;
    }

    calculateDescuentoUnitario(s) {
        const precioGeneralUnitario = this.calculatePrecioGeneralUnitario(s);
        const membershipDiscountPercent = this.getDiscountForCategory(s.categoria_nombre) || 0;
        const membershipDescUnitAmount = (membershipDiscountPercent * precioGeneralUnitario) / 100;

        return membershipDescUnitAmount;
    }

    calculatePorcentajeDescuentoTotal(s) {
        const precioGeneralUnitario = this.calculatePrecioGeneralUnitario(s);
        const descuentoUnitario = this.calculateDescuentoUnitario(s);
        return precioGeneralUnitario > 0 ? (descuentoUnitario / precioGeneralUnitario) * 100 : 0;
    }

    calculatePrecioNetoUnitario(s) {
        return this.calculatePrecioGeneralUnitario(s) - this.calculateDescuentoUnitario(s);
    }

    calculatePrecioAPagar(s) {
        const qty = Number(s.cantidad) || 1;
        return qty * this.calculatePrecioNetoUnitario(s);
    }

    get totalGlobal() {
        return this.serviciosEditados.reduce((acc, s) => acc + this.calculatePrecioAPagar(s), 0);
    }


    async handleSave() {
        popupService.confirm('Guardar Presupuesto', '¿Desea guardar este presupuesto?', async () => {
            this.loading = true;

            const totalMat = this.serviciosEditados.reduce((acc, s) => acc + (this.calculateUnitMat(s) * s.cantidad), 0);
            const totalEqu = this.serviciosEditados.reduce((acc, s) => acc + (this.calculateUnitEqu(s) * s.cantidad), 0);
            const totalMO = this.serviciosEditados.reduce((acc, s) => acc + (this.calculateUnitMO(s) * s.cantidad), 0);
            const totalGen = totalMat + totalEqu + totalMO;

            const payload = {
                id_orden: this.ordenId,
                total_materiales: totalMat,
                total_equipos: totalEqu,
                total_mano_obra: totalMO,
                total_general: totalGen,
                total_descuento: this.serviciosEditados.reduce((acc, s) => acc + (this.calculateDescuentoUnitario(s) * (Number(s.cantidad) || 1)), 0),
                total_a_pagar: this.totalGlobal,
                array_servicios: this.serviciosEditados.map(s => ({
                    id_orden_servicio: s.id_orden_servicio,
                    precio_materiales_unitario: this.calculateUnitMat(s),
                    precio_tipos_equipos_unitario: this.calculateUnitEqu(s),
                    precio_mano_obra_unitario: this.calculateUnitMO(s),
                    precio_general_unitario: this.calculatePrecioGeneralUnitario(s),
                    porcentaje_descuento: this.calculatePorcentajeDescuentoTotal(s),
                    descuento_unitario: this.calculateDescuentoUnitario(s),
                    precio_neto_unitario: this.calculatePrecioNetoUnitario(s),
                    precio_a_pagar: this.calculatePrecioAPagar(s),
                    array_materiales: s.selectedMateriales.map(m => ({
                        id_material: m.id_material,
                        cantidad: Number(m.cantidad),
                        precio_unitario: Number(m.precio_unitario)
                    })),
                    array_tipos_equipos: s.selectedEquipos.map(e => ({
                        id_tipo_equipo: e.id_tipo_equipo,
                        cantidad: Number(e.cantidad),
                        horas_uso: Number(e.horas_uso),
                        costo_hora: Number(e.costo_hora)
                    })),
                    array_especialidades: s.selectedEspecialidades.map(esp => ({
                        id_especialidad: esp.id_especialidad,
                        cantidad: Number(esp.cantidad),
                        horas_hombre: Number(esp.horas_hombre),
                        tarifa_hora: Number(esp.tarifa_hora)
                    }))
                }))
            };

            try {
                const res = await serviciosService.createPresupuesto(payload);
                if (res) {
                    popupService.success('Éxito', 'Presupuesto generado correctamente');
                    navigator.goto('/servicios/listado/orden');
                }
            } catch (error) {
                popupService.warning('Error', 'Error al guardar: ' + error.message);
            } finally {
                this.loading = false;
            }
        });
    }

    render() {
        if (this.loading && !this.orden) {
            return html`
                <div class="loader-container">
                    <div class="loader"></div>
                    <p style="margin-top: 1rem; color: var(--text-light);">Cargando información de la orden...</p>
                </div>
            `;
        }

        return html`
            <div class="container">
                <header class="header">
                        <div>
                            <h1>Generar Presupuesto</h1>
                            <p style="color: var(--text-light); margin-top: 0.5rem;">Orden #${this.ordenId} - ${this.orden?.direccion}</p>
                        </div>
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            ${this.orden?.pdf_peritaje ? html`
                                <button class="btn-outline-danger" @click=${this.viewPeritaje}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    Ver Peritaje
                                </button>
                            ` : html`
                                <span style="font-size: 0.85rem; color: var(--text-light); font-weight: 600; font-style: italic; text-align: center;">
                                    Aun no se ha subido el Archivo de Peritaje
                                </span>
                            `}
                        </div>
                    <button class="btn-back" @click=${() => navigator.goto('/servicios/listado/orden')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
                        Cancelar
                    </button>
                </header>

                ${this.serviciosEditados.map((s, idx) => html`
                    <div class="card">
                        <div class="card-header">
                            <div class="service-title">
                                <span class="service-qty-badge">${s.cantidad}x</span>
                                ${s.nombre}
                                ${this.getDiscountForCategory(s.categoria_nombre) ? html`
                                    <span class="service-qty-badge" style="background: #ecfdf5; color: #059669; margin-left: 0.5rem;">
                                        ${this.getDiscountForCategory(s.categoria_nombre)}% DESC. MEMBRESÍA
                                    </span>
                                ` : ''}
                            </div>
                            <div class="service-total">
                                <span>A Pagar</span>
                                $${this.calculatePrecioAPagar(s).toFixed(2)}
                            </div>
                        </div>
                        <div class="card-body">
                            ${s.descripcion ? html`
                                <div class="service-description">
                                    <strong>Especificaciones del usuario:</strong><br>${s.descripcion}
                                </div>
                            ` : ''}

                            <div class="tabs">
                                <div class="tab ${s.activeTab === 'materiales' ? 'active' : ''}" @click=${() => this.switchTab(idx, 'materiales')}>
                                    Materiales <span class="tab-count">${s.selectedMateriales.length}</span>
                                </div>
                                <div class="tab ${s.activeTab === 'equipos' ? 'active' : ''}" @click=${() => this.switchTab(idx, 'equipos')}>
                                    Equipos <span class="tab-count">${s.selectedEquipos.length}</span>
                                </div>
                                <div class="tab ${s.activeTab === 'especialidades' ? 'active' : ''}" @click=${() => this.switchTab(idx, 'especialidades')}>
                                    Mano de Obra <span class="tab-count">${s.selectedEspecialidades.length}</span>
                                </div>
                            </div>

                            <div class="tab-content">
                                ${this.renderTabContent(idx, s)}
                            </div>
                        </div>
                        <div class="totals-bar">
                            <div style="display: flex; gap: 1.5rem; align-items: center;">
                                <div style="display: flex; gap: 1.5rem; font-size: 0.85rem; color: var(--text-light);">
                                    <span>Mat Unit: $${this.calculateUnitMat(s).toFixed(2)}</span>
                                    <span>Equ Unit: $${this.calculateUnitEqu(s).toFixed(2)}</span>
                                    <span>M.O Unit: $${this.calculateUnitMO(s).toFixed(2)}</span>
                                </div>
                            </div>
                            <div style="display: flex; gap: 2rem; align-items: center; text-align: right;">
                                <div>
                                    <div style="font-size: 0.7rem; color: var(--text-light); text-transform: uppercase;">Precio Gral. Unit.</div>
                                    <div style="font-weight: 600; font-size: 0.9rem;">$${this.calculatePrecioGeneralUnitario(s).toFixed(2)}</div>
                                </div>
                                <div>
                                    <div style="font-size: 0.7rem; color: var(--danger); text-transform: uppercase;">Desc. Unit.</div>
                                    <div style="font-weight: 600; font-size: 0.9rem; color: var(--danger);">-$${this.calculateDescuentoUnitario(s).toFixed(2)}</div>
                                </div>
                                <div>
                                    <div style="font-size: 0.7rem; color: var(--success); text-transform: uppercase;">Precio Neto Unit.</div>
                                    <div style="font-weight: 800; font-size: 1.1rem; color: var(--success);">$${this.calculatePrecioNetoUnitario(s).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `)}

                <footer class="global-footer">
                    <div>
                        <div class="global-total-label">Total del Presupuesto</div>
                        <div class="global-total-value">$${this.totalGlobal.toFixed(2)}</div>
                    </div>
                    <button class="btn-save" @click=${this.handleSave} ?disabled=${this.loading}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        ${this.loading ? 'Guardando...' : 'Generar Presupuesto'}
                    </button>
                </footer>
            </div>
        `;
    }

    renderTabContent(idx, s) {
        if (s.activeTab === 'materiales') {
            return html`
                <div class="selection-row">
                    <select class="flex-grow" @change=${(e) => this.addItem(idx, 'material', e)}>
                        <option value="">Seleccionar material para agregar...</option>
                        ${this.materiales.map(m => html`
                            <option value=${m.id_material} ?disabled=${s.selectedMateriales.some(sm => sm.id_material === m.id_material)}>
                                ${m.nombre} ($${m.precio_unitario}/${m.unidad_medida})
                            </option>
                        `)}
                    </select>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th style="width: 100px;">Cantidad</th>
                                <th>Precio U.</th>
                                <th>Subtotal</th>
                                <th style="width: 40px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${s.selectedMateriales.map(m => html`
                                <tr>
                                    <td>${m.nombre}</td>
                                    <td><input type="number" step="0.1" .value=${m.cantidad} @input=${(e) => this.updateServiceItem(idx, 'selectedMateriales', 'id_material', m.id_material, 'cantidad', e.target.value)} style="width: 80px;"></td>
                                    <td>$${Number(m.precio_unitario).toFixed(2)}</td>
                                    <td>$${(m.cantidad * m.precio_unitario).toFixed(2)}</td>
                                    <td><button class="btn-remove" @click=${() => this.removeItem(idx, 'selectedMateriales', 'id_material', m.id_material)}>×</button></td>
                                </tr>
                            `)}
                            ${s.selectedMateriales.length === 0 ? html`<tr><td colspan="5" style="text-align: center; color: var(--text-light); padding: 1.5rem;">No hay materiales</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            `;
        }

        if (s.activeTab === 'equipos') {
            return html`
                <div class="selection-row">
                    <select class="flex-grow" @change=${(e) => this.addItem(idx, 'equipo', e)}>
                        <option value="">Seleccionar equipo para agregar...</option>
                        ${this.tiposEquipos.map(te => html`
                            <option value=${te.id_tipo_equipo} ?disabled=${s.selectedEquipos.some(se => se.id_tipo_equipo === te.id_tipo_equipo)}>
                                ${te.nombre} ($${te.costo_hora}/h)
                            </option>
                        `)}
                    </select>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th style="width: 80px;">Cant.</th>
                                <th style="width: 80px;">Horas</th>
                                <th>Costo/h</th>
                                <th>Subtotal</th>
                                <th style="width: 40px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${s.selectedEquipos.map(e => html`
                                <tr>
                                    <td>${e.nombre}</td>
                                    <td><input type="number" .value=${e.cantidad} @input=${(ev) => this.updateServiceItem(idx, 'selectedEquipos', 'id_tipo_equipo', e.id_tipo_equipo, 'cantidad', ev.target.value)} style="width: 60px;"></td>
                                    <td>
                                        <input 
                                            type="number" 
                                            step="0.1" 
                                            .value=${e.horas_uso} 
                                            @input=${(ev) => this.updateServiceItem(idx, 'selectedEquipos', 'id_tipo_equipo', e.id_tipo_equipo, 'horas_uso', ev.target.value)} 
                                            style="width: 60px;"
                                        >
                                    </td>
                                    <td>$${Number(e.costo_hora).toFixed(2)}</td>
                                    <td>$${(e.cantidad * e.horas_uso * e.costo_hora).toFixed(2)}</td>
                                    <td><button class="btn-remove" @click=${() => this.removeItem(idx, 'selectedEquipos', 'id_tipo_equipo', e.id_tipo_equipo)}>×</button></td>
                                </tr>
                            `)}
                            ${s.selectedEquipos.length === 0 ? html`<tr><td colspan="6" style="text-align: center; color: var(--text-light); padding: 1.5rem;">No hay equipos</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            `;
        }

        if (s.activeTab === 'especialidades') {
            return html`
                <div class="selection-row">
                    <select class="flex-grow" @change=${(e) => this.addItem(idx, 'especialidad', e)}>
                        <option value="">Seleccionar especialidad para agregar...</option>
                        ${this.especialidades.map(esp => html`
                            <option value=${esp.id_especialidad} ?disabled=${s.selectedEspecialidades.some(se => se.id_especialidad === esp.id_especialidad)}>
                                ${esp.nombre} - ${esp.nivel} ($${esp.tarifa_hora}/h)
                            </option>
                        `)}
                    </select>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Nivel</th>
                                <th style="width: 80px;">Cant.</th>
                                <th style="width: 80px;">Horas</th>
                                <th>Tarifa/h</th>
                                <th>Subtotal</th>
                                <th style="width: 40px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${s.selectedEspecialidades.map(esp => html`
                                <tr>
                                    <td>${esp.nombre}</td>
                                    <td>${esp.nivel}</td>
                                    <td><input type="number" .value=${esp.cantidad} @input=${(ev) => this.updateServiceItem(idx, 'selectedEspecialidades', 'id_especialidad', esp.id_especialidad, 'cantidad', ev.target.value)} style="width: 60px;"></td>
                                    <td>
                                        <input 
                                            type="number" 
                                            step="0.1" 
                                            .value=${esp.horas_hombre} 
                                            @input=${(ev) => this.updateServiceItem(idx, 'selectedEspecialidades', 'id_especialidad', esp.id_especialidad, 'horas_hombre', ev.target.value)} 
                                            style="width: 60px;"
                                        >
                                    </td>
                                    <td>$${Number(esp.tarifa_hora).toFixed(2)}</td>
                                    <td>$${(esp.cantidad * esp.horas_hombre * esp.tarifa_hora).toFixed(2)}</td>
                                    <td><button class="btn-remove" @click=${() => this.removeItem(idx, 'selectedEspecialidades', 'id_especialidad', esp.id_especialidad)}>×</button></td>
                                </tr>
                            `)}
                            ${s.selectedEspecialidades.length === 0 ? html`<tr><td colspan="7" style="text-align: center; color: var(--text-light); padding: 1.5rem;">No hay mano de obra</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
}

customElements.define('view-servicios-orden-presupuesto', ViewServiciosOrdenPresupuesto);
