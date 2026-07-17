import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { serviciosService } from '../services/servicios-service.js';
import { popupService } from '../utils/popup-service.js';
import { materialesService } from '../services/materiales-service.js';
import { tiposEquiposService } from '../services/tipos-equipos-service.js';
import { especialidadesService } from '../services/especialidades-service.js';

export class ViewServiciosOrdenPeritaje extends LitElement {
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
      --primary: #2563eb;
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
      justify-content: space-between;
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
      font-weight: 700;
    }

    .card-body {
      padding: 1.5rem;
    }

    .tabs {
      display: flex;
      gap: 1rem;
      border-bottom: 2px solid var(--border);
      margin-bottom: 1.5rem;
    }

    .tab {
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      color: var(--text-light);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .tab:hover {
      color: var(--primary);
    }

    .tab.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    .tab-count {
      background: var(--border);
      color: var(--text-light);
      padding: 0.1rem 0.5rem;
      border-radius: 10px;
      font-size: 0.75rem;
    }

    .tab.active .tab-count {
      background: #eef2ff;
      color: var(--primary);
    }

    .selection-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      align-items: center;
    }

    select {
      flex-grow: 1;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 0.95rem;
      color: #1e293b;
      background-color: #fff;
      cursor: pointer;
      outline: none;
    }

    input[type="number"] {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      font-size: 0.95rem;
      font-family: inherit;
      color: #1e293b;
      background-color: #fff;
      text-align: center;
      outline: none;
      transition: border-color 0.2s;
    }

    input[type="number"]:focus {
      border-color: var(--primary);
    }

    select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .table-container {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
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
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-light);
      border-bottom: 1px solid var(--border);
    }

    td {
      padding: 1rem 1.5rem;
      font-size: 0.95rem;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }

    tr:last-child td {
      border-bottom: none;
    }

    input[type="number"] {
      width: 80px;
      padding: 0.5rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      text-align: center;
      font-size: 0.95rem;
    }

    input[type="number"]:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .btn-remove {
      background: none;
      border: none;
      color: var(--danger);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      font-size: 1.2rem;
      line-height: 1;
    }

    .btn-remove:hover {
      background: #fee2e2;
    }

    .global-footer {
      background: var(--card-bg);
      padding: 1.5rem 2rem;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 0.1);
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 2rem;
      position: sticky;
      bottom: 2rem;
      z-index: 10;
    }

    .btn-save {
      background: var(--primary);
      color: white;
      border: none;
      padding: 1rem 2.5rem;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.2s;
    }

    .btn-save:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .btn-save:disabled {
      background: var(--text-light);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
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

                this.materiales = (m || []).sort((a, b) => a.nombre.localeCompare(b.nombre));
                this.tiposEquipos = (te || []).sort((a, b) => a.nombre.localeCompare(b.nombre));
                this.especialidades = (e || []).sort((a, b) => {
                    const nameCompare = a.nombre.localeCompare(b.nombre);
                    if (nameCompare !== 0) return nameCompare;
                    return a.nivel.localeCompare(b.nivel);
                });

                // Validar la fecha del peritaje
                const now = new Date();
                const peritajeDate = this.orden.fecha_peritaje ? new Date(this.orden.fecha_peritaje.replace(' ', 'T')) : null;

                if (!peritajeDate) {
                    popupService.warning('Acción No Permitida', 'Esta orden no tiene una fecha de peritaje asignada.');
                    navigator.goto(`/servicios/orden/detalles/${this.ordenId}`);
                    return;
                }

                if (peritajeDate > now) {
                    popupService.warning('Acción No Permitida', 'No se puede realizar el peritaje antes de la fecha y hora programada: ' + this.orden.fecha_peritaje);
                    navigator.goto(`/servicios/orden/detalles/${this.ordenId}`);
                    return;
                }

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
                    selectedMateriales: [],
                    selectedEquipos: [],
                    selectedEspecialidades: []
                }));
            }
        } catch (error) {
            console.error('Error loading data:', error);
            popupService.warning('Error', 'No se pudieron cargar los datos para el peritaje.');
        } finally {
            this.loading = false;
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

    async handleSave() {
        const sinEspecialidad = this.serviciosEditados.find(s => !s.selectedEspecialidades || s.selectedEspecialidades.length === 0);
        if (sinEspecialidad) {
            popupService.warning('Información Incompleta', `Debe asignar al menos una Mano de Obra (Especialidad) al servicio: ${sinEspecialidad.nombre}`);
            return;
        }

        for (const s of this.serviciosEditados) {
            const totalHorasEspecialidades = s.selectedEspecialidades.reduce((acc, esp) => acc + (Number(esp.horas_hombre) * Number(esp.cantidad)), 0);
            
            const equipoExcedido = s.selectedEquipos.find(e => (Number(e.horas_uso) * Number(e.cantidad)) > totalHorasEspecialidades);
            if (equipoExcedido) {
                popupService.warning('Horas Inválidas', `El tiempo de uso del equipo "${equipoExcedido.nombre}" (${Number(equipoExcedido.horas_uso) * Number(equipoExcedido.cantidad)}h) excede el total de horas de trabajo de las especialidades (${totalHorasEspecialidades}h) en el servicio: ${s.nombre}`);
                return;
            }
        }

        popupService.confirm('Generar Peritaje', '¿Desea generar el reporte de peritaje con esta información?', async () => {
            this.loading = true;

            const payload = {
                id_orden: this.ordenId,
                array_servicios: this.serviciosEditados.map(s => ({
                    id_orden_servicio: s.id_orden_servicio,
                    array_materiales: s.selectedMateriales.map(m => ({
                        id_material: m.id_material,
                        cantidad: Number(m.cantidad)
                    })),
                    array_tipos_equipos: s.selectedEquipos.map(e => ({
                        id_tipo_equipo: e.id_tipo_equipo,
                        cantidad: Number(e.cantidad),
                        horas_uso: Number(e.horas_uso)
                    })),
                    array_especialidades: s.selectedEspecialidades.map(esp => ({
                        id_especialidad: esp.id_especialidad,
                        cantidad: Number(esp.cantidad),
                        horas_hombre: Number(esp.horas_hombre)
                    }))
                }))
            };

            try {
                popupService.sendingEmail('Generando Peritaje...', 'Por favor espera un momento.');
                const res = await serviciosService.generarPeritaje(this.ordenId, payload);
                popupService.hide();
                if (res) {
                    popupService.success('Éxito', 'Peritaje generado correctamente');
                    navigator.goto(`/servicios/orden/detalles/${this.ordenId}`);
                }
            } catch (error) {
                popupService.warning('Error', 'Error al generar: ' + error.message);
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
                        <h1>Realizar Peritaje</h1>
                        <p style="color: var(--text-light); margin-top: 0.5rem;">Orden #${this.ordenId} - ${this.orden?.direccion}</p>
                    </div>
                    <button class="btn-back" @click=${() => navigator.goto(`/servicios/orden/detalles/${this.ordenId}`)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
                        Volver
                    </button>
                    
                </header>

                ${this.serviciosEditados.map((s, idx) => html`
                    <div class="card">
                        <div class="card-header">
                            <div class="service-title">
                                <span class="service-qty-badge">${s.cantidad}x</span>
                                ${s.nombre}
                            </div>
                        </div>
                        <div class="card-body">
                            ${s.descripcion ? html`
                                <div class="service-description" style="margin-bottom: 1.5rem; padding: 1rem; background: #f8fafc; border-radius: 8px; font-size: 0.95rem;">
                                    <strong style="color: var(--text-light);">Especificaciones del usuario:</strong><br>${s.descripcion}
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
                    </div>
                `)}

                <footer class="global-footer">
                    <button class="btn-save" @click=${this.handleSave} ?disabled=${this.loading}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        ${this.loading ? 'Generando...' : 'Generar Peritaje'}
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
                        <option value="">Seleccionar material requerido...</option>
                        ${this.materiales.map(m => html`
                            <option value=${m.id_material} ?disabled=${s.selectedMateriales.some(sm => sm.id_material === m.id_material)}>
                                ${m.nombre} (${m.unidad_medida})
                            </option>
                        `)}
                    </select>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th style="width: 100px;">Unidad</th>
                                <th style="width: 120px;">Cantidad</th>
                                <th style="width: 60px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${s.selectedMateriales.map(m => html`
                                <tr>
                                    <td>${m.nombre}</td>
                                    <td>${m.unidad_medida || 'N/A'}</td>
                                    <td><input type="number" step="0.1" .value=${m.cantidad} @input=${(e) => this.updateServiceItem(idx, 'selectedMateriales', 'id_material', m.id_material, 'cantidad', e.target.value)}></td>
                                    <td><button class="btn-remove" @click=${() => this.removeItem(idx, 'selectedMateriales', 'id_material', m.id_material)}>×</button></td>
                                </tr>
                            `)}
                            ${s.selectedMateriales.length === 0 ? html`<tr><td colspan="3" style="text-align: center; color: var(--text-light); padding: 1.5rem;">No hay materiales seleccionados</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            `;
        }

        if (s.activeTab === 'equipos') {
            return html`
                <div class="selection-row">
                    <select class="flex-grow" @change=${(e) => this.addItem(idx, 'equipo', e)}>
                        <option value="">Seleccionar equipo requerido...</option>
                        ${this.tiposEquipos.map(te => html`
                            <option value=${te.id_tipo_equipo} ?disabled=${s.selectedEquipos.some(se => se.id_tipo_equipo === te.id_tipo_equipo)}>
                                ${te.nombre}
                            </option>
                        `)}
                    </select>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th style="width: 120px;">Cant.</th>
                                <th style="width: 120px;">Horas Uso</th>
                                <th style="width: 60px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${s.selectedEquipos.map(e => html`
                                <tr>
                                    <td>${e.nombre}</td>
                                    <td><input type="number" .value=${e.cantidad} @input=${(ev) => this.updateServiceItem(idx, 'selectedEquipos', 'id_tipo_equipo', e.id_tipo_equipo, 'cantidad', ev.target.value)}></td>
                                    <td>
                                        <input 
                                            type="number" 
                                            step="0.1" 
                                            .value=${e.horas_uso} 
                                            @input=${(ev) => this.updateServiceItem(idx, 'selectedEquipos', 'id_tipo_equipo', e.id_tipo_equipo, 'horas_uso', ev.target.value)} 
                                        >
                                    </td>
                                    <td><button class="btn-remove" @click=${() => this.removeItem(idx, 'selectedEquipos', 'id_tipo_equipo', e.id_tipo_equipo)}>×</button></td>
                                </tr>
                            `)}
                            ${s.selectedEquipos.length === 0 ? html`<tr><td colspan="4" style="text-align: center; color: var(--text-light); padding: 1.5rem;">No hay equipos seleccionados</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            `;
        }

        if (s.activeTab === 'especialidades') {
            return html`
                <div class="selection-row">
                    <select class="flex-grow" @change=${(e) => this.addItem(idx, 'especialidad', e)}>
                        <option value="">Seleccionar especialidad requerida...</option>
                        ${this.especialidades.map(esp => html`
                            <option value=${esp.id_especialidad} ?disabled=${s.selectedEspecialidades.some(se => se.id_especialidad === esp.id_especialidad)}>
                                ${esp.nombre} - ${esp.nivel}
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
                                <th style="width: 120px;">Cant.</th>
                                <th style="width: 120px;">Horas Hombre</th>
                                <th style="width: 60px;"></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${s.selectedEspecialidades.map(esp => html`
                                <tr>
                                    <td>${esp.nombre}</td>
                                    <td>${esp.nivel}</td>
                                    <td><input type="number" .value=${esp.cantidad} @input=${(ev) => this.updateServiceItem(idx, 'selectedEspecialidades', 'id_especialidad', esp.id_especialidad, 'cantidad', ev.target.value)}></td>
                                    <td>
                                        <input 
                                            type="number" 
                                            step="0.1" 
                                            .value=${esp.horas_hombre} 
                                            @input=${(ev) => this.updateServiceItem(idx, 'selectedEspecialidades', 'id_especialidad', esp.id_especialidad, 'horas_hombre', ev.target.value)} 
                                        >
                                    </td>
                                    <td><button class="btn-remove" @click=${() => this.removeItem(idx, 'selectedEspecialidades', 'id_especialidad', esp.id_especialidad)}>×</button></td>
                                </tr>
                            `)}
                            ${s.selectedEspecialidades.length === 0 ? html`<tr><td colspan="5" style="text-align: center; color: var(--text-light); padding: 1.5rem;">No hay mano de obra seleccionada</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            `;
        }
    }
}

customElements.define('view-servicios-orden-peritaje', ViewServiciosOrdenPeritaje);
