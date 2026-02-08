import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { tiposServiciosService } from '../services/tipos-servicios-service.js';
import { materialesService } from '../services/materiales-service.js';
import { tiposEquiposService } from '../services/tipos-equipos-service.js';
import { especialidadesService } from '../services/especialidades-service.js';
import { serviciosService } from '../services/servicios-service.js';

export class ViewServiciosServicioForm extends LitElement {
    static properties = {
        servicioId: { type: String },
        servicio: { type: Object },
        tiposServicios: { type: Array },
        materiales: { type: Array },
        tiposEquipos: { type: Array },
        especialidades: { type: Array },
        tabActiva: { type: String },
        loading: { type: Boolean },
        costoTipo: { type: String }, // 'fijo' o 'variable'
        duracionUnidad: { type: String }, // 'horas' o 'dias'
        duracionValor: { type: Number },
        selectedMateriales: { type: Array },
        selectedEquipos: { type: Array },
        selectedEspecialidades: { type: Array }
    };

    static styles = css`
        :host {
            display: block;
            padding: 24px;
            font-family: 'Inter', sans-serif;
            color: #1a202c;
            max-width: 1200px;
            margin: 0 auto;
        }

        .form-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        h1 {
            margin: 0;
            font-size: 1.875rem;
            font-weight: 700;
            color: #2d3748;
        }

        .card {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
            padding: 24px;
            margin-bottom: 24px;
        }

        .grid-main {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-size: 0.875rem;
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 8px;
        }

        .input-field, .select-field, .textarea-field {
            width: 100%;
            padding: 10px 14px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.2s;
            box-sizing: border-box;
            background: #fff;
            color: #1a202c;
        }

        .input-field:focus, .select-field:focus, .textarea-field:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
        }

        .input-field:disabled {
            background: #f7fafc;
            color: #a0aec0;
            cursor: not-allowed;
        }

        .textarea-field {
            font-family: arial;
            min-height: 100px;
            resize: vertical;
        }

        .duration-container {
            display: flex;
            gap: 12px;
        }

        .duration-container .select-field {
            width: 120px;
        }

        .tabs {
            display: flex;
            border-bottom: 2px solid #e2e8f0;
            margin-bottom: 20px;
        }

        .tab {
            padding: 12px 24px;
            cursor: pointer;
            font-weight: 600;
            color: #718096;
            border-bottom: 2px solid transparent;
            margin-bottom: -2px;
            transition: all 0.2s;
        }

        .tab:hover {
            color: #4a5568;
        }

        .tab.active {
            color: #3182ce;
            border-bottom-color: #3182ce;
        }

        .table-container {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.875rem;
        }

        th {
            background: #f7fafc;
            text-align: left;
            padding: 12px;
            font-weight: 600;
            color: #4a5568;
            border-bottom: 1px solid #e2e8f0;
        }

        td {
            padding: 12px;
            border-bottom: 1px solid #edf2f7;
        }

        .action-cell {
            text-align: right;
        }

        .btn-remove {
            background: #fff5f5;
            color: #c53030;
            border: 1px solid #fed7d7;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.75rem;
        }

        .btn-remove:hover {
            background: #c53030;
            color: #fff;
        }

        .selection-panel {
            margin-top: 20px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px dashed #cbd5e1;
        }

        .totals-grid {
            margin-top: 24px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 16px;
        }

        .total-box {
            background: #f7fafc;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e2e8f0;
        }

        .total-box label {
            display: block;
            font-size: 0.75rem;
            color: #718096;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .total-box span {
            font-size: 1.25rem;
            font-weight: 700;
            color: #2d3748;
        }

        .actions-footer {
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
            gap: 16px;
        }

        .btn {
            padding: 10px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 1rem;
            border: none;
        }

        .btn-secondary {
            background: #edf2f7;
            color: #4a5568;
        }

        .btn-secondary:hover {
            background: #e2e8f0;
        }

        .btn-primary {
            background: #3182ce;
            color: #fff;
        }

        .btn-primary:hover {
            background: #2b6cb0;
        }

        .btn-primary:disabled {
            background: #a0aec0;
            cursor: not-allowed;
        }

        .badge-count {
            background: #e2e8f0;
            color: #4a5568;
            padding: 2px 6px;
            border-radius: 9999px;
            font-size: 0.75rem;
            margin-left: 6px;
        }

        .hidden {
            display: none !important;
        }
    `;

