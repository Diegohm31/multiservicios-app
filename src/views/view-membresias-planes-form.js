import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { planesMembresiasService } from '../services/planes-membresias-service.js';
import { tiposServiciosService } from '../services/tipos-servicios-service.js';

export class ViewMembresiasPlanesForm extends LitElement {
    static properties = {
        planId: { type: String },
        plan: { type: Object },
        tiposServicios: { type: Array },
        selectedTiposServicios: { type: Array },
        loading: { type: Boolean }
    };

    static styles = css`
    :host {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --bg: #fff;
      --card-bg: #ffffff;
      --text: #1e293b;
      --text-light: #64748b;
      --border: #e2e8f0;
      --radius: 16px;
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      
      display: block;
      padding: 2rem 1rem;
      font-family: 'Inter', system-ui, sans-serif;
      color: var(--text);
      background-color: var(--bg);
      min-height: 100vh;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card {
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      padding: 2.5rem;
    }

    header {
      margin-bottom: 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h1 {
      font-size: 1.875rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
      color: var(--text);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group.full {
      grid-column: span 2;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 12px;
      font-size: 1rem;
      font-family: inherit;
      box-sizing: border-box;
      background: #ffffff;
      color: var(--text);
      transition: all 0.2s;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    textarea {
      min-height: 100px;
      resize: vertical;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 2rem 0 1rem;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .list-container {
      background: #f1f5f9;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid var(--border);
    }

    .list-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .list-item {
      background: white;
      padding: 1rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: transform 0.2s;
    }

    .list-item:hover {
      transform: translateY(-2px);
      border-color: var(--primary);
    }

    .list-item input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .list-item label {
      margin: 0;
      display: flex;
      flex-direction: column;
      text-transform: none;
      letter-spacing: normal;
      cursor: pointer;
    }

    .list-item .item-name {
      font-weight: 700;
      color: var(--text);
      flex: 1;
    }

    .discount-input-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8fafc;
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
      border: 1px solid var(--border);
    }

    .discount-input-container span {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-light);
    }

    .discount-input-container input {
      width: 60px;
      padding: 0.4rem;
      border-radius: 6px;
      font-size: 0.9rem;
      text-align: center;
    }

    .actions {
      margin-top: 3rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 2rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(59, 130, 246, 0.4);
    }

    .btn-secondary {
      background: white;
      color: var(--text-light);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover {
      background: #f8fafc;
      color: var(--text);
      border-color: var(--text);
    }

    .loader {
      display: flex;
      justify-content: center;
      padding: 4rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--text);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
    }

    .btn-back:hover {
      background: #000;
      transform: translateX(-4px);
    }

    .btn-cancel {
      padding: 0.75rem 1.5rem;
      background: #ef4444;
      border: none;
      border-radius: 12px;
      color: white;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.2);
    }

    .btn-cancel:hover {
      background: #dc2626;
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(239, 68, 68, 0.3);
    }
  `;

    constructor() {
        super();
        this.planId = '';
        this.plan = {
            nombre: '',
            descripcion: '',
            duracion_meses: '',
            precio: ''
        };
        this.tiposServicios = [];
        this.selectedTiposServicios = [];
        this.loading = false;
    }

    async connectedCallback() {
        super.connectedCallback();
        await this.loadInitialData();
    }

