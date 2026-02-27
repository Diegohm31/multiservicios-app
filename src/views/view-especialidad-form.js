import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { especialidadesService } from '../services/especialidades-service.js';
import { popupService } from '../utils/popup-service.js';

export class ViewEspecialidadForm extends LitElement {
  static properties = {
    especialidadId: { type: String },
    especialidad: { type: Object }
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
    select {
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

    input:focus, select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
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
    this.especialidadId = '';
    this.especialidad = {
      nombre: '',
      nivel: '',
      tarifa_hora: ''
    };
    this.especialidades = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadEspecialidades();
  }

  async loadEspecialidades() {
    this.especialidades = await especialidadesService.getEspecialidades();
  }

  updated(changedProperties) {
    if (changedProperties.has('especialidadId') && this.especialidadId) {
      this.loadEspecialidad(this.especialidadId);
    }
  }

  async loadEspecialidad(id) {
    const data = await especialidadesService.getOneEspecialidad(id);
    if (data) {
      this.especialidad = data;
    }
  }

  handleInput(e) {
    const field = e.target.name;
    const value = e.target.value;
    this.especialidad = { ...this.especialidad, [field]: value };
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      if (this.especialidadId) {
        await especialidadesService.updateEspecialidad(this.especialidadId, this.especialidad);
        popupService.success('Éxito', 'Especialidad actualizada correctamente');
      } else {
        this.especialidades.forEach(especialidad => {
          if (especialidad.nombre === this.especialidad.nombre && especialidad.nivel === this.especialidad.nivel) {
            throw new Error('La especialidad ingresada junto a ese nivel ya existe');
          }
        });
        await especialidadesService.createEspecialidad(this.especialidad);
        popupService.success('Éxito', 'Especialidad creada correctamente');
      }
      navigator.goto('/especialidades/listado');
    } catch (error) {
      popupService.warning('Error', error.message);
      console.error(error);
    }
  }

  render() {
    const title = this.especialidadId ? 'Editar Especialidad' : 'Registro de Nueva Especialidad';
    return html`
      <div class="form-card">
        <h1>${title}</h1>
        <form @submit=${this.handleSubmit}>
          <div class="form-group">
            <label for="nombre">Nombre de la Especialidad</label>
            <input type="text" id="nombre" name="nombre" .value=${this.especialidad.nombre} @input=${this.handleInput} placeholder="Ej. Plomería Industrial" required>
          </div>
          
          <div class="form-group">
            <label for="nivel">Nivel de Categorización</label>
            <select id="nivel" name="nivel" .value=${this.especialidad.nivel} @input=${this.handleInput} required>
              <option value="" disabled selected>Seleccione el nivel técnico...</option>
              <option value="A">Nivel A (Experto)</option>
              <option value="B">Nivel B (Avanzado)</option>
              <option value="C">Nivel C (Intermedio)</option>
              <option value="D">Nivel D (Básico)</option>
              <option value="U">Nivel U (General)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="tarifa_hora">Tarifa Base por Hora ($)</label>
            <input type="number" id="tarifa_hora" name="tarifa_hora" .value=${this.especialidad.tarifa_hora} @input=${this.handleInput} placeholder="0.00" required step="0.01">
          </div>

          <div class="actions">
            <button class="btn-back" type="button" @click=${() => {
        if (this.especialidadId) {
          navigator.goto('/especialidades/listado')
        } else {
          navigator.goto('/categoria/00002')
        }
      }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Volver
            </button>
            
            <button type="submit" class="btn-save">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              ${this.especialidadId ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('view-especialidad-form', ViewEspecialidadForm);
