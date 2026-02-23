import { LitElement, html, css } from 'lit';
import { materialesService } from '../services/materiales-service.js';
import { movimientosService } from '../services/movimientos-service.js';
import { navigator } from '../utils/navigator.js';

export class ViewInventarioMovimientoForm extends LitElement {
    static properties = {
        materiales: { type: Array },
        filtro: { type: String },
        movimientosSeleccionados: { type: Array },
        cargando: { type: Boolean }
    };

    static styles = css`
        :host {
            --primary: #3b82f6;
            --primary-hover: #2563eb;
            --text: #1e293b;
            --text-light: #64748b;
            --border: #e2e8f0;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --radius: 16px;
            --shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

            display: block;
            padding: 24px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: var(--text);
            max-width: 1200px;
            margin: 0 auto;
        }

        .layout {
            display: flex;
            gap: 24px;
            height: calc(100vh - 120px);
            min-height: 500px;
        }

        .main-content {
            flex: 1;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid #eef2f6;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .sidebar {
            width: 340px;
            background: #f8fafc;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .panel-header {
            padding: 20px 24px;
            border-bottom: 1px solid #eef2f6;
            background: #fff;
        }

        .panel-header h2 {
            margin: 0;
            font-size: 1.1rem;
            font-weight: 700;
            color: #0f172a;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .search-container {
            padding: 16px 20px;
            background: #fff;
            border-bottom: 1px solid #e2e8f0;
        }

        .search-input {
            color: #1a1a1a;
            width: 100%;
            padding: 10px 14px;
            border-radius: 10px;
            border: 1px solid #cbd5e1;
            background: #f1f5f9;
            font-size: 0.9rem;
            transition: all 0.2s;
            box-sizing: border-box;
        }

        .search-input:focus {
            outline: none;
            border-color: #3b82f6;
            background: #fff;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .material-list {
            flex: 1;
            overflow-y: auto;
            padding: 12px;
        }

        .material-card {
            background: #fff;
            border-radius: 10px;
            padding: 12px 16px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #e2e8f0;
            transition: all 0.2s;
            cursor: pointer;
        }

        .material-card:hover {
            border-color: #3b82f6;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .material-info {
            display: flex;
            flex-direction: column;
        }

        .material-name-short {
            font-size: 0.9rem;
            font-weight: 600;
            color: #334155;
        }

        .material-stock {
            font-size: 0.75rem;
            color: #64748b;
        }

        .material-card.selected {
            background: #f1f5f9;
            border-color: #cbd5e1;
            cursor: default;
            opacity: 0.7;
        }

        .material-card.selected:hover {
            transform: none;
            box-shadow: none;
        }

        .add-btn {
            background: #eff6ff;
            color: #3b82f6;
            border: none;
            width: 28px;
            height: 28px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
        }

        .material-card:hover .add-btn {
            background: #3b82f6;
            color: #fff;
        }

        .material-card.selected .add-btn {
            background: #e2e8f0;
            color: #94a3b8;
            cursor: default;
        }

        .movements-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            background: #fcfdfe;
        }

        .movement-item {
            display: flex;
            flex-direction: column;
            gap: 16px;
            background: #fff;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 12px;
            border: 1px solid #e2e8f0;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .movement-row {
            display: flex;
            flex-direction: row;
            gap: 16px;
            align-items: flex-end;
            width: 100%;
        }

        .field-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex: 1;
            min-width: 80px;
        }

        .field-group label {
            font-size: 0.75rem;
            font-weight: 700;
            color: #64748b;
            margin-bottom: 2px;
            white-space: nowrap;
        }

        .item-material-name {
            flex: 2;
            min-width: 180px;
        }

        .motivo-container {
            width: 100%;
            border-top: 1px solid #f1f5f9;
            padding-top: 12px;
        }

        .motivo-field {
            color: #1e293b;
            width: 100%;
            min-height: 48px;
            padding: 12px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 0.9rem;
            box-sizing: border-box;
            background: #f9fafb;
            transition: all 0.2s;
            resize: vertical;
            font-family: inherit;
            display: block;
            overflow: hidden;
        }

        .motivo-field:focus {
            outline: none;
            border-color: #3b82f6;
            background: #fff;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .item-material-name {
            font-weight: 600;
            color: #1e293b;
        }

        .input-field {
            padding: 10px 14px;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 0.95rem;
            width: 100%;
            box-sizing: border-box;
            background-color: #ffffff;
            color: #000000;
            transition: all 0.2s;
        }

        .input-field:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        select.input-field {
            background-color: #ffffff;
            color: #000000;
        }

        .discard-btn {
            background: #fef2f2;
            color: #ef4444;
            border: none;
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .discard-btn:hover {
            background: #ef4444;
            color: #fff;
        }

        .panel-footer {
            padding: 20px 24px;
            border-top: 1px solid #eef2f6;
            background: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .btn-primary {
            background: #10b981;
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .btn-primary:hover {
            background: #059669;
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
        }

        .btn-primary:disabled {
            background: #94a3b8;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
        }

        .empty-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #94a3b8;
            text-align: center;
            padding: 40px;
        }

        .placeholder-icon {
            font-size: 3rem;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        .badge {
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
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

        .badge-info { background: #e0f2fe; color: #0369a1; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    `;

