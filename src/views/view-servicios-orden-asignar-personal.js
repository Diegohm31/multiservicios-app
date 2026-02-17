import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { serviciosService } from '../services/servicios-service.js';
import { operativosService } from '../services/operativos-service.js';
import { equiposService } from '../services/equipos-service.js';

export class ViewServiciosOrdenAsignarPersonal extends LitElement {
    static properties = {
        ordenId: { type: String },
        orden: { type: Object },
        operativos: { type: Array },
        equiposFull: { type: Array },
        loading: { type: Boolean },
        assignments: { type: Object }, // { serviceId: { operatives: [], equipos: [] } }
        activeTabs: { type: Object } // { serviceId: 'operativos' | 'equipos' | 'materiales' }
    };

    static styles = css`
        :host {
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --bg: #fff;
            --card-bg: #ffffff;
            --text: #1e293b;
            --text-light: #64748b;
            --border: #e2e8f0;
            --radius: 16px;
            --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            
            display: block;
            padding: 2rem 1rem;
            font-family: 'Inter', system-ui, sans-serif;
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
            background: white;
            padding: 1.5rem 2rem;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            border: 1px solid var(--border);
        }

        .order-info {
            display: flex;
            align-items: center;
            gap: 2rem;
        }

        .datetime-display {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .datetime-display label {
            font-size: 0.75rem;
            font-weight: 700;
            color: var(--text-light);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .datetime-display span {
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--primary);
        }

        .card-service {
            background: var(--card-bg);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            margin-bottom: 2.5rem;
            border: 1px solid var(--border);
            overflow: hidden;
        }

        .service-header {
            padding: 1.5rem 2rem;
            background: #fcfcfc;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .service-title {
            font-size: 1.35rem;
            font-weight: 800;
            color: var(--text);
            letter-spacing: -0.02em;
        }

        .tabs {
            display: flex;
            gap: 1.5rem;
            padding: 0 2rem;
            background: white;
            border-bottom: 1px solid var(--border);
        }

        .tab {
            padding: 1rem 0.5rem;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.9rem;
            color: var(--text-light);
            border-bottom: 3px solid transparent;
            transition: all 0.2s;
            background: none;
            border-top: none;
            border-left: none;
            border-right: none;
        }

        .tab:hover {
            color: var(--primary);
        }

        .tab.active {
            color: var(--primary);
            border-bottom-color: var(--primary);
        }

        .tab-content {
            padding: 1.5rem 2rem;
        }

        .assignment-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }

        .assignment-table th {
            text-align: center;
            padding: 0.75rem 1rem;
            font-size: 0.75rem;
            text-transform: uppercase;
            color: var(--text-light);
            font-weight: 700;
            letter-spacing: 0.05em;
            border-bottom: 1px solid var(--border);
        }

        .assignment-table th:first-child,
        .assignment-table td:first-child {
            text-align: left;
        }

        .assignment-table td {
            padding: 1rem 0.75rem;
            border-bottom: 1px solid #f8fafc;
            vertical-align: middle;
            text-align: center;
        }

        .empty-state {
            padding: 3rem;
            text-align: center;
            color: var(--text-light);
            background: #f8fafc;
            border-radius: 12px;
            border: 2px dashed var(--border);
            font-weight: 500;
            font-size: 0.95rem;
        }

        .req-label {
            font-weight: 600;
            color: var(--text);
        }

        .input-op, .input-dt {
            width: 100%;
            padding: 0.625rem 1rem;
            border: 1px solid var(--border);
            border-radius: 8px;
            font-family: inherit;
            font-size: 0.9rem;
            background: white;
            color: black;
            transition: all 0.2s;
            box-sizing: border-box;
            text-align: center;
        }

        input::-webkit-calendar-picker-indicator {
            cursor: pointer;
            filter: invert(0.2); /* Soften the icon slightly or ensures it's shown */
        }

        .input-op:focus, .input-dt:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .input-dt {
            min-width: 160px;
        }

        .global-footer {
            position: sticky;
            bottom: 2rem;
            background: var(--text);
            color: white;
            padding: 1.25rem 2rem;
            border-radius: var(--radius);
            display: flex;
            justify-content: flex-end;
            align-items: center;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
            margin-top: 3rem;
            z-index: 10;
        }

        .btn-confirm {
            background: var(--primary);
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 10px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 1rem;
        }

        .btn-confirm:hover {
            background: var(--primary-hover);
            transform: translateY(-2px);
        }

        .btn-back {
            background: #f1f5f9;
            color: var(--text);
            border: 1px solid var(--border);
            padding: 0.5rem 1.25rem;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s;
        }

        .btn-back:hover {
            background: #e2e8f0;
        }

        .read-only-badge {
            font-size: 0.7rem;
            background: #fee2e2;
            color: #991b1b;
            padding: 0.2rem 0.6rem;
            border-radius: 6px;
            font-weight: 700;
            margin-left: 0.5rem;
            text-transform: uppercase;
        }

        .loader {
            border: 3px solid #f3f3f3;
            border-top: 3px solid var(--primary);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .nivel-badge {
            font-size: 0.7rem;
            background: #f1f5f9;
            color: #475569;
            padding: 0.15rem 0.5rem;
            border-radius: 4px;
            font-weight: 700;
            margin-top: 0.25rem;
            display: inline-block;
            border: 1px solid var(--border);
        }

        .checkbox-container {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            position: relative;
            cursor: pointer;
            user-select: none;
        }

        .checkbox-container input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
        }

        .checkmark {
            height: 22px;
            width: 22px;
            background-color: #f8fafc;
            border: 2px solid #cbd5e1;
            border-radius: 6px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        .checkbox-container:hover input ~ .checkmark {
            border-color: var(--primary);
            background-color: #f1f5f9;
        }

        .checkbox-container input:checked ~ .checkmark {
            background-color: var(--primary);
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .checkmark:after {
            content: "";
            position: absolute;
            display: none;
            left: 6.5px;
            top: 2.5px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2.5px 2.5px 0;
            transform: rotate(45deg);
        }

        .checkbox-container input:checked ~ .checkmark:after {
            display: block;
        }
    `;

