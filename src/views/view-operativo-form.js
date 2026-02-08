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
      display: block;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    h1 {
      margin-top: 0;
      color: #333;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #555;
    }
    input, textarea {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 16px;
      background-color: #ffffff;
      color: #000000;
      transition: all 0.2s;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    textarea {
      height: 100px;
      resize: vertical;
    }
    .actions {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-save {
      background-color: #28a745;
      color: white;
    }
    .btn-save:hover {
      background-color: #218838;
    }
    .btn-cancel {
      background-color: #6c757d;
      color: white;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }
    .btn-cancel:hover {
      background-color: #5a6268;
    }
    .specialties-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .specialty-item {
      display: flex;
      align-items: center;
      background: #f8f9fa;
      padding: 5px 10px;
      border-radius: 20px;
      border: 1px solid #ddd;
    }
    .specialty-item input {
      width: auto;
      margin-right: 8px;
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
    console.log(`Antes ${this.selectedEspecialidades}`);
    if (checked) {
      this.selectedEspecialidades = [...this.selectedEspecialidades, id];
    } else {
      this.selectedEspecialidades = this.selectedEspecialidades.filter(item => item !== id);
    }
    console.log(`Despues ${this.selectedEspecialidades}`);
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
    const title = this.operativoId ? 'Editar Operativo' : 'Nuevo Operativo';
    return html`
      <h1>${title}</h1>
      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text" id="name" name="name" .value=${this.operativo.name} @input=${this.handleInput} required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" .value=${this.operativo.email} @input=${this.handleInput} required>
        </div>
        
        <!-- mostrar el input de password solo si this.operativoId es false -->
        ${!this.operativoId ? html`
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" .value=${this.operativo.password} @input=${this.handleInput} required>
        </div>
        ` : ''}
        
        <div class="form-group">
          <label for="cedula">Cedula</label>
          <input type="text" id="cedula" name="cedula" .value=${this.operativo.cedula} @input=${this.handleInput} required>
        </div>
        
        <div class="form-group">
          <label for="telefono">Telefono</label>
          <input type="text" id="telefono" name="telefono" .value=${this.operativo.telefono} @input=${this.handleInput} required>
        </div>

        <!-- mostrar el checkbox solo si this.operativoId es true -->
        ${this.operativoId ? html`
        <div class="form-group" style="display: flex; align-items: center; gap: 10px;">
          <input type="checkbox" id="disponible" name="disponible" .checked=${this.operativo.disponible} @change=${this.handleInput} style="width: auto;">
          <label for="disponible" style="margin-bottom: 0;">Disponible</label>
        </div>
        ` : ''}

        <!-- mostrar el input de reputacion solo si this.operativoId es true -->
        ${this.operativoId ? html`
        <div class="form-group">
          <label for="reputacion">Reputacion</label>
          <input type="number" id="reputacion" name="reputacion" .value=${this.operativo.reputacion} @input=${this.handleInput} required>
        </div>
        ` : ''}

        <!-- mostrar como checkbox marcados aquellas especialidades que ya esten asignadas -->
        <div class="form-group">
          <label for="especialidades">Especialidades</label>
          <div class="specialties-list">
            ${this.especialidades.map(e => html`
              <div class="specialty-item">
                <input type="checkbox" 
                       id="especialidad-${e.id_especialidad}" 
                       .value=${e.id_especialidad} 
                       .checked=${this.selectedEspecialidades.includes(e.id_especialidad)} 
                       @change=${(event) => this.handleEspecialidadToggle(event, e.id_especialidad)}>
                <label for="especialidad-${e.id_especialidad}">${e.nombre} nivel ${e.nivel}</label>
              </div>
            `)}
          </div>
        </div>

        <div class="actions">
          <button type="submit" class="btn-save">Guardar</button>
          <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <!--<button class="btn" style="background-color: #6c757d; color: white;" @click=${() => window.history.back()}>Volver</button>-->
            <button class="btn" style="background-color: #6c757d; color: white;" @click=${() => {
        if (this.operativoId) {
          navigator.goto('/operativos/listado')
        } else {
          navigator.goto('/categoria/00001')
        }
      }
      }>Volver</button>
          </div>
        </div>
      </form>
    `;
  }
}

customElements.define('view-operativo-form', ViewOperativoForm);
