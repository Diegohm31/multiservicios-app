import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { especialidadesService } from '../services/especialidades-service.js';
import { operativosService } from '../services/operativos-service.js';

export class ViewOperativoForm extends LitElement {
  static properties = {
    operativoId: { type: String },
    operativo: { type: Object },
    especialidades: { type: Array },
    selectedEspecialidades: { type: Array }
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
      max-width: 650px;
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
      gap: 1.5rem 2.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .full-width {
      grid-column: span 2;
    }

    label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text);
    }

    input[type="text"],
    input[type="email"],
    input[type="password"],
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
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .specialties-section {
      margin-top: 1rem;
      padding: 1.5rem;
      background: #f1f5f9;
      border-radius: 12px;
      border: 1px solid var(--border);
    }

    .specialties-title {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text);
    }

    .specialties-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 0.75rem;
    }

    .specialty-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: white;
      padding: 0.6rem 0.8rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      transition: all 0.2s;
      cursor: pointer;
    }

    .specialty-item:hover {
      border-color: var(--primary);
      background: #f8fafc;
    }

    .specialty-item input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .specialty-label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text);
      cursor: pointer;
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
      color: #ffffff; /* Asegura visibilidad */
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
      .full-width { grid-column: auto; }
      .actions { flex-direction: column; }
      .btn-save, .btn-back { width: 100%; }
      .btn-back { order: 2; }
      .btn-save { order: 1; }
    }
  `;

  constructor() {
    super();
    this.operativoId = '';
    this.operativo = {
      name: '',
      email: '',
      password: '',
      cedula: '',
      telefono: '',
      disponible: true,
      reputacion: 0,
      array_especialidades: []
    };
    this.especialidades = [];
    this.selectedEspecialidades = [];
  }

  firstUpdated() {
    this.loadEspecialidades();
  }

  updated(changedProperties) {
    if (changedProperties.has('operativoId') && this.operativoId) {
      this.loadOperativo(this.operativoId);
    }
  }

  async loadEspecialidades() {
    const data = await especialidadesService.getEspecialidades();
    if (data) {
      this.especialidades = data;
    }
  }

  async loadOperativo(id) {
    const data = await operativosService.getOneOperativo(id);
    if (data) {
      this.operativo = data;
      // data trae el campo nombre, pero el input espera name
      this.operativo.name = data.nombre;
      // eliminar propiedad password y nombre del objeto operativo
      delete this.operativo.password;
      delete this.operativo.nombre;
      if (data.array_especialidades) {
        this.selectedEspecialidades = data.array_especialidades.map(e => e.id_especialidad);

      }
    }
  }

  handleInput(e) {
    const field = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    this.operativo = { ...this.operativo, [field]: value };
  }

  async handleEspecialidadToggle(e, id) {
    const checked = e.target.checked;
    //console.log(`Antes ${this.selectedEspecialidades}`);
    if (checked) {
      this.selectedEspecialidades = [...this.selectedEspecialidades, id];
    } else {
      this.selectedEspecialidades = this.selectedEspecialidades.filter(item => item !== id);
    }
    //console.log(`Despues ${this.selectedEspecialidades}`);
  }

  async handleSubmit(e) {
    e.preventDefault();

    //validar que al memnos haya una especialidad seleccionada
    if (this.selectedEspecialidades.length === 0) {
      alert('Debe seleccionar al menos una especialidad');
      return;
    }

    // Sincronizamos las especialidades seleccionadas con el objeto operativo
    this.operativo.array_especialidades = this.selectedEspecialidades;

    try {
      if (this.operativoId) {
        await operativosService.updateOperativo(this.operativoId, this.operativo);
        alert('Operativo actualizado correctamente');
      } else {
        await operativosService.createOperativo(this.operativo);
        alert('Operativo creado correctamente');
      }
      navigator.goto('/operativos/listado');
    } catch (error) {
      alert('Error al guardar el operativo');
      console.error(error);
    }
  }

  render() {
    const title = this.operativoId ? 'Editar Operativo' : 'Registro de Nuevo Operativo';
    return html`
      <div class="form-card">
        <h1>${title}</h1>
        <form @submit=${this.handleSubmit}>
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Nombre Completo</label>
              <input type="text" id="name" name="name" .value=${this.operativo.name} @input=${this.handleInput} required>
            </div>
            
            <div class="form-group">
              <label for="email">Correo Electrónico</label>
              <input type="email" id="email" name="email" .value=${this.operativo.email} @input=${this.handleInput} required>
            </div>
            
            ${!this.operativoId ? html`
            <div class="form-group">
              <label for="password">Contraseña de Acceso</label>
              <input type="password" id="password" name="password" .value=${this.operativo.password} @input=${this.handleInput} required>
            </div>
            ` : ''}

            <div class="form-group">
              <label for="cedula">Cédula de Identidad</label>
              <input type="text" id="cedula" name="cedula" .value=${this.operativo.cedula} @input=${this.handleInput} required>
            </div>
            
            <div class="form-group">
              <label for="telefono">Número de Teléfono</label>
              <input type="text" id="telefono" name="telefono" .value=${this.operativo.telefono} @input=${this.handleInput} required>
            </div>

            ${this.operativoId ? html`
            <div class="form-group">
              <label for="reputacion">Nivel de Reputación</label>
              <input type="number" id="reputacion" name="reputacion" .value=${this.operativo.reputacion} @input=${this.handleInput} required>
            </div>
            
            <div class="form-group" style="padding-top: 1.5rem;">
              <label class="specialty-item" style="cursor:pointer; border: 1px solid var(--border);">
                <input type="checkbox" id="disponible" name="disponible" .checked=${this.operativo.disponible} @change=${this.handleInput}>
                <span class="specialty-label">Operativo Disponible</span>
              </label>
            </div>
            ` : ''}
          </div>

          <div class="specialties-section full-width">
            <h3 class="specialties-title">Especialidades Técnicas</h3>
            <div class="specialties-grid">
              ${this.especialidades.map(e => html`
                <label class="specialty-item" for="especialidad-${e.id_especialidad}">
                  <input type="checkbox" 
                         id="especialidad-${e.id_especialidad}" 
                         .value=${e.id_especialidad} 
                         .checked=${this.selectedEspecialidades.includes(e.id_especialidad)} 
                         @change=${(event) => this.handleEspecialidadToggle(event, e.id_especialidad)}>
                  <span class="specialty-label">${e.nombre} (Nivel ${e.nivel})</span>
                </label>
              `)}
            </div>
          </div>

          <div class="actions">
            <button class="btn-back" type="button" @click=${() => {
        if (this.operativoId) {
          navigator.goto('/operativos/listado')
        } else {
          navigator.goto('/categoria/00001')
        }
      }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Volver
            </button>
            
            <button type="submit" class="btn-save">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              ${this.operativoId ? 'Actualizar Operativo' : 'Registrar Operativo'}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('view-operativo-form', ViewOperativoForm);