    constructor() {
        super();
        this.ordenId = '';
        this.orden = null;
        this.operativos = [];
        this.loading = true;
        this.assignments = {};
        this.activeTabs = {};
        this.allAssignments = { operativos: [], equipos: [] };
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadData();
    }

    async loadData() {
        this.loading = true;
        try {
            // Cargar datos reales desde la API utilizando los servicios correspondientes
            const [orderData, ops, eqs, allAsignaciones] = await Promise.all([
                serviciosService.getOneOrdenAsignarPersonal(this.ordenId),
                operativosService.getAllOperativos(),
                equiposService.getEquipos(),
                serviciosService.getAllAsignaciones()
            ]);

            // Mapear los nombres de las claves del backend (español) a las que usa el frontend (inglés)
            this.allAssignments = {
                operatives: allAsignaciones?.operativos || [],
                equipos: allAsignaciones?.equipos || []
            };

            if (!orderData) throw new Error('No se pudo obtener la orden');

            this.orden = {
                ...orderData,
                servicios: orderData.array_servicios || []
            };

            // Mapear operativos para que tengan el formato esperado con array de especialidades
            this.operativos = (ops || []).map(o => ({
                id_operativo: o.id_operativo,
                nombre: o.nombre,
                especialidades: (o.array_especialidades || []).map(ae => ae.id_especialidad)
            }));

            this.equiposFull = eqs || [];

            const initAssignments = {};
            const initTabs = {};

            // Sugerir fecha de inicio basada en hoy
            const suggestedDate = (new Date().toISOString().split('T')[0]);

            this.orden.servicios.forEach(s => {
                const key = s.id_orden_servicio;
                initTabs[key] = 'operativos';
                const sAssign = { operatives: [], equipos: [] };

                // Personal requerido (Especialidades)
                (s.array_especialidades || []).forEach(esp => {
                    const horas = parseFloat(esp.horas_hombre || esp.horas || 1);
                    const count = parseInt(esp.cantidad_orden_servicio_especialidad || esp.cantidad_especialidad || esp.cantidad || 1);
                    const nombre = esp.nombre || ('Especialidad ' + esp.id_especialidad);

                    // Buscar operativos ya asignados para esta especialidad en este servicio
                    const existingOps = (s.operadores_asignados || []).filter(oa => oa.id_especialidad == esp.id_especialidad);

                    for (let i = 0; i < count; i++) {
                        const existing = existingOps[i];

                        // Si ya existe asignación en DB, usar sus datos; si no, calcular sugeridos
                        const start = existing
                            ? new Date(existing.fecha_inicio.replace(' ', 'T'))
                            : new Date(`${suggestedDate}T08:00`);
                        const end = existing
                            ? new Date(existing.fecha_fin.replace(' ', 'T'))
                            : new Date(start.getTime() + horas * 60 * 60 * 1000);

                        sAssign.operatives.push({
                            id_especialidad: esp.id_especialidad,
                            nombre_especialidad: nombre,
                            nivel: esp.nivel || 'N/A',
                            horas_req: horas,
                            id_operativo: existing ? existing.id_operativo : '',
                            fecha_inicio: this.formatDateForInput(start),
                            fecha_fin: this.formatDateForInput(end),
                            es_jefe: existing ? parseInt(existing.es_jefe) : 0
                        });
                    }
                });

                // Equipos requeridos
                (s.array_tipos_equipos || []).forEach(te => {
                    const horas = parseFloat(te.horas_uso || te.horas || 1);
                    const count = parseInt(te.cantidad_orden_servicio_tipo_equipo || te.cantidad_tipo_equipo || te.cantidad || 1);
                    const nombre = te.nombre || ('Equipo ' + te.id_tipo_equipo);

                    // Buscar equipos ya asignados para este tipo en este servicio
                    const existingEqs = (s.equipos_asignados || []).filter(ea => {
                        const fullEq = this.equiposFull.find(ef => ef.id_equipo == ea.id_equipo);
                        return fullEq && fullEq.id_tipo_equipo == te.id_tipo_equipo;
                    });

                    for (let i = 0; i < count; i++) {
                        const existing = existingEqs[i];
                        const start = existing
                            ? new Date(existing.fecha_inicio.replace(' ', 'T'))
                            : new Date(`${suggestedDate}T08:00`);
                        const end = existing
                            ? new Date(existing.fecha_fin.replace(' ', 'T'))
                            : new Date(start.getTime() + horas * 60 * 60 * 1000);

                        sAssign.equipos.push({
                            id_tipo_equipo: te.id_tipo_equipo,
                            nombre_equipo: nombre,
                            horas_req: horas,
                            id_unidad_equipo: existing ? existing.id_equipo : '',
                            fecha_inicio: this.formatDateForInput(start),
                            fecha_fin: this.formatDateForInput(end)
                        });
                    }
                });

                initAssignments[key] = sAssign;
            });

            this.assignments = initAssignments;
            this.activeTabs = initTabs;

        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error al cargar la información: ' + error.message);
        } finally {
            this.loading = false;
        }
    }
    formatDateForInput(date) {
        const pad = (n) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    checkOverlap(resourceId, startStr, endStr, serviceId, type, currentIndex) {
        if (!resourceId || !startStr || !endStr) return null;

        const newStart = new Date(startStr);
        const newEnd = new Date(endStr);

        if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) return null;

        const idField = type === 'operatives' ? 'id_operativo' : 'id_unidad_equipo';

        // Normalize IDs to handle potential padding differences (e.g., '00005' vs '5')
        const normalizeId = (id) => String(id || '').trim().replace(/^0+/, '') || '0';
        const resIdNormalized = normalizeId(resourceId);

        //console.log(`[Validation] Checking ${type} ID: ${resourceId} (${resIdNormalized}). Range: ${startStr} to ${endStr}`);

        // 1. Check internal overlap (local unsaved state)
        for (const sId in this.assignments) {
            const list = this.assignments[sId][type] || [];
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (sId == serviceId && i === currentIndex) continue;

                if (normalizeId(item[idField]) === resIdNormalized && item.fecha_inicio && item.fecha_fin) {
                    const exStart = new Date(item.fecha_inicio);
                    const exEnd = new Date(item.fecha_fin);

                    if (newStart < exEnd && newEnd > exStart) {
                        // console.warn('[Conflict] Found in local/unsaved state!', item);
                        return {
                            type: 'internal',
                            name: this.orden.servicios.find(s => s.id_orden_servicio == sId)?.nombre || `Servicio ${sId}`,
                            role: type === 'operatives' ? item.nombre_especialidad : item.nombre_equipo
                        };
                    }
                }
            }
        }