    constructor() {
        super();
        this.materiales = [];
        this.filtro = '';
        this.movimientosSeleccionados = [];
        this.cargando = false;
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadMateriales();
    }

    async loadMateriales() {
        this.materiales = await materialesService.getMateriales() || [];
    }

    seleccionarMaterial(material) {
        // Evitar duplicados
        if (this.movimientosSeleccionados.some(m => m.id_material === material.id_material)) {
            return;
        }

        // find devuelve undefined (falso) si no lo encuentra
        // if (this.movimientosSeleccionados.find(m => m.id_material === material.id_material)) {
        //     return;
        // }

        const nuevoMovimiento = {
            id_material: material.id_material,
            nombre_material: material.nombre,
            tipo_movimiento: 'entrada',
            cantidad: 1,
            precio_unitario: material.precio_unitario || 0,
            motivo: '',
            unidad: material.unidad_medida
        };
        this.movimientosSeleccionados = [...this.movimientosSeleccionados, nuevoMovimiento];
    }

    descartarMovimiento(index) {
        this.movimientosSeleccionados = this.movimientosSeleccionados.filter((_, i) => i !== index);
    }

    handleInputChange(index, field, value) {
        const nuevosMovimientos = [...this.movimientosSeleccionados];
        nuevosMovimientos[index] = { ...nuevosMovimientos[index], [field]: value };
        this.movimientosSeleccionados = nuevosMovimientos;
    }

    _autoResize(e) {
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    }

    async guardarMovimientos() {
        if (this.movimientosSeleccionados.length === 0) return;

        this.cargando = true;

        try {
            // Preparamos el arreglo de movimientos para el envío único
            const movimientosParaEnviar = this.movimientosSeleccionados.map(mov => {
                const data = {
                    id_material: mov.id_material,
                    tipo_movimiento: mov.tipo_movimiento,
                    cantidad: Number(mov.cantidad),
                    motivo: mov.motivo || 'Registro manual'
                };

                // Enviamos precio_unitario solo si el tipo de movimiento es entrada
                if (mov.tipo_movimiento === 'entrada') {
                    data.precio_unitario = Number(mov.precio_unitario);
                }

                return data;
            });

            // Llamada única al servicio enviando el arreglo de objetos
            const res = await movimientosService.createMovimientos({
                movimientos: movimientosParaEnviar
            });

            if (res) {
                alert('¡Éxito! Todos los movimientos se registraron correctamente.');
                this.movimientosSeleccionados = [];
                navigator.goto('/inventario/listado/movimiento');
            } else {
                alert('Hubo un error al procesar la solicitud en el servidor.');
            }
        } catch (error) {
            console.error(error);
            alert('Error crítico: ' + error.message);
        } finally {
            this.cargando = false;
        }
    }

