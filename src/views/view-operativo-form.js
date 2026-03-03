import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { especialidadesService } from '../services/especialidades-service.js';
import { operativosService } from '../services/operativos-service.js';
import { popupService } from '../utils/popup-service.js';

export class ViewOperativoForm extends LitElement {
  static properties = {
    operativoId: { type: String },
    operativo: { type: Object },
    especialidades: { type: Array },
    selectedEspecialidades: { type: Array },
    searchTerm: { type: String },
    showPassword: { type: Boolean }
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
      box-sizing: border-box;
    }

    * {
      box-sizing: border-box;
    }

    .form-card {
      background: var(--card-bg);
      max-width: 750px;
      margin: 0 auto;
      padding: 3rem;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
      animation: fadeInUp 0.5s ease-out;
      overflow: hidden; /* Prevent child overflow */
    }

    h1 {
      margin: 0 0 2.5rem 0;
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
      gap: 2rem 3rem; /* Increased spacing between inputs */
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
      margin-top: 2rem;
      padding: 2rem;
      background: #f8fafc;
      border-radius: 20px;
      border: 1px solid var(--border);
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    }

    .specialties-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .specialties-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .search-box {
      position: relative;
      max-width: 300px;
      width: 100%;
    }

    .search-box input {
      padding-left: 2.75rem !important;
      font-size: 0.9rem !important;
      background: white !important;
    }

