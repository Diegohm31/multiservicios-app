import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { equiposService } from '../services/equipos-service.js';
import { tiposEquiposService } from '../services/tipos-equipos-service.js';

export class ViewInventarioEquipoForm extends LitElement {
  static properties = {
    equipoId: { type: String },
    equipo: { type: Object },
    array_tiposEquipos: { type: Array }
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
      --radius: 16px;
      --shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

      display: block;
      padding: 2.5rem 1rem;
      min-height: 100vh;
      background-color: var(--bg);
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--text);
    }

    .form-card {
      background: var(--card-bg);
      max-width: 600px;
      margin: 0 auto;
      padding: 2.5rem;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      animation: fadeInUp 0.5s ease-out;
    }

    h1 {
      margin: 0 0 2rem 0;
      font-size: 1.875rem;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.025em;
      border-bottom: 2px solid var(--border);
      padding-bottom: 1rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text);
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 0.95rem;
      transition: all 0.2s;
      background: #ffffff;
      color: var(--text);
      box-sizing: border-box;
      font-family: inherit;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    input[readonly] {
      background-color: #f8fafc;
      color: var(--text-light);
      cursor: not-allowed;
    }

    textarea {
      height: 80px;
      resize: vertical;
    }

    input[type="date"] {
      color-scheme: light;
    }

    input[type="date"]::-webkit-calendar-picker-indicator {
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    input[type="date"]::-webkit-calendar-picker-indicator:hover {
      opacity: 1;
    }

    .actions {
      margin-top: 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    button {
      padding: 0.8rem 1.8rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-save {
      background: var(--primary);
      color: white;
      border: none;
      flex: 1;
    }

    .btn-save:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-back {
      background: var(--text);
      color: #ffffff;
      border: none;
      padding: 0.8rem 1.5rem;
    }

    .btn-back:hover {
      background: #000;
      transform: translateX(-4px);
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
      .actions { flex-direction: column; }
      .btn-save, .btn-back { width: 100%; }
      .btn-back { order: 2; }
      .btn-save { order: 1; }
    }
  `;

  constructor() {
    super();
    this.equipoId = '';
    this.equipo = {
      id_tipo_equipo: '',
      modelo: '',
      descripcion: '',
      codigo_interno: '',
      fecha_adquisicion: ''
    };
    this.array_tiposEquipos = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadTiposEquipo();
    if (!this.equipoId) {
      this.equipo.codigo_interno = this.generarCodigoInterno();
    }
  }

  async loadTiposEquipo() {
    const data_tiposEquipos = await tiposEquiposService.getTiposEquipos();
    if (data_tiposEquipos) {
      this.array_tiposEquipos = data_tiposEquipos;
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('equipoId') && this.equipoId) {
      this.loadEquipo(this.equipoId);
    }
  }

  async loadEquipo(id) {
    const data = await equiposService.getOneEquipo(id);
    if (data) {
      this.equipo = data;
    }
  }

  handleInput(e) {
    const field = e.target.name;
    const value = e.target.value;
    this.equipo = { ...this.equipo, [field]: value };
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      // validar que la fecha de adquisicion no sea mayor a la fecha actual
      const today = new Date().toLocaleString('sv-SE', { timeZone: 'America/Caracas' }).split(' ')[0];
      if (this.equipo.fecha_adquisicion > today) {
        alert('La fecha de adquisición no puede ser mayor a la fecha actual');
        return;
      }
      if (this.equipoId) {
        await equiposService.updateEquipo(this.equipoId, this.equipo);
        alert('Equipo actualizado correctamente');
      } else {
        await equiposService.createEquipo(this.equipo);
        alert('Equipo creado correctamente');
      }
      navigator.goto('/inventario/listado/equipo');
    } catch (error) {
      alert('Error al guardar el equipo');
      console.error(error);
    }
  }

  generarCodigoInterno() {
    return `EQ-${Date.now()}`;
  }

  render() {
    const title = this.equipoId ? 'Editar Equipo' : 'Registro de Nuevo Equipo';
    return html`
      <div class="form-card">
        <h1>${title}</h1>
        <form @submit=${this.handleSubmit}>
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="id_tipo_equipo">Categoría / Tipo de Equipo</label>
              <select id="id_tipo_equipo" name="id_tipo_equipo" @input=${this.handleInput} required>
                <option value="" disabled ?selected=${!this.equipo.id_tipo_equipo}>Seleccione el tipo de equipo...</option>
                ${this.array_tiposEquipos.map(tipoEquipo => html`
                  <option value="${tipoEquipo.id_tipo_equipo}" ?selected=${this.equipo.id_tipo_equipo === tipoEquipo.id_tipo_equipo}>${tipoEquipo.nombre}</option>
                `)}
              </select>
            </div>
            
            <div class="form-group full-width">
              <label for="modelo">Modelo / Referencia</label>
              <input type="text" id="modelo" name="modelo" .value=${this.equipo.modelo} @input=${this.handleInput} placeholder="Ej. Caterpillar 320 GC" required>
            </div>
            
            <div class="form-group full-width">
              <label for="descripcion">Descripción Detallada</label>
              <textarea 
                id="descripcion" 
                name="descripcion" 
                .value=${this.equipo.descripcion} 
                @input=${this.handleInput} 
                placeholder="Especificaciones técnicas o estado actual..."
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label for="codigo_interno">Código de Inventario</label>
              <input type="text" id="codigo_interno" name="codigo_interno" .value=${this.equipo.codigo_interno} @input=${this.handleInput} required readonly>
            </div>

            <div class="form-group">
              <label for="fecha_adquisicion">Fecha de Adquisición</label>
              <input type="date" id="fecha_adquisicion" name="fecha_adquisicion" .value=${this.equipo.fecha_adquisicion} @input=${this.handleInput} required>
            </div>
          </div>

          <div class="actions">
            <button class="btn-back" type="button" @click=${() => {
        if (this.equipoId) {
          navigator.goto('/inventario/listado/equipo')
        } else {
          navigator.goto('/categoria/00008')
        }
      }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Volver
            </button>
            
            <button type="submit" class="btn-save">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              ${this.equipoId ? 'Actualizar' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('view-inventario-equipo-form', ViewInventarioEquipoForm);
