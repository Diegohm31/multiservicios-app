import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { tiposEquiposService } from '../services/tipos-equipos-service.js';
import { popupService } from '../utils/popup-service.js';

export class ViewInventarioTipoEquipoForm extends LitElement {
  static properties = {
    tipo_equipoId: { type: String },
    tipo_equipo: { type: Object }
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
      max-width: 550px;
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

    .form-group {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text);
    }

    input[type="text"],
    input[type="number"],
    textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 0.95rem;
      transition: all 0.2s;
      background: #ffffff;
      color: var(--text);
      box-sizing: border-box;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    textarea {
      height: 100px;
      resize: vertical;
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
      .actions { flex-direction: column; }
      .btn-save, .btn-back { width: 100%; }
      .btn-back { order: 2; }
      .btn-save { order: 1; }
    }
  `;

  constructor() {
    super();
    this.tipo_equipoId = '';
    this.tipo_equipo = {
      nombre: '',
      costo_hora: '',
      cantidad: ''
    };
  }

  updated(changedProperties) {
    if (changedProperties.has('tipo_equipoId') && this.tipo_equipoId) {
      this.loadTipoEquipo(this.tipo_equipoId);
    }
  }

  async loadTipoEquipo(id) {
    const data = await tiposEquiposService.getOneTipoEquipo(id);
    if (data) {
      this.tipo_equipo = data;
    }
  }

  handleInput(e) {
    const field = e.target.name;
    const value = e.target.value;
    this.tipo_equipo = { ...this.tipo_equipo, [field]: value };
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      if (this.tipo_equipoId) {
        await tiposEquiposService.updateTipoEquipo(this.tipo_equipoId, this.tipo_equipo);
        popupService.success('Éxito', 'Tipo de equipo actualizado correctamente');
      } else {
        await tiposEquiposService.createTipoEquipo(this.tipo_equipo);
        popupService.success('Éxito', 'Tipo de equipo creado correctamente');
      }
      navigator.goto('/inventario/listado/tipo_equipo');
    } catch (error) {
      popupService.error('Error', 'Error al guardar el tipo de equipo');
      console.error(error);
    }
  }

  render() {
    const title = this.tipo_equipoId ? 'Editar Tipo de Equipo' : 'Nuevo Tipo de Equipo';
    return html`
      <div class="form-card">
        <h1>${title}</h1>
        <form @submit=${this.handleSubmit}>
          <div class="form-group">
            <label for="nombre">Nombre del Equipo</label>
            <input type="text" id="nombre" name="nombre" .value=${this.tipo_equipo.nombre} @input=${this.handleInput} placeholder="Ej. Mezcladora de concreto" required>
          </div>
          
          <div class="form-group">
            <label for="costo_hora">Costo Operativo por Hora ($)</label>
            <input type="number" id="costo_hora" name="costo_hora" .value=${this.tipo_equipo.costo_hora} @input=${this.handleInput} placeholder="0.00" required step="0.01">
          </div>

          <div class="actions">
            <button class="btn-back" type="button" @click=${() => {
        if (this.tipo_equipoId) {
          navigator.goto('/inventario/listado/tipo_equipo')
        } else {
          navigator.goto('/categoria/00008')
        }
      }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Volver
            </button>
            
            <button type="submit" class="btn-save">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              ${this.tipo_equipoId ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('view-inventario-tipo-equipo-form', ViewInventarioTipoEquipoForm);