    constructor() {
        super();
        this.servicio = {
            id_tipo_servicio: '',
            nombre: '',
            descripcion: '',
            unidad_medida: '',
            servicio_tabulado: true,
            precio_materiales: 0,
            precio_tipos_equipos: 0,
            precio_mano_obra: 0,
            precio_general: 0,
            duracion_horas: 1,
            array_materiales: [],
            array_tipos_equipos: [],
            array_especialidades: []
        };
        this.tabActiva = 'materiales';
        this.tiposServicios = [];
        this.materiales = [];
        this.tiposEquipos = [];
        this.especialidades = [];
        this.loading = false;
        this.selectedMateriales = [];
        this.selectedEquipos = [];
        this.selectedEspecialidades = [];
        this.costoTipo = 'fijo';
        this.duracionUnidad = 'horas';
        this.duracionValor = 1;
    }

    async connectedCallback() {
        super.connectedCallback();
        this.loadData();
    }

    async loadData() {
        const [ts, m, te, e] = await Promise.all([
            tiposServiciosService.getTiposServicios(),
            materialesService.getMateriales(),
            tiposEquiposService.getTiposEquipos(),
            especialidadesService.getEspecialidades()
        ]);

        this.tiposServicios = ts || [];
        this.materiales = m || [];
        this.tiposEquipos = te || [];
        this.especialidades = e || [];

        if (this.servicioId) {
            this.loadServicio(this.servicioId);
        }
    }

    async loadServicio(id) {
        this.loading = true;
        const data = await serviciosService.getOneServicio(id);
        if (data) {
            this.servicio = data;
            this.costoTipo = data.servicio_tabulado ? 'fijo' : 'variable';
            this.duracionValor = data.duracion_horas;
            this.duracionUnidad = 'horas';

            // Map selected items
            this.selectedMateriales = (data.array_materiales || []).map(item => {
                const full = this.materiales.find(m => m.id_material === item.id_material);
                return { ...full, cantidad: item.cantidad_servicio || item.cantidad };
            });
            this.selectedEquipos = (data.array_tipos_equipos || []).map(item => {
                const full = this.tiposEquipos.find(te => te.id_tipo_equipo === item.id_tipo_equipo);
                return { ...full, cantidad: item.cantidad_servicio || item.cantidad, horas_uso: item.horas_uso };
            });
            this.selectedEspecialidades = (data.array_especialidades || []).map(item => {
                const full = this.especialidades.find(esp => esp.id_especialidad === item.id_especialidad);
                return { ...full, cantidad: item.cantidad_servicio || item.cantidad, horas_hombre: item.horas_hombre };
            });
        }
        this.loading = false;
    }

    handleMainInput(e) {
        const { name, value } = e.target;
        if (name === 'servicio_tabulado') {
            this.costoTipo = value;
            this.servicio = { ...this.servicio, servicio_tabulado: value === 'fijo' };
        } else {
            this.servicio = { ...this.servicio, [name]: value };
        }
    }

    handleDurationValue(e) {
        this.duracionValor = Number(e.target.value);
        this.validateItemsDuration();
    }

    handleDurationUnit(e) {
        this.duracionUnidad = e.target.value;
        this.validateItemsDuration();
    }

    validateItemsDuration() {
        const maxHoras = this.actualDuracionHoras;

        // con map
        this.selectedEquipos = this.selectedEquipos.map(e => ({
            ...e,
            horas_uso: Math.min(Number(e.horas_uso), maxHoras)
        }));

        // con foreach
        // this.selectedEquipos.forEach(e => {
        //     e.horas_uso = Math.min(Number(e.horas_uso), maxHoras);
        // });

        // con for
        // for (let i = 0; i < this.selectedEquipos.length; i++) {
        //     this.selectedEquipos[i].horas_uso = Math.min(Number(this.selectedEquipos[i].horas_uso), maxHoras);
        // }

        this.selectedEspecialidades = this.selectedEspecialidades.map(esp => ({
            ...esp,
            horas_hombre: Math.min(Number(esp.horas_hombre), maxHoras)
        }));
    }

