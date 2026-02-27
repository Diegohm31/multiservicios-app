import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { tiposServiciosService } from '../services/tipos-servicios-service.js';
import { popupService } from '../utils/popup-service.js';

export class ViewTiposServiciosForm extends LitElement {
  static properties = {
    tipo_servicioId: { type: String },
    tipo_servicio: { type: Object },
    previewImage: { type: String }
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
    textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 0.95rem;
      transition: all 0.2s;
      background: #ffffff;
      color: var(--text);
      font-family: inherit;
    }

    .upload-zone {
      border: 2.5px dashed #cbd5e1;
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      color: var(--text-light);
      margin-top: 0.5rem;
    }

    .upload-zone:hover {
      border-color: var(--primary);
      background: #eff6ff;
      color: var(--primary);
      transform: translateY(-2px);
    }

    .upload-zone span {
      font-weight: 700;
      font-size: 1rem;
    }

    input[type="file"] {
      display: none;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    textarea {
      height: 120px;
      resize: vertical;
    }

    .image-management {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-top: 0.5rem;
    }

    .preview-box {
      padding: 1rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .preview-box p {
      margin: 0;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-light);
      text-transform: uppercase;
    }

    .preview-img {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      object-fit: cover;
      border: 2px solid white;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
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
      border: none;
    }

    .btn-save {
      background: var(--primary);
      color: white;
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
      .form-card { padding: 1.5rem; }
      .actions { flex-direction: column; }
      .btn-save, .btn-back { width: 100%; }
      .btn-back { order: 2; }
      .btn-save { order: 1; }
      .image-management { grid-template-columns: 1fr; }
    }
  `;

  constructor() {
    super();
    this.tipo_servicioId = '';
    this.tipo_servicio = {
      nombre: '',
      descripcion: '',
      icono: '',
    };
    this.tipos_servicios = [];
    this.previewImage = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadTiposServicios();
  }

  async loadTiposServicios() {
    this.tipos_servicios = await tiposServiciosService.getTiposServicios();
  }

  updated(changedProperties) {
    if (changedProperties.has('tipo_servicioId') && this.tipo_servicioId) {
      this.loadTipoServicio(this.tipo_servicioId);
    }
  }

  async loadTipoServicio(id) {
    const data = await tiposServiciosService.getOneTipoServicio(id);
    if (data) {
      this.tipo_servicio = data;
    }
  }

  handleInput(e) {
    const field = e.target.name;
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;

    if (e.target.type === 'file' && value) {
      this.previewImage = URL.createObjectURL(value);
    }

    this.tipo_servicio = { ...this.tipo_servicio, [field]: value };
  }

  async handleSubmit(e) {
    e.preventDefault();
    try {
      let formData = new FormData();
      formData.append('nombre', this.tipo_servicio.nombre);
      formData.append('descripcion', this.tipo_servicio.descripcion);
      if (this.tipo_servicio.icono instanceof File) {
        formData.append('image', this.tipo_servicio.icono);
      }
      if (this.tipo_servicioId) {
        formData.append('_method', 'PUT');
        await tiposServiciosService.updateTipoServicio(this.tipo_servicioId, formData);
        popupService.success('Éxito', 'Tipo de servicio actualizado correctamente');
      } else {
        this.tipos_servicios.forEach(tipo_servicio => {
          if (tipo_servicio.nombre.toLowerCase() === this.tipo_servicio.nombre.toLowerCase()) {
            throw new Error('El tipo de servicio ingresado ya existe');
          }
        });
        await tiposServiciosService.createTipoServicio(formData);
        popupService.success('Éxito', 'Tipo de servicio creado correctamente');
      }
      navigator.goto('/servicios/listado/tipo_servicio');
    } catch (error) {
      popupService.warning('Error', error.message);
      console.error(error);
    }
  }

  render() {
    const title = this.tipo_servicioId ? 'Editar Tipo de Servicio' : 'Nuevo Tipo de Servicio';
    return html`
      <div class="form-card">
        <h1>${title}</h1>
        <form @submit=${this.handleSubmit}>
          <div class="form-group">
            <label for="nombre">Nombre del Servicio</label>
            <input type="text" id="nombre" name="nombre" .value=${this.tipo_servicio.nombre} @input=${this.handleInput} required placeholder="Ej. Plomería, Electricidad...">
          </div>

          <div class="form-group">
            <label for="descripcion">Descripción Detallada</label>
            <textarea id="descripcion" name="descripcion" .value=${this.tipo_servicio.descripcion} @input=${this.handleInput} required placeholder="Describa brevemente en qué consiste este tipo de servicio..."></textarea>
          </div>

          <div class="form-group">
            <label for="icono">Icono Representativo</label>
            <label class="upload-zone" for="icono">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span>Subir Icono / Imagen</span>
            </label>
            <input type="file" id="icono" name="icono" @change=${this.handleInput} accept="image/*">
            
            <div class="image-management">
              ${this.previewImage ? html`
                <div class="preview-box">
                  <p>Vista previa</p>
                  <img src="${this.previewImage}" alt="Previsualización" class="preview-img">
                </div>
              ` : ''}

              ${this.tipo_servicioId && this.tipo_servicio.imagePath ? html`
                <div class="preview-box">
                  <p>Icono actual</p>
                  <img src="http://api-multiservicios.local/storage/${this.tipo_servicio.imagePath}" alt="Icono actual" class="preview-img">
                </div>
              ` : ''}
            </div>
          </div>

          <div class="actions">
            <button class="btn-back" type="button" @click=${() => {
        if (this.tipo_servicioId) {
          navigator.goto('/servicios/listado/tipo_servicio')
        } else {
          navigator.goto('/categoria/00017')
        }
      }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Volver
            </button>
            
            <button type="submit" class="btn-save">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              ${this.tipo_servicioId ? 'Actualizar' : 'Guardar Tipo'}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('view-servicios-tipo-servicio-form', ViewTiposServiciosForm);