    .search-box svg {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-light);
    }

    .specialties-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.25rem;
    }

    .specialty-group {
      background: white;
      padding: 1.25rem;
      border-radius: 16px;
      border: 1px solid var(--border);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .specialty-group:hover {
      border-color: var(--primary);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }

    .group-header {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .group-icon {
      width: 32px;
      height: 32px;
      background: #eff6ff;
      color: var(--primary);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .levels-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .level-chip {
      padding: 0.5rem 0.85rem;
      background: #f1f5f9;
      border: 1px solid var(--border);
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;
      color: var(--text-light);
    }

    .level-chip:hover {
      background: #e2e8f0;
      border-color: var(--primary);
      color: var(--primary);
    }

    .level-chip.selected {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
    }

    .level-chip input {
      display: none;
    }

    .actions {
      margin-top: 3rem;
      display: flex;
      justify-content: space-between;
      gap: 1.5rem;
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

    .toggle-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      transition: all 0.2s;
    }

    .toggle-group:hover {
      border-color: var(--primary);
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #cbd5e1;
      transition: .4s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: var(--primary);
    }

    input:focus + .slider {
      box-shadow: 0 0 1px var(--primary);
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }

    .form-group i {
      position: absolute;
      left: 1rem;
      top: 2.25rem;
      color: var(--text-light);
    }

    .input-wrapper {
      position: relative;
      width: 100%;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-light);
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-light);
      cursor: pointer;
      padding: 0.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all 0.2s;
      width: auto !important;
    }

    .password-toggle:hover {
      background: #f1f5f9;
      color: var(--text);
    }

    .password-toggle svg {
      width: 20px;
      height: 20px;
    }

    .search-box button {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      padding: 0.25rem;
      background: none;
      border: none;
      color: var(--text-light);
      cursor: pointer;
      width: auto;
      border-radius: 50%;
    }

    .search-box button:hover {
      background: #f1f5f9;
      color: var(--text);
    }

    .badge {
      background: var(--primary);
      color: white;
      padding: 0.2rem 0.6rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
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
    this.searchTerm = '';
    this.showPassword = false;
  }

  get groupedEspecialidades() {
    const groups = {};
    const filtered = this.especialidades.filter(e =>
      e.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.nivel.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    filtered.forEach(e => {
      if (!groups[e.nombre]) {
        groups[e.nombre] = [];
      }
      groups[e.nombre].push(e);
    });

    // Sort levels within each group alphabetically (A, B, C...)
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.nivel.localeCompare(b.nivel, undefined, { sensitivity: 'base' }));
    });

    // Sort specialties alphabetically by name
    const sortedGroups = {};
    Object.keys(groups).sort().forEach(key => {
      sortedGroups[key] = groups[key];
    });

    return sortedGroups;
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
      popupService.info('Especialidad Requerida', 'Debe seleccionar al menos una especialidad');
      return;
    }

    // Sincronizamos las especialidades seleccionadas con el objeto operativo
    this.operativo.array_especialidades = this.selectedEspecialidades;

    try {
      if (this.operativoId) {
        await operativosService.updateOperativo(this.operativoId, this.operativo);
        popupService.success('Operativo Actualizado', 'Operativo actualizado correctamente');
      } else {
        await operativosService.createOperativo(this.operativo);
        popupService.success('Operativo Creado', 'Operativo creado correctamente');
      }
      navigator.goto('/operativos/listado');
    } catch (error) {
      popupService.warning('Error', 'Error al guardar el operativo');
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
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input type="text" id="name" name="name" .value=${this.operativo.name} @input=${this.handleInput} required style="padding-left: 2.75rem;">
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Correo Electrónico</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                <input type="email" id="email" name="email" .value=${this.operativo.email} @input=${this.handleInput} required style="padding-left: 2.75rem;">
              </div>
            </div>
            
            ${!this.operativoId ? html`
            <div class="form-group">
              <label for="password">Contraseña de Acceso</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input type="${this.showPassword ? 'text' : 'password'}" id="password" name="password" .value=${this.operativo.password} @input=${this.handleInput} required style="padding-left: 2.75rem; padding-right: 3rem;">
                <button type="button" class="password-toggle" @click=${() => this.showPassword = !this.showPassword} tabindex="-1">
                  ${this.showPassword ? html`
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ` : html`
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  `}
                </button>
              </div>
            </div>
            ` : ''}

            <div class="form-group">
              <label for="cedula">Cédula de Identidad</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="14" x="3" y="5" rx="2"/><path d="M7 11h8M7 15h4"/>
                </svg>
                <input type="text" id="cedula" name="cedula" .value=${this.operativo.cedula} @input=${this.handleInput} required style="padding-left: 2.75rem;">
              </div>
            </div>
            
            <div class="form-group">
              <label for="telefono">Número de Teléfono</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <input type="text" id="telefono" name="telefono" .value=${this.operativo.telefono} @input=${this.handleInput} required style="padding-left: 2.75rem;">
              </div>
            </div>

            ${this.operativoId ? html`
            <div class="form-group">
              <label for="reputacion">Nivel de Reputación</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <input type="number" id="reputacion" name="reputacion" .value=${this.operativo.reputacion} @input=${this.handleInput} required style="padding-left: 2.75rem;">
              </div>
            </div>
            
            <div class="form-group" style="padding-top: 1.5rem;">
              <div class="toggle-group">
                <span style="font-size: 0.875rem; font-weight: 600; color: var(--text);">Operativo Disponible</span>
                <label class="switch">
                  <input type="checkbox" id="disponible" name="disponible" .checked=${this.operativo.disponible} @change=${this.handleInput}>
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            ` : ''}
          </div>

          <div class="specialties-section full-width">
            <div class="specialties-header">
              <h3 class="specialties-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                Especialidades Técnicas
                ${this.selectedEspecialidades.length > 0 ? html`
                  <span class="badge">${this.selectedEspecialidades.length} seleccionadas</span>
                ` : ''}
              </h3>
              <div class="search-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" placeholder="Buscar especialidad..." .value=${this.searchTerm} @input=${(e) => this.searchTerm = e.target.value}>
                ${this.searchTerm ? html`
                  <button type="button" @click=${() => this.searchTerm = ''}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                ` : ''}
              </div>
            </div>

            <div class="specialties-container">
              ${Object.entries(this.groupedEspecialidades).map(([nombre, items]) => html`
                <div class="specialty-group">
                  <div class="group-header">
                    <div class="group-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    </div>
                    ${nombre}
                  </div>
                  <div class="levels-grid">
                    ${items.map(e => html`
                      <label class="level-chip ${this.selectedEspecialidades.includes(e.id_especialidad) ? 'selected' : ''}">
                        <input type="checkbox" 
                               .checked=${this.selectedEspecialidades.includes(e.id_especialidad)} 
                               @change=${(event) => this.handleEspecialidadToggle(event, e.id_especialidad)}>
                        Nivel ${e.nivel}
                      </label>
                    `)}
                  </div>
                </div>
              `)}
              
              ${Object.keys(this.groupedEspecialidades).length === 0 ? html`
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-light); border: 2px dashed var(--border); border-radius: 12px;">
                  No se encontraron especialidades que coincidan con la búsqueda.
                </div>
              ` : ''}
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
