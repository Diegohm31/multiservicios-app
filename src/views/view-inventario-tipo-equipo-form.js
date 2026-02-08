import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { tiposEquiposService } from '../services/tipos-equipos-service.js';

export class ViewInventarioTipoEquipoForm extends LitElement {
  static properties = {
    tipo_equipoId: { type: String },
    tipo_equipo: { type: Object }
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
        alert('Tipo de equipo actualizado correctamente');
      } else {
        await tiposEquiposService.createTipoEquipo(this.tipo_equipo);
        alert('Tipo de equipo creado correctamente');
      }
      navigator.goto('/inventario/listado/tipo_equipo');
    } catch (error) {
      alert('Error al guardar el tipo de equipo');
      console.error(error);
    }
  }

  render() {
    const title = this.tipo_equipoId ? 'Editar Tipo de Equipo' : 'Nuevo Tipo de Equipo';
    return html`
      <h1>${title}</h1>
      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" name="nombre" .value=${this.tipo_equipo.nombre} @input=${this.handleInput} required>
        </div>
        
        <div class="form-group">
          <label for="costo_hora">Costo por hora</label>
          <input type="number" id="costo_hora" name="costo_hora" .value=${this.tipo_equipo.costo_hora} @input=${this.handleInput} required step="0.01">
        </div>

        <div class="actions">
          <button type="submit" class="btn-save">Guardar</button>
          <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <!--<button class="btn" style="background-color: #6c757d; color: white;" @click=${() => window.history.back()}>Volver</button>-->
            <button class="btn" style="background-color: #6c757d; color: white;" @click=${() => {
        if (this.tipo_equipoId) {
          navigator.goto('/inventario/listado/tipo_equipo')
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

customElements.define('view-inventario-tipo-equipo-form', ViewInventarioTipoEquipoForm);
