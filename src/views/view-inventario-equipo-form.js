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
      font-family: inherit;
    }
    input[type="date"] {
      color-scheme: light;
    }
    input[type="date"]::-webkit-calendar-picker-indicator {
      cursor: pointer;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    textarea {
      width: 100%;
      height: 48px;
      padding: 12px 16px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      font-size: 0.95rem;
      box-sizing: border-box;
      background: #f9fafb;
      transition: all 0.2s;
      resize: none;
      font-family: inherit;
      color: #1e293b;
      overflow-y: auto;
    }
    textarea:focus {
      outline: none;
      border-color: #3b82f6;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Scrollbar styles matching movement registration */
    textarea::-webkit-scrollbar { width: 6px; }
    textarea::-webkit-scrollbar-track { background: #f1f5f9; }
    textarea::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    textarea::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
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
    const title = this.equipoId ? 'Editar Equipo' : 'Nuevo Equipo';
    return html`
      <h1>${title}</h1>
      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label for="id_tipo_equipo">Tipo de Equipo</label>
          <select id="id_tipo_equipo" name="id_tipo_equipo" @input=${this.handleInput} required>
            <option value="" disabled ?selected=${!this.equipo.id_tipo_equipo}>Seleccione un tipo de equipo</option>
            ${this.array_tiposEquipos.map(tipoEquipo => html`
              <option value="${tipoEquipo.id_tipo_equipo}" ?selected=${this.equipo.id_tipo_equipo === tipoEquipo.id_tipo_equipo}>${tipoEquipo.nombre}</option>
            `)}
          </select>
        </div>
        
        <div class="form-group">
          <label for="modelo">Modelo</label>
          <input type="text" id="modelo" name="modelo" .value=${this.equipo.modelo} @input=${this.handleInput} required>
        </div>
        
        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea 
            id="descripcion" 
            name="descripcion" 
            .value=${this.equipo.descripcion} 
            @input=${this.handleInput} 
            required
            rows="1"
          ></textarea>
        </div>

        <!-- si se esta creando un equipo, el codigo interno se genera de forma automatica y se coloca en un input de solo lectura, en caso
        de estar editando un equipo se utilizara el codigo interno que vino del backend para mostrarlo en el inputo de solo lectura -->

        <div class="form-group">
          <label for="codigo_interno">Código Interno</label>
          <input type="text" id="codigo_interno" name="codigo_interno" .value=${this.equipo.codigo_interno} @input=${this.handleInput} required readonly>
        </div>

        <div class="form-group">
          <label for="fecha_adquisicion">Fecha de Adquisición</label>
          <input type="date" id="fecha_adquisicion" name="fecha_adquisicion" .value=${this.equipo.fecha_adquisicion} @input=${this.handleInput} required>
        </div>

        <div class="actions">
          <button type="submit" class="btn-save">Guardar</button>
          <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <!--<button class="btn" style="background-color: #6c757d; color: white;" @click=${() => window.history.back()}>Volver</button>-->
            <button class="btn" style="background-color: #6c757d; color: white;" @click=${() => {
        if (this.equipoId) {
          navigator.goto('/inventario/listado/equipo')
        } else {
          navigator.goto('/categoria/00008')
        }
      }
      }>Volver</button>
          </div>
        </div>
      </form>
    `;
  }
}

customElements.define('view-inventario-equipo-form', ViewInventarioEquipoForm);