    async loadInitialData() {
        this.loading = true;
        try {
            const ts = await tiposServiciosService.getTiposServicios();
            if (ts) this.tiposServicios = ts;

            if (this.planId) {
                const data = await planesMembresiasService.getOnePlan(this.planId);
                if (data) {
                    this.plan = {
                        nombre: data.nombre,
                        descripcion: data.descripcion,
                        duracion_meses: data.duracion_meses,
                        precio: data.precio
                    };
                    // Cargar tipos de servicios asociados si existen
                    if (data.array_tipos_servicios) {
                        this.selectedTiposServicios = data.array_tipos_servicios.map(ts => ({
                            id_tipo_servicio: ts.id_tipo_servicio,
                            porcentaje_descuento: ts.porcentaje_descuento || 100
                        }));
                    }
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            this.loading = false;
        }
    }

    handleInput(e) {
        const { name, value } = e.target;
        this.plan = { ...this.plan, [name]: value };
    }

    toggleTipoServicio(id) {
        if (this.selectedTiposServicios.find(i => i.id_tipo_servicio === id)) {
            this.selectedTiposServicios = this.selectedTiposServicios.filter(i => i.id_tipo_servicio !== id);
        } else {
            this.selectedTiposServicios = [...this.selectedTiposServicios, {
                id_tipo_servicio: id,
                porcentaje_descuento: 100 // Por defecto 100
            }];
        }
    }

    handleDiscountChange(id, value) {
        this.selectedTiposServicios = this.selectedTiposServicios.map(item => {
            if (item.id_tipo_servicio === id) {
                return { ...item, porcentaje_descuento: Number(value) };
            }
            return item;
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        this.loading = true;

        const payload = {
            ...this.plan,
            duracion_meses: Number(this.plan.duracion_meses),
            precio: Number(this.plan.precio),
            array_tipos_servicios: this.selectedTiposServicios
        };

        try {
            if (this.planId) {
                await planesMembresiasService.updatePlan(this.planId, payload);
                alert('Plan actualizado con éxito');
            } else {
                await planesMembresiasService.createPlan(payload);
                alert('Plan creado con éxito');
            }
            navigator.goto('/membresias/planes/listado');
        } catch (error) {
            console.error('Error saving plan:', error);
            alert('Hubo un error al guardar el plan');
        } finally {
            this.loading = false;
        }
    }

    render() {
        if (this.loading && !this.tiposServicios.length) {
            return html`<div class="loader"><div class="spinner"></div></div>`;
        }

        return html`
      <div class="container">
        <header>
          <h1>${this.planId ? 'Editar Plan de Membresía' : 'Nuevo Plan de Membresía'}</h1>
          <button class="btn-back" @click=${() => navigator.goto('/categoria/00026')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
            Volver
          </button>
        </header>

        <div class="card">
          <form @submit=${this.handleSubmit}>
            <div class="form-grid">
              <div class="form-group full">
                <label for="nombre">Nombre del Plan</label>
                <input type="text" id="nombre" name="nombre" placeholder="Ej: Platinum Mensual" .value=${this.plan.nombre} @input=${this.handleInput} required>
              </div>

              <div class="form-group">
                <label for="duracion_meses">Duración (Meses)</label>
                <input type="number" id="duracion_meses" name="duracion_meses" placeholder="Ej: 1" .value=${this.plan.duracion_meses} @input=${this.handleInput} required>
              </div>

              <div class="form-group">
                <label for="precio">Precio (USD)</label>
                <input type="number" id="precio" name="precio" step="0.01" placeholder="Ej: 49.99" .value=${this.plan.precio} @input=${this.handleInput} required>
              </div>

              <div class="form-group full">
                <label for="descripcion">Descripción</label>
                <textarea id="descripcion" name="descripcion" placeholder="Describe los beneficios de este plan..." .value=${this.plan.descripcion} @input=${this.handleInput} required></textarea>
              </div>
            </div>

            <div class="section-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Servicios Incluidos con Descuento
            </div>

            <div class="list-container">
              <div class="list-grid">
                ${this.tiposServicios.map(ts => {
            const isSelected = this.selectedTiposServicios.find(i => i.id_tipo_servicio === ts.id_tipo_servicio);
            return html`
                        <div class="list-item" style="${isSelected ? 'border-color: var(--primary);' : ''}">
                          <input type="checkbox" 
                                 .checked=${!!isSelected} 
                                 @change=${() => this.toggleTipoServicio(ts.id_tipo_servicio)}>
                          <span class="item-name">${ts.nombre}</span>
                          ${isSelected ? html`
                            <div class="discount-input-container">
                                <span>Desc. %</span>
                                <input type="number" 
                                       min="0" 
                                       max="100" 
                                       .value=${isSelected.porcentaje_descuento} 
                                       @input=${(e) => this.handleDiscountChange(ts.id_tipo_servicio, e.target.value)}>
                            </div>
                          ` : ''}
                        </div>
                    `;
        })}
              </div>
            </div>

            <div class="actions">
              <button type="button" class="btn btn-cancel" @click=${() => window.history.back()}>Cancelar</button>
              <button type="submit" class="btn btn-primary" .disabled=${this.loading}>
                ${this.loading ? html`<div class="spinner" style="width:20px; height:20px; border-width:2px;"></div>` : ''}
                ${this.planId ? 'Actualizar Plan' : 'Crear Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    }
}

customElements.define('view-membresias-planes-form', ViewMembresiasPlanesForm);
