import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { materialesService } from '../services/materiales-service.js';

export class ViewInventarioMaterialForm extends LitElement {
  static properties = {
    materialId: { type: String },
    material: { type: Object }
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
    this.materialId = '';
    this.material = {
      nombre: '',
      descripcion: '',
      unidad_medida: '',
      stock_minimo: '',
      precio_unitario: ''
    };
  }

  connectedCallback() {
    super.connectedCallback();
  }

  updated(changedProperties) {
    if (changedProperties.has('materialId') && this.materialId) {
      this.loadMaterial(this.materialId);
    }
  }

  async loadMaterial(id) {
    const data = await materialesService.getOneMaterial(id);
    if (data) {
      this.material = data;
    }
  }

  handleInput(e) {
    const field = e.target.name;
    const value = e.target.value;
    this.material = { ...this.material, [field]: value };
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      if (this.materialId) {
        await materialesService.updateMaterial(this.materialId, this.material);
        alert('Material actualizado correctamente');
      } else {
        await materialesService.createMaterial(this.material);
        alert('Material creado correctamente');
      }
      navigator.goto('/inventario/listado/material');
    } catch (error) {
      alert(`Error al guardar el material: ${error.message}`);
      console.error(error);
    }
  }

  render() {
    const title = this.materialId ? 'Editar Material' : 'Nuevo Material';
    return html`
      <h1>${title}</h1>
      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" name="nombre" .value=${this.material.nombre} @input=${this.handleInput} required>
        </div>
        
        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <input type="text" id="descripcion" name="descripcion" .value=${this.material.descripcion} @input=${this.handleInput} required>
        </div>

        <div class="form-group">
          <label for="unidad_medida">Unidad de medida</label>
          <input type="text" id="unidad_medida" name="unidad_medida" .value=${this.material.unidad_medida} @input=${this.handleInput} required>
        </div>

        <div class="form-group">
          <label for="stock_minimo">Stock mínimo</label>
          <input type="number" id="stock_minimo" name="stock_minimo" .value=${this.material.stock_minimo} @input=${this.handleInput} required step="0.01">
        </div>

        <div class="form-group">
          <label for="precio_unitario">Precio unitario</label>
          <input type="number" id="precio_unitario" name="precio_unitario" .value=${this.material.precio_unitario} @input=${this.handleInput} required step="0.01">
        </div>

        <div class="actions">
          <button type="submit" class="btn-save">Guardar</button>
          <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <!--<button class="btn" style="background-color: #6c757d; color: white;" @click=${() => window.history.back()}>Volver</button>-->
            <button class="btn" style="background-color: #6c757d; color: white;" @click=${() => {
        if (this.materialId) {
          navigator.goto('/inventario/listado/material')
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

customElements.define('view-inventario-material-form', ViewInventarioMaterialForm);