    get actualDuracionHoras() {
        return this.duracionUnidad === 'dias' ? this.duracionValor * 8 : this.duracionValor;
    }

    // Totals calculations
    get montoMateriales() {
        return this.selectedMateriales.reduce((acc, m) => acc + (Number(m.cantidad) * Number(m.precio_unitario || 0)), 0);
    }

    get montoEquipos() {
        return this.selectedEquipos.reduce((acc, e) => acc + (Number(e.cantidad) * Number(e.horas_uso) * Number(e.costo_hora || 0)), 0);
    }

    get montoEspecialidades() {
        return this.selectedEspecialidades.reduce((acc, esp) => acc + (Number(esp.cantidad) * Number(esp.horas_hombre) * Number(esp.tarifa_hora || 0)), 0);
    }

    get precioGeneral() {
        return this.montoMateriales + this.montoEquipos + this.montoEspecialidades;
    }

    // Selection handlers
    addMaterial(e) {
        const id = e.target.value;
        if (!id) return;
        const material = this.materiales.find(m => m.id_material === id);
        if (material && !this.selectedMateriales.find(m => m.id_material === id)) {
            this.selectedMateriales = [...this.selectedMateriales, { ...material, cantidad: 1 }];
        }
        e.target.value = '';
    }

    addEquipo(e) {
        const id = e.target.value;
        if (!id) return;
        const equipo = this.tiposEquipos.find(te => te.id_tipo_equipo === id);
        if (equipo && !this.selectedEquipos.find(te => te.id_tipo_equipo === id)) {
            const initialHours = Math.min(1, this.actualDuracionHoras);
            this.selectedEquipos = [...this.selectedEquipos, { ...equipo, cantidad: 1, horas_uso: initialHours }];
        }
        e.target.value = '';
    }

    addEspecialidad(e) {
        const id = e.target.value;
        if (!id) return;
        const especialidad = this.especialidades.find(esp => esp.id_especialidad === id);
        if (especialidad && !this.selectedEspecialidades.find(esp => esp.id_especialidad === id)) {
            const initialHours = Math.min(1, this.actualDuracionHoras);
            this.selectedEspecialidades = [...this.selectedEspecialidades, { ...especialidad, cantidad: 1, horas_hombre: initialHours }];
        }
        e.target.value = '';
    }

    // Update handlers for selected items
    updateItem(arrayName, idField, id, field, value) {
        this[arrayName] = this[arrayName].map(item => {
            if (item[idField] === id) {
                let finalValue = value;
                // Validation: hours cannot exceed service duration
                if ((field === 'horas_uso' || field === 'horas_hombre') && Number(value) > this.actualDuracionHoras) {
                    alert(`El tiempo (${value}h) no puede ser mayor a la duración del servicio (${this.actualDuracionHoras}h)`);
                    finalValue = this.actualDuracionHoras;

                    // Sobrescribir el valor del input en el DOM inmediatamente
                    const inputElement = this.shadowRoot.querySelector(`input[data-id="${id}"][data-field="${field}"]`);
                    if (inputElement) {
                        inputElement.value = finalValue;
                    }
                }
                return { ...item, [field]: finalValue };
            }
            return item;
        });
    }

