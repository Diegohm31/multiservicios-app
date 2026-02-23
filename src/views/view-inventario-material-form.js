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
    const title = this.materialId ? 'Editar Material' : 'Registro de Nuevo Material';
    return html`
      <div class="form-card">
        <h1>${title}</h1>
        <form @submit=${this.handleSubmit}>
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="nombre">Nombre del Material</label>
              <input type="text" id="nombre" name="nombre" .value=${this.material.nombre} @input=${this.handleInput} placeholder="Ej. Cemento Gris" required>
            </div>
            
            <div class="form-group full-width">
              <label for="descripcion">Descripción</label>
              <input type="text" id="descripcion" name="descripcion" .value=${this.material.descripcion} @input=${this.handleInput} placeholder="Especificaciones o marca..." required>
            </div>

            <div class="form-group">
              <label for="unidad_medida">Unidad de Medida</label>
              <input type="text" id="unidad_medida" name="unidad_medida" .value=${this.material.unidad_medida} @input=${this.handleInput} placeholder="Ej. KG, Pack, Unidad" required>
            </div>

            <div class="form-group">
              <label for="stock_minimo">Stock Mínimo (Alerta)</label>
              <input type="number" id="stock_minimo" name="stock_minimo" .value=${this.material.stock_minimo} @input=${this.handleInput} placeholder="0" required step="0.01">
            </div>

            <div class="form-group full-width">
              <label for="precio_unitario">Precio Unitario ($)</label>
              <input type="number" id="precio_unitario" name="precio_unitario" .value=${this.material.precio_unitario} @input=${this.handleInput} placeholder="0.00" required step="0.01">
            </div>
          </div>

          <div class="actions">
            <button class="btn-back" type="button" @click=${() => {
        if (this.materialId) {
          navigator.goto('/inventario/listado/material')
        } else {
          navigator.goto('/categoria/00008')
        }
      }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Volver
            </button>
            
            <button type="submit" class="btn-save">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              ${this.materialId ? 'Actualizar' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('view-inventario-material-form', ViewInventarioMaterialForm);