    render() {
        const materialesFiltrados = this.materiales.filter(m =>
            m.nombre.toLowerCase().includes(this.filtro.toLowerCase())
        );

        return html`
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h1 style="margin:0; font-size: 1.8rem; color: #0f172a;">Registro de Movimientos</h1>
            <button class="btn-back" @click=${() => navigator.goto('/categoria/00008')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver
          </button>
            </div>

            <div class="layout">
                <!-- Panel Central: Movimientos a registrar -->
                <div class="main-content">
                    <div class="panel-header">
                        <h2>
                            📦 Movimientos a procesar
                            <span class="badge badge-info">${this.movimientosSeleccionados.length} items</span>
                        </h2>
                    </div>

                    <div class="movements-scroll">
                        ${this.movimientosSeleccionados.length === 0 ? html`
                            <div class="empty-placeholder">
                                <div class="placeholder-icon">📋</div>
                                <h3>No hay nada seleccionado</h3>
                                <p>Haz clic en los materiales de la derecha para agregarlos a la lista de registros.</p>
                            </div>
                        ` : this.movimientosSeleccionados.map((mov, index) => html`
                            <div class="movement-item">
                                <div class="movement-row">
                                    <div class="item-material-name">
                                        <div style="font-weight: 700; color: #0f172a; margin-bottom: 2px; font-size: 1rem;">${mov.nombre_material}</div>
                                        <div style="font-size: 0.75rem; color: #64748b; font-weight: 400;">Unidad: ${mov.unidad}</div>
                                    </div>
                                    
                                    <div class="field-group" style="max-width: 160px;">
                                        <label>Tipo Movimiento</label>
                                        <select 
                                            class="input-field"
                                            @change=${(e) => this.handleInputChange(index, 'tipo_movimiento', e.target.value)}
                                        >
                                            <option value="entrada" ?selected=${mov.tipo_movimiento === 'entrada'}>➕ Entrada</option>
                                            <option value="salida" ?selected=${mov.tipo_movimiento === 'salida'}>➖ Salida</option>
                                        </select>
                                    </div>

                                    <div class="field-group" style="max-width: 120px;">
                                        <label>Cantidad</label>
                                        <input 
                                            type="number" 
                                            class="input-field"
                                            placeholder="0.00" 
                                            .value=${mov.cantidad}
                                            @input=${(e) => this.handleInputChange(index, 'cantidad', e.target.value)}
                                            min="0.01"
                                            step="0.01"
                                        >
                                    </div>

                                    <div class="field-group" style="max-width: 140px;">
                                        <label>Precio Unitario</label>
                                        ${mov.tipo_movimiento === 'entrada' ? html`
                                            <input 
                                                type="number" 
                                                class="input-field"
                                                placeholder="0.00" 
                                                .value=${mov.precio_unitario}
                                                @input=${(e) => this.handleInputChange(index, 'precio_unitario', e.target.value)}
                                                min="0"
                                                step="0.01"
                                                title="Precio Unitario de Compra"
                                            >
                                        ` : html`<div style="background: #f8fafc; border: 1px dashed #e2e8f0; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #cbd5e1; font-size: 0.8rem; font-weight: 600;">N/A</div>`}
                                    </div>

                                    <button class="discard-btn" @click=${() => this.descartarMovimiento(index)} title="Quitar de la lista">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                </div>

                                <div class="motivo-container">
                                    <label style="font-size: 0.75rem; font-weight: 700; color: #64748b; display: block; margin-bottom: 8px;">Motivo / Observación del Movimiento</label>
                                    <textarea 
                                        class="motivo-field"
                                        placeholder="Describa el motivo de este movimiento (por qué entra o sale este material)..." 
                                        .value=${mov.motivo}
                                        @input=${(e) => {
                this.handleInputChange(index, 'motivo', e.target.value);
                this._autoResize(e);
            }}
                                        rows="1"
                                    ></textarea>
                                </div>
                            </div>
                        `)}
                    </div>

                    <div class="panel-footer">
                        <div style="color: #64748b; font-size: 0.9rem;">
                            Confirme los datos antes de proceder.
                        </div>
                        <button 
                            class="btn-primary" 
                            @click=${this.guardarMovimientos}
                            ?disabled=${this.movimientosSeleccionados.length === 0 || this.cargando}
                        >
                            ${this.cargando ? html`⏳ Procesando...` : html`✨ GUARDAR CAMBIOS`}
                        </button>
                    </div>
                </div>

                <!-- Sidebar Derecho: Selección de materiales -->
                <div class="sidebar">
                    <div class="panel-header">
                        <h2>🔍 Selección de Materiales</h2>
                    </div>
                    
                    <div class="search-container">
                        <input 
                            type="text" 
                            class="search-input"
                            placeholder="Buscar por nombre..." 
                            @input=${(e) => this.filtro = e.target.value}
                        >
                    </div>

                    <div class="material-list">
                        ${materialesFiltrados.length === 0 ? html`
                            <p style="text-align:center; color:#94a3b8; font-size:0.9rem; margin-top:20px;">No se encontraron materiales</p>
                        ` : materialesFiltrados.map(material => {
                const estaSeleccionado = this.movimientosSeleccionados.some(m => m.id_material === material.id_material);
                return html`
                                <div class="material-card ${estaSeleccionado ? 'selected' : ''}" @click=${() => this.seleccionarMaterial(material)}>
                                    <div class="material-info">
                                        <span class="material-name-short">${material.nombre}</span>
                                        <span class="material-stock">Unidad: ${material.unidad_medida}</span>
                                    </div>
                                    <button class="add-btn" ?disabled=${estaSeleccionado}>
                                        ${estaSeleccionado ? '✓' : '+'}
                                    </button>
                                </div>
                            `;
            })}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('view-inventario-movimiento-form', ViewInventarioMovimientoForm);