    removeItem(arrayName, idField, id) {
        this[arrayName] = this[arrayName].filter(item => item[idField] !== id);
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Base payload con datos comunes
        let payload = {
            id_tipo_servicio: this.servicio.id_tipo_servicio,
            nombre: this.servicio.nombre,
            descripcion: this.servicio.descripcion,
            unidad_medida: this.servicio.unidad_medida,
            servicio_tabulado: this.costoTipo === 'fijo'
        };

        // Si es costo fijo, agregamos todos los detalles de precios y desgloses
        if (this.costoTipo === 'fijo') {
            payload = {
                ...payload,
                precio_materiales: this.montoMateriales,
                precio_tipos_equipos: this.montoEquipos,
                precio_mano_obra: this.montoEspecialidades,
                precio_general: this.precioGeneral,
                duracion_horas: this.actualDuracionHoras,
                array_materiales: this.selectedMateriales.map(m => ({ id_material: m.id_material, cantidad: Number(m.cantidad) })),
                array_tipos_equipos: this.selectedEquipos.map(e => ({ id_tipo_equipo: e.id_tipo_equipo, cantidad: Number(e.cantidad), horas_uso: Number(e.horas_uso) })),
                array_especialidades: this.selectedEspecialidades.map(esp => ({ id_especialidad: esp.id_especialidad, cantidad: Number(esp.cantidad), horas_hombre: Number(esp.horas_hombre) }))
            };
        }

        try {
            this.loading = true;
            if (this.servicioId) {
                await serviciosService.updateServicio(this.servicioId, payload);
                alert('Servicio actualizado correctamente');
            } else {
                await serviciosService.createServicio(payload);
                alert('Servicio creado correctamente');
            }
            navigator.goto('/servicios/listado/servicio');
        } catch (error) {
            alert('Error al guardar: ' + error.message);
        } finally {
            this.loading = false;
        }
    }

    render() {
        const isFijo = this.costoTipo === 'fijo';

        return html`
            <div class="form-header">
                <h1>${this.servicioId ? 'Editar Servicio' : 'Nuevo Servicio'}</h1>
                <button class="btn btn-secondary" @click=${() => navigator.goto('/categoria/00017')}>Volver</button>
            </div>

            <form @submit=${this.handleSubmit}>
                <div class="card">
                    <div class="grid-main">
                        <div class="left-col">
                            <div class="form-group">
                                <label>Tipo de Servicio</label>
                                <select class="select-field" name="id_tipo_servicio" .value=${this.servicio.id_tipo_servicio} @change=${this.handleMainInput} required>
                                    <option value="">Seleccione un tipo</option>
                                    ${this.tiposServicios.map(ts => html`<option value=${ts.id_tipo_servicio}>${ts.nombre}</option>`)}
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Servicio</label>
                                <input type="text" class="input-field" name="nombre" .value=${this.servicio.nombre} @input=${this.handleMainInput} placeholder="Ingrese el nombre del servicio" required>
                            </div>

                            <div class="form-group">
                                <label>Descripción</label>
                                <textarea class="textarea-field" name="descripcion" .value=${this.servicio.descripcion} @input=${this.handleMainInput} placeholder="Ingrese una descripción del servicio"></textarea>
                            </div>
                        </div>

                        <div class="right-col">
                            <div class="form-group" style="width: 150px;">
                                <label>Unidad de Medida</label>
                                <input type="text" class="input-field" name="unidad_medida" .value=${this.servicio.unidad_medida} @input=${this.handleMainInput} placeholder="Ej: m2, ud, h" required>
                            </div>

                            <div class="form-group">
                                <label>Costo</label>
                                <select class="select-field" name="servicio_tabulado" .value=${this.costoTipo} @change=${this.handleMainInput}>
                                    <option value="fijo">Costo Fijo</option>
                                    <option value="variable">Costo Variable</option>
                                </select>
                            </div>

                            <div class="form-group ${isFijo ? '' : 'hidden'}">
                                <label>Monto Total (Automático)</label>
                                <input type="text" class="input-field" .value=${this.precioGeneral.toFixed(2)} disabled>
                            </div>
                            
                            <div class="form-group ${isFijo ? '' : 'hidden'}">
                                <label>Duración del Servicio</label>
                                <div class="duration-container">
                                    <select class="select-field" .value=${this.duracionUnidad} @change=${this.handleDurationUnit}>
                                        <option value="horas">Horas</option>
                                        <option value="dias">Días</option>
                                    </select>
                                    <input type="number" class="input-field" .value=${this.duracionValor} @input=${this.handleDurationValue} min="0.1" step="0.1">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card ${isFijo ? '' : 'hidden'}">
                    <div class="tabs">
                        <div class="tab ${this.tabActiva === 'materiales' ? 'active' : ''}" @click=${() => this.tabActiva = 'materiales'}>
                            Materiales <span class="badge-count">${this.selectedMateriales.length}</span>
                        </div>
                        <div class="tab ${this.tabActiva === 'equipos' ? 'active' : ''}" @click=${() => this.tabActiva = 'equipos'}>
                            Equipos <span class="badge-count">${this.selectedEquipos.length}</span>
                        </div>
                        <div class="tab ${this.tabActiva === 'especialidades' ? 'active' : ''}" @click=${() => this.tabActiva = 'especialidades'}>
                            Especialidades <span class="badge-count">${this.selectedEspecialidades.length}</span>
                        </div>
                    </div>

                    <div class="tab-content">
                        ${this.renderActiveTab()}
                    </div>

                    <div class="totals-grid">
                        <div class="total-box">
                            <label>Materiales</label>
                            <span>$${this.montoMateriales.toFixed(2)}</span>
                        </div>
                        <div class="total-box">
                            <label>Equipos</label>
                            <span>$${this.montoEquipos.toFixed(2)}</span>
                        </div>
                        <div class="total-box">
                            <label>Mano de Obra</label>
                            <span>$${this.montoEspecialidades.toFixed(2)}</span>
                        </div>
                        <div class="total-box" style="background: #ebf8ff; border-color: #bee3f8;">
                            <label>Total</label>
                            <span style="color: #2b6cb0;">$${this.precioGeneral.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div class="actions-footer">
                    <button type="button" class="btn btn-secondary" @click=${() => this.servicioId ? navigator.goto('/servicios/listado/servicio') : navigator.goto('/categoria/00017')}>Cancelar</button>
                    <button type="submit" class="btn btn-primary" ?disabled=${this.loading}>
                        ${this.loading ? 'Guardando...' : 'Guardar Servicio'}
                    </button>
                </div>
            </form>
        `;
    }

