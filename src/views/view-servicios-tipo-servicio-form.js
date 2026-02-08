import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { tiposServiciosService } from '../services/tipos-servicios-service.js';

export class ViewTiposServiciosForm extends LitElement {
  static properties = {
    tipo_servicioId: { type: String },
    tipo_servicio: { type: Object },
    previewImage: { type: String }
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
        alert('Tipo de servicio actualizado correctamente');
      } else {
        this.tipos_servicios.forEach(tipo_servicio => {
          if (tipo_servicio.nombre.toLowerCase() === this.tipo_servicio.nombre.toLowerCase()) {
            throw new Error('El tipo de servicio ingresado ya existe');
          }
        });
        await tiposServiciosService.createTipoServicio(formData);
        alert('Tipo de servicio creado correctamente');
      }
      navigator.goto('/servicios/listado/tipo_servicio');
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  }

  render() {
    const title = this.tipo_servicioId ? 'Editar Tipo de Servicio' : 'Nuevo Tipo de Servicio';
    return html`
      <h1>${title}</h1>
      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" name="nombre" .value=${this.tipo_servicio.nombre} @input=${this.handleInput} required>
        </div>

        <div class="form-group">
          <label for="descripcion">Descripcion</label>
          <input type="text" id="descripcion" name="descripcion" .value=${this.tipo_servicio.descripcion} @input=${this.handleInput} required>
        </div>

        <!-- permitir subir una imagen del icono del tipo de servicio y mostrar preview -->
        <div class="form-group">
          <label for="icono">Icono</label>
          <input type="file" id="icono" name="icono" @change=${this.handleInput} accept="image/*">
          ${this.previewImage ? html`
            <div style="margin-top: 10px;">
              <p style="font-size: 14px; color: #666; margin-bottom: 5px;">Vista previa:</p>
              <img src="${this.previewImage}" alt="Previsualización" style="width: 100px; height: 100px; border-radius: 8px; border: 1px solid #ddd; object-fit: cover;">
            </div>
          ` : html``}
        </div>

        ${this.tipo_servicioId ? html`
          <!-- mostrar la imagen actual del icono del tipo de servicio, sino tiene mostrar mensaje indicandolo -->
          <div class="form-group">
            <label for="icono">Icono actual</label>
            ${this.tipo_servicio.imagePath ? html`<img src="http://api-multiservicios.local/storage/${this.tipo_servicio.imagePath}" alt="Icono" style="width: 100px; height: 100px;">` : html`<p>No se ha subido una imagen</p>`}
          </div>
        ` : html``}

        <div class="actions">
          <button type="submit" class="btn-save">Guardar</button>
          <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
            <!--<button class="btn" style="background-color: #6c757d; color: white;" @click=${() => window.history.back()}>Volver</button>-->
            <button class="btn" style="background-color: #6c757d; color: white;" @click=${() => {
        if (this.tipo_servicioId) {
          navigator.goto('/servicios/listado/tipo_servicio')
        } else {
          navigator.goto('/categoria/00017')
        }
      }
      }>Volver</button>
          </div>
        </div>
      </form>
    `;
  }
}

customElements.define('view-servicios-tipo-servicio-form', ViewTiposServiciosForm);
