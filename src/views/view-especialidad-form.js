import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { especialidadesService } from '../services/especialidades-service.js';

export class ViewEspecialidadForm extends LitElement {
  static properties = {
    especialidadId: { type: String },
    especialidad: { type: Object }
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

    select {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 16px;
      color: #000000;
      background-color: #ffffff;
      transition: all 0.2s;
    }
    select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
        alert('Especialidad actualizada correctamente');
      } else {
        this.especialidades.forEach(especialidad => {
          if (especialidad.nombre === this.especialidad.nombre && especialidad.nivel === this.especialidad.nivel) {
            throw new Error('La especialidad ingresada junto a ese nivel ya existe');
          }
        });
        await especialidadesService.createEspecialidad(this.especialidad);
        alert('Especialidad creada correctamente');
      }
      navigator.goto('/especialidades/listado');
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  }

  render() {
    const title = this.especialidadId ? 'Editar Especialidad' : 'Nueva Especialidad';
    return html`
      <h1>${title}</h1>
      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" name="nombre" .value=${this.especialidad.nombre} @input=${this.handleInput} required>
        </div>
        
        <div class="form-group">
          <label for="nivel">Nivel</label>
          <select id="nivel" name="nivel" .value=${this.especialidad.nivel} @input=${this.handleInput} required>
            <option value="" disabled selected>Seleccione un nivel</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="U">U</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="tarifa_hora">Tarifa por hora</label>
          <input type="number" id="tarifa_hora" name="tarifa_hora" .value=${this.especialidad.tarifa_hora} @input=${this.handleInput} required step="0.01">
        </div>

        <div class="actions">
          <button type="submit" class="btn-save">Guardar</button>
          <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <!--<button class="btn" style="background-color: #6c757d; color: white;" @click=${() => window.history.back()}>Volver</button>-->
            <button class="btn" style="background-color: #6c757d; color: white;" @click=${() => {
        if (this.especialidadId) {
          navigator.goto('/especialidades/listado')
        } else {
          navigator.goto('/categoria/00002')
        }
      }
      }>Volver</button>
          </div>
        </div>
      </form>
    `;
  }
}

customElements.define('view-especialidad-form', ViewEspecialidadForm);