    renderActiveTab() {
        switch (this.tabActiva) {
            case 'materiales': return this.renderMateriales();
            case 'equipos': return this.renderEquipos();
            case 'especialidades': return this.renderEspecialidades();
            default: return '';
        }
    }

    renderMateriales() {
        return html`
            <div class="selection-panel">
                <label style="font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 8px; display: block;">Agregar Material</label>
                <select class="select-field" @change=${this.addMaterial}>
                    <option value="">Seleccione para añadir...</option>
                    ${this.materiales.map(m => html`<option value=${m.id_material} ?disabled=${this.selectedMateriales.some(sm => sm.id_material === m.id_material)}>${m.nombre} ($${m.precio_unitario}/${m.unidad_medida})</option>`)}
                </select>
            </div>
            
            <div class="table-container" style="margin-top: 15px;">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Unidad</th>
                            <th style="width: 100px;">Cantidad</th>
                            <th>P. Unitario</th>
                            <th>Subtotal</th>
                            <th style="width: 50px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.selectedMateriales.map(m => html`
                            <tr>
                                <td>${m.nombre}</td>
                                <td>${m.unidad_medida}</td>
                                <td><input type="number" class="input-field" style="padding: 4px 8px;" .value=${m.cantidad} @input=${(e) => this.updateItem('selectedMateriales', 'id_material', m.id_material, 'cantidad', e.target.value)} min="0.1" step="0.1"></td>
                                <td>$${Number(m.precio_unitario).toFixed(2)}</td>
                                <td>$${(m.cantidad * m.precio_unitario).toFixed(2)}</td>
                                <td class="action-cell"><button type="button" class="btn-remove" @click=${() => this.removeItem('selectedMateriales', 'id_material', m.id_material)}>×</button></td>
                            </tr>
                        `)}
                        ${this.selectedMateriales.length === 0 ? html`<tr><td colspan="6" style="text-align: center; color: #a0aec0;">No hay materiales seleccionados</td></tr>` : ''}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderEquipos() {
        return html`
            <div class="selection-panel">
                <label style="font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 8px; display: block;">Agregar Equipo</label>
                <select class="select-field" @change=${this.addEquipo}>
                    <option value="">Seleccione para añadir...</option>
                    ${this.tiposEquipos.map(te => html`<option value=${te.id_tipo_equipo} ?disabled=${this.selectedEquipos.some(se => se.id_tipo_equipo === te.id_tipo_equipo)}>${te.nombre} ($${te.costo_hora}/h)</option>`)}
                </select>
            </div>

            <div class="table-container" style="margin-top: 15px;">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th style="width: 80px;">Cant.</th>
                            <th style="width: 80px;">Horas Uso</th>
                            <th>Costo Hora</th>
                            <th>Subtotal</th>
                            <th style="width: 50px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.selectedEquipos.map(e => html`
                            <tr>
                                <td>${e.nombre}</td>
                                <td><input type="number" class="input-field" style="padding: 4px 8px;" .value=${e.cantidad} @input=${(e_ev) => this.updateItem('selectedEquipos', 'id_tipo_equipo', e.id_tipo_equipo, 'cantidad', e_ev.target.value)} min="1"></td>
                                <td><input type="number" class="input-field" style="padding: 4px 8px;" .value=${e.horas_uso} data-id=${e.id_tipo_equipo} data-field="horas_uso" @input=${(e_ev) => this.updateItem('selectedEquipos', 'id_tipo_equipo', e.id_tipo_equipo, 'horas_uso', e_ev.target.value)} min="0.1" step="0.1"></td>
                                <td>$${Number(e.costo_hora).toFixed(2)}</td>
                                <td>$${(e.cantidad * e.horas_uso * e.costo_hora).toFixed(2)}</td>
                                <td class="action-cell"><button type="button" class="btn-remove" @click=${() => this.removeItem('selectedEquipos', 'id_tipo_equipo', e.id_tipo_equipo)}>×</button></td>
                            </tr>
                        `)}
                        ${this.selectedEquipos.length === 0 ? html`<tr><td colspan="6" style="text-align: center; color: #a0aec0;">No hay equipos seleccionados</td></tr>` : ''}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderEspecialidades() {
        return html`
            <div class="selection-panel">
                <label style="font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 8px; display: block;">Agregar Especialidad</label>
                <select class="select-field" @change=${this.addEspecialidad}>
                    <option value="">Seleccione para añadir...</option>
                    ${this.especialidades.map(esp => html`<option value=${esp.id_especialidad} ?disabled=${this.selectedEspecialidades.some(se => se.id_especialidad === esp.id_especialidad)}>${esp.nombre} ${esp.nivel} ($${esp.tarifa_hora}/h)</option>`)}
                </select>
            </div>

            <div class="table-container" style="margin-top: 15px;">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Nivel</th>
                            <th style="width: 80px;">Cant.</th>
                            <th style="width: 80px;">Horas H.</th>
                            <th>Tarifa Hora</th>
                            <th>Subtotal</th>
                            <th style="width: 50px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.selectedEspecialidades.map(esp => html`
                            <tr>
                                <td>${esp.nombre}</td>
                                <td>${esp.nivel}</td>
                                <td><input type="number" class="input-field" style="padding: 4px 8px;" .value=${esp.cantidad} @input=${(e_ev) => this.updateItem('selectedEspecialidades', 'id_especialidad', esp.id_especialidad, 'cantidad', e_ev.target.value)} min="1"></td>
                                <td><input type="number" class="input-field" style="padding: 4px 8px;" .value=${esp.horas_hombre} data-id=${esp.id_especialidad} data-field="horas_hombre" @input=${(e_ev) => this.updateItem('selectedEspecialidades', 'id_especialidad', esp.id_especialidad, 'horas_hombre', e_ev.target.value)} min="0.1" step="0.1"></td>
                                <td>$${Number(esp.tarifa_hora).toFixed(2)}</td>
                                <td>$${(esp.cantidad * esp.horas_hombre * esp.tarifa_hora).toFixed(2)}</td>
                                <td class="action-cell"><button type="button" class="btn-remove" @click=${() => this.removeItem('selectedEspecialidades', 'id_especialidad', esp.id_especialidad)}>×</button></td>
                            </tr>
                        `)}
                        ${this.selectedEspecialidades.length === 0 ? html`<tr><td colspan="7" style="text-align: center; color: #a0aec0;">No hay especialidades seleccionadas</td></tr>` : ''}
                    </tbody>
                </table>
            </div>
        `;
    }
}

customElements.define('view-servicios-servicio-form', ViewServiciosServicioForm);