        // 2. Check external overlap (Database state)
        // Note: In DB structure for equipos, the ID field is 'id_equipo'
        const dbIdField = type === 'operatives' ? 'id_operativo' : 'id_equipo';
        const externalList = this.allAssignments[type] || [];

        // console.log(`[Validation] Scanning ${externalList.length} external assignments for potential overlap...`);

        for (const item of externalList) {
            // Check if it's the SAME resource
            if (normalizeId(item[dbIdField]) === resIdNormalized && item.fecha_inicio && item.fecha_fin) {

                // Normalize date string from "YYYY-MM-DD HH:mm:ss" to "YYYY-MM-DDTHH:mm:ss"
                const exStart = new Date(item.fecha_inicio.toString().replace(' ', 'T'));
                const exEnd = new Date(item.fecha_fin.toString().replace(' ', 'T'));

                if (!isNaN(exStart.getTime()) && !isNaN(exEnd.getTime())) {
                    if (newStart < exEnd && newEnd > exStart) {
                        // console.warn('[Conflict] Found in Database (External)!', item);
                        return {
                            type: 'external',
                            orderId: item.id_orden,
                            role: type === 'operatives' ? 'Personal' : 'Equipo'
                        };
                    }
                }
            }
        }

        return null;
    }

    updateAssignment(serviceId, type, index, field, value) {
        const tempAssigns = JSON.parse(JSON.stringify(this.assignments));
        const slot = tempAssigns[serviceId][type][index];
        const idField = type === 'operatives' ? 'id_operativo' : 'id_unidad_equipo';

        if (field === idField || field === 'fecha_inicio' || field === 'fecha_fin') {
            const resId = field === idField ? value : slot[idField];
            const start = field === 'fecha_inicio' ? value : slot.fecha_inicio;
            const end = field === 'fecha_fin' ? value : slot.fecha_fin;

            if (resId) {
                // 1. STRICT BLOCK: Same service, same resource duplication
                const isDuplicate = tempAssigns[serviceId][type].some((item, i) =>
                    i !== index && item[idField] === resId &&
                    (type === 'operatives' ? item.id_especialidad === slot.id_especialidad : item.id_tipo_equipo === slot.id_tipo_equipo)
                );

                if (isDuplicate) {
                    const label = type === 'operatives' ? 'personal' : 'equipo';
                    alert(`ACCIÓN BLOQUEADA: Este ${label} ya está asignado a este mismo requerimiento en este servicio.`);
                    this.requestUpdate();
                    return;
                }

                // 2. CONFIRMATION: Schedule overlap
                if (start && end) {
                    const overlap = this.checkOverlap(resId, start, end, serviceId, type, index);
                    if (overlap) {
                        const msg = overlap.type === 'internal'
                            ? `¡Conflicto de horario! El recurso ya está asignado al servicio "${overlap.name}" (${overlap.role}) en esta misma orden.`
                            : `¡Conflicto global! El recurso ya tiene una asignación en la Orden #${overlap.orderId} para ese mismo horario.`;
                        alert(msg);
                        // Optionally, we could clear the value, but let's just warn for now as requested
                        // if (field === 'id_operativo' || field === 'id_unidad_equipo') list[index][field] = '';
                    }
                }
            }
        }

        if (field === 'es_jefe' && value === 1) {
            // Only one jefe per service: uncheck others
            tempAssigns[serviceId][type].forEach((op, i) => {
                if (i !== index) op.es_jefe = 0;
            });
        }

        slot[field] = value;
        this.assignments = tempAssigns;
        this.requestUpdate();
    }

    isServiceComplete(serviceId) {
        const s = this.assignments[serviceId];
        if (!s) return false;
        const opsComplete = (s.operatives || []).length > 0 && s.operatives.every(o => o.id_operativo !== '');
        const eqsComplete = (s.equipos || []).every(e => e.id_unidad_equipo !== '');
        const hasJefe = (s.operatives || []).filter(op => op.es_jefe === 1).length === 1;
        return opsComplete && eqsComplete && hasJefe;
    }

    getServiceDates(serviceId) {
        const s = this.assignments[serviceId];
        if (!s) return { start: null, end: null };

        const opsStart = (s.operatives || []).map(o => o.fecha_inicio).filter(d => d);
        const opsEnd = (s.operatives || []).map(o => o.fecha_fin).filter(d => d);
        const eqsStart = (s.equipos || []).map(e => e.fecha_inicio).filter(d => d);
        const eqsEnd = (s.equipos || []).map(e => e.fecha_fin).filter(d => d);

        const allStarts = [...opsStart, ...eqsStart];
        const allEnds = [...opsEnd, ...eqsEnd];

        if (allStarts.length === 0 && allEnds.length === 0) return { start: null, end: null };

        const minStart = allStarts.length ? new Date(Math.min(...allStarts.map(d => new Date(d)))) : null;
        const maxEnd = allEnds.length ? new Date(Math.max(...allEnds.map(d => new Date(d)))) : null;

        return { start: minStart, end: maxEnd };
    }

    getOrderDates() {
        const serviceDates = this.orden?.servicios.map(s => this.getServiceDates(s.id_orden_servicio)) || [];
        const starts = serviceDates.map(d => d.start).filter(d => d);
        const ends = serviceDates.map(d => d.end).filter(d => d);

        const minStart = starts.length ? new Date(Math.min(...starts.map(d => d.getTime()))) : null;
        const maxEnd = ends.length ? new Date(Math.max(...ends.map(d => d.getTime()))) : null;

        return { start: minStart, end: maxEnd };
    }

    formatDate(date) {
        if (!date) return 'Pendiente';
        return date.toLocaleString('en-US', {
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric',
            hour12: true
        });
    }

    render() {
        if (this.loading && !this.orden) return html`<div style="display:grid; place-items:center; height:100vh;"><div class="loader"></div></div>`;
        if (!this.orden) return html`<div>Orden no encontrada</div>`;

        const orderDates = this.getOrderDates();

        return html`
            <div class="container">
                <header class="header">
                    <div class="order-info">
                        <h1 style="margin:0;">Orden #${this.orden.id_orden}</h1>
                        <div class="datetime-display">
                            <label>Inicio:</label>
                            <span>${this.formatDate(orderDates.start)}</span>
                        </div>
                        <div class="datetime-display">
                            <label>Fin:</label>
                            <span>${this.formatDate(orderDates.end)}</span>
                        </div>
                    </div>
                    <button class="btn-back" @click=${() => navigator.goto('/servicios/listado/orden')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                        Volver
                    </button>
                </header>

                ${this.orden.servicios.map(s => {
            const key = s.id_orden_servicio;
            const sDates = this.getServiceDates(key);
            const isComplete = this.isServiceComplete(key);
            return html`
                        <div class="card-service">
                            <div class="service-header">
                                <div class="service-title" style="display:flex; align-items:center; gap:0.75rem;">
                                    ${s.nombre}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${isComplete ? '#10b981' : '#cbd5e1'}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div style="display:flex; gap: 2rem; align-items: center;">
                                    <div class="datetime-display">
                                        <label>Inicio:</label>
                                        <span style="font-size: 0.85rem;">${this.formatDate(sDates.start)}</span>
                                    </div>
                                    <div class="datetime-display">
                                        <label>Fin:</label>
                                        <span style="font-size: 0.85rem;">${this.formatDate(sDates.end)}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="tabs">
                                <button class="tab ${this.activeTabs[key] === 'operativos' ? 'active' : ''}" @click=${() => { this.activeTabs = { ...this.activeTabs, [key]: 'operativos' }; this.requestUpdate(); }}>Asignar Personal</button>
                                <button class="tab ${this.activeTabs[key] === 'equipos' ? 'active' : ''}" @click=${() => { this.activeTabs = { ...this.activeTabs, [key]: 'equipos' }; this.requestUpdate(); }}>Asignar Equipos</button>
                                <button class="tab ${this.activeTabs[key] === 'requerimientos' ? 'active' : ''}" @click=${() => { this.activeTabs = { ...this.activeTabs, [key]: 'requerimientos' }; this.requestUpdate(); }}>Requerimientos Técnicos</button>
                                <button class="tab ${this.activeTabs[key] === 'materiales' ? 'active' : ''}" @click=${() => { this.activeTabs = { ...this.activeTabs, [key]: 'materiales' }; this.requestUpdate(); }}>Materiales</button>
                            </div>

                            <div class="tab-content">
                                <div ?hidden=${this.activeTabs[key] !== 'operativos'}>${this.renderOperativos(s)}</div>
                                <div ?hidden=${this.activeTabs[key] !== 'equipos'}>${this.renderEquipos(s)}</div>
                                <div ?hidden=${this.activeTabs[key] !== 'materiales'}>${this.renderMateriales(s)}</div>
                                <div ?hidden=${this.activeTabs[key] !== 'requerimientos'}>
                                    <h4 style="margin-top:0; color:var(--text-light); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.5px;">Especialidades Requeridas</h4>
                                    ${this.renderReqEspecialidades(s)}
                                    <h4 style="margin-top:1.5rem; color:var(--text-light); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.5px;">Equipos Requeridos</h4>
                                    ${this.renderReqEquipos(s)}
                                </div>
                            </div>
                        </div>
                    `;
        })}

                <div class="global-footer">
                    <button class="btn-confirm" @click=${this.handleSave}>
                        Confirmar Asignación y Programación
                    </button>
                </div>
            </div>
        `;
    }

    renderOperativos(s) {
        const list = this.assignments[s.id_orden_servicio]?.operatives || [];
        if (list.length === 0) return html`<div class="empty-state">No se requiere personal adicional para este servicio.</div>`;

        return html`
            <table class="assignment-table">
                <thead>
                    <tr>
                        <th style="width: 25%">Especialidad Requerida</th>
                        <th style="width: 30%">Personal</th>
                        <th style="width: 22.5%">Inicio</th>
                        <th style="width: 15%">Fin</th>
                        <th style="width: 7.5%; text-align: center">Jefe</th>
                    </tr>
                </thead>
                <tbody>
                    ${list.map((assign, idx) => {
            const forbiddenIds = list
                .filter((f, i) => i !== idx && f.id_especialidad === assign.id_especialidad)
                .map(f => f.id_operativo)
                .filter(id => id);

            return html`
                        <tr>
                            <td>
                                <span class="req-label">${assign.nombre_especialidad}</span>
                                <div style="font-size: 0.75rem; color: var(--text-light)">Duración: ${assign.horas_req}h</div>
                                <div class="nivel-badge">Nivel: ${assign.nivel}</div>
                            </td>
                            <td>
                                <select class="input-op" .value=${assign.id_operativo} @change=${e => this.updateAssignment(s.id_orden_servicio, 'operatives', idx, 'id_operativo', e.target.value)}>
                                    <option value="">Seleccionar personal...</option>
                                    ${this.operativos.filter(op =>
                op.especialidades.includes(assign.id_especialidad) &&
                !forbiddenIds.includes(op.id_operativo)
            ).map(op => html`
                                        <option value=${op.id_operativo} ?selected=${assign.id_operativo === op.id_operativo}>${op.nombre}</option>
                                    `)}
                                </select>
                            </td>
                            <td><input type="datetime-local" class="input-dt" .value=${assign.fecha_inicio} @input=${e => this.updateAssignment(s.id_orden_servicio, 'operatives', idx, 'fecha_inicio', e.target.value)}></td>
                            <td><input type="datetime-local" class="input-dt" .value=${assign.fecha_fin} @input=${e => this.updateAssignment(s.id_orden_servicio, 'operatives', idx, 'fecha_fin', e.target.value)}></td>
                            <td style="text-align: center">
                                <label class="checkbox-container">
                                    <input type="checkbox" 
                                        .checked=${assign.es_jefe === 1} 
                                        @change=${e => this.updateAssignment(s.id_orden_servicio, 'operatives', idx, 'es_jefe', e.target.checked ? 1 : 0)}>
                                    <span class="checkmark"></span>
                                </label>
                            </td>
                        </tr>
                    `;
        })}
                </tbody>
            </table>
        `;
    }

    renderEquipos(s) {
        const list = this.assignments[s.id_orden_servicio]?.equipos || [];
        if (list.length === 0) return html`<div class="empty-state">No se requiere equipo para este servicio.</div>`;

        return html`
            <table class="assignment-table">
                <thead>
                    <tr>
                        <th style="width: 25%">Equipo Requerido</th>
                        <th style="width: 30%">Unidad / Serial</th>
                        <th style="width: 22.5%">Inicio</th>
                        <th style="width: 22.5%">Fin</th>
                    </tr>
                </thead>
                <tbody>
                    ${list.map((assign, idx) => {
            const forbiddenIds = list
                .filter((f, i) => i !== idx && f.id_tipo_equipo === assign.id_tipo_equipo)
                .map(f => f.id_unidad_equipo)
                .filter(id => id);

            const units = (this.equiposFull || []).filter(u =>
                u.id_tipo_equipo === assign.id_tipo_equipo &&
                (u.id_equipo === assign.id_unidad_equipo || !forbiddenIds.includes(u.id_equipo))
            );

            return html`
                        <tr>
                            <td>
                                <span class="req-label">${assign.nombre_equipo}</span>
                                <div style="font-size: 0.75rem; color: var(--text-light)">Duración: ${assign.horas_req}h</div>
                            </td>
                            <td>
                                <select class="input-op" .value=${assign.id_unidad_equipo} @change=${e => this.updateAssignment(s.id_orden_servicio, 'equipos', idx, 'id_unidad_equipo', e.target.value)}>
                                    <option value="">Seleccionar unidad...</option>
                                    ${units.map(u => html`
                                        <option value=${u.id_equipo} ?selected=${assign.id_unidad_equipo === u.id_equipo}>${u.modelo} - ${u.codigo_interno}</option>
                                    `)}
                                </select>
                            </td>
                            <td><input type="datetime-local" class="input-dt" .value=${assign.fecha_inicio} @input=${e => this.updateAssignment(s.id_orden_servicio, 'equipos', idx, 'fecha_inicio', e.target.value)}></td>
                            <td><input type="datetime-local" class="input-dt" .value=${assign.fecha_fin} @input=${e => this.updateAssignment(s.id_orden_servicio, 'equipos', idx, 'fecha_fin', e.target.value)}></td>
                        </tr>
                    `;
        })}
                </tbody>
            </table>
        `;
    }

    renderMateriales(s) {
        const list = s.array_materiales || [];
        if (list.length === 0) return html`<div class="empty-state">No se requieren materiales para este servicio.</div>`;

        return html`
            <table class="assignment-table">
                <thead>
                    <tr>
                        <th>Material Requerido</th>
                        <th>Cantidad Definida en Presupuesto</th>
                    </tr>
                </thead>
                <tbody>
                    ${list.map(m => html`
                        <tr>
                            <td>${m.nombre}</td>
                            <td><strong style="color: var(--primary)">${m.cantidad} unidades</strong></td>
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }

    renderReqEspecialidades(s) {
        const list = s.array_especialidades || [];
        if (list.length === 0) return html`<div class="empty-state" style="padding: 1.5rem; margin-bottom: 1rem;">No hay requerimientos de personal para este servicio.</div>`;

        return html`
            <table class="assignment-table">
                <thead>
                    <tr>
                        <th style="width: 50%">Especialidad</th>
                        <th style="width: 25%">Cantidad</th>
                        <th style="width: 25%">Horas Req (cada uno)</th>
                    </tr>
                </thead>
                <tbody>
                    ${list.map(e => html`
                        <tr>
                            <td>
                                <div>${e.nombre || 'Especialidad ' + e.id_especialidad}</div>
                                <div class="nivel-badge">Nivel: ${e.nivel || 'N/A'}</div>
                            </td>
                            <td>${e.cantidad_orden_servicio_especialidad || e.cantidad || 0}</td>
                            <td><strong>${parseFloat(e.horas_hombre || e.horas || 0).toFixed(1)}h</strong></td>
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }

    renderReqEquipos(s) {
        const list = s.array_tipos_equipos || [];
        if (list.length === 0) return html`<div class="empty-state" style="padding: 1.5rem;">No hay requerimientos de equipos para este servicio.</div>`;

        return html`
            <table class="assignment-table">
                <thead>
                    <tr>
                        <th style="width: 50%">Tipo de Equipo</th>
                        <th style="width: 25%">Cantidad</th>
                        <th style="width: 25%">Horas Req (cada uno)</th>
                    </tr>
                </thead>
                <tbody>
                    ${list.map(e => html`
                        <tr>
                            <td>${e.nombre || 'Equipo ' + e.id_tipo_equipo}</td>
                            <td>${e.cantidad_orden_servicio_tipo_equipo || e.cantidad || 0}</td>
                            <td><strong>${parseFloat(e.horas_uso || e.horas || 0).toFixed(1)}h</strong></td>
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }

    async handleSave() {
        // Validation: All services must be complete and have exactly 1 Jefe de Obra
        for (const s of this.orden.servicios) {
            if (!this.isServiceComplete(s.id_orden_servicio)) {
                alert(`Debe completar la asignación de todo el personal y equipos para el servicio: ${s.nombre || s.id_servicio}`);
                return;
            }

            const jeteCount = (this.assignments[s.id_orden_servicio]?.operatives || []).filter(op => op.es_jefe === 1).length;
            if (jeteCount !== 1) {
                alert(`Cada servicio debe tener exactamente un Jefe de Obra asignado. El servicio "${s.nombre || s.id_servicio}" tiene ${jeteCount}.`);
                return;
            }
        }

        // Duration Validations
        for (const s of this.orden.servicios) {
            const assign = this.assignments[s.id_orden_servicio];

            for (const o of assign.operatives) {
                const start = new Date(o.fecha_inicio);
                const end = new Date(o.fecha_fin);

                if (end <= start) {
                    alert(`Fin debe ser mayor a inicio para "${o.nombre_especialidad}" en "${s.nombre}"`);
                    return;
                }

                const diffHours = (end - start) / (1000 * 60 * 60);
                if (Math.abs(diffHours - o.horas_req) > 0.01) {
                    alert(`Duración de "${o.nombre_especialidad}" en "${s.nombre}" debe ser de ${o.horas_req}h. (Actual: ${diffHours.toFixed(1)}h)`);
                    return;
                }
            }

            for (const e of assign.equipos) {
                const start = new Date(e.fecha_inicio);
                const end = new Date(e.fecha_fin);

                if (end <= start) {
                    alert(`Fin debe ser mayor a inicio para equipo "${e.nombre_equipo}"`);
                    return;
                }

                const diffHours = (end - start) / (1000 * 60 * 60);
                if (Math.abs(diffHours - e.horas_req) > 0.01) {
                    alert(`Duración equipo "${e.nombre_equipo}" debe ser de ${e.horas_req}h. (Actual: ${diffHours.toFixed(1)}h)`);
                    return;
                }
            }
        }

        if (!confirm('¿Desea guardar la asignación global? La orden cambiará a estado "En espera".')) return;

        this.loading = true;

        const orderDates = this.getOrderDates();
        const formatForDB = (dateStr) => {
            if (!dateStr) return null;
            const d = new Date(dateStr);
            const pad = (n) => n.toString().padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
        };

        const payload = {
            fecha_inicio: formatForDB(orderDates.start),
            fecha_fin: formatForDB(orderDates.end),
            servicios: this.orden.servicios.map(s => {
                const sKey = s.id_orden_servicio;
                const sDates = this.getServiceDates(sKey);
                const assign = this.assignments[sKey];
                return {
                    id_orden_servicio: sKey,
                    fecha_inicio: formatForDB(sDates.start),
                    fecha_fin: formatForDB(sDates.end),
                    operadores: assign.operatives.map(op => ({
                        id_operativo: op.id_operativo,
                        id_especialidad: op.id_especialidad,
                        fecha_inicio: formatForDB(op.fecha_inicio),
                        fecha_fin: formatForDB(op.fecha_fin),
                        es_jefe: op.es_jefe
                    })),
                    equipos: assign.equipos.map(eq => ({
                        id_equipo: eq.id_unidad_equipo,
                        fecha_inicio: formatForDB(eq.fecha_inicio),
                        fecha_fin: formatForDB(eq.fecha_fin)
                    }))
                };
            })
        };

        try {
            const result = await serviciosService.asignarPersonal(this.orden.id_orden, payload);

            if (result) {
                alert('Asignación guardada con éxito. La orden está ahora "En espera".');
                navigator.goto('/servicios/listado/orden');
            }
        } catch (error) {
            console.error('Error saving assignments:', error);
            alert('Error al guardar la asignación: ' + error.message);
        } finally {
            this.loading = false;
        }
    }
}

customElements.define('view-servicios-orden-asignar-personal', ViewServiciosOrdenAsignarPersonal);
