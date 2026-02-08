import { LitElement, html, css } from 'lit';
import { productsService } from '../services/products-service.js';
import { navigator } from '../utils/navigator.js';

export class ViewProductForm extends LitElement {
  static properties = {
    productId: { type: String },
    product: { type: Object }
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
    this.productId = '';
    this.product = {
      producto: '',
      precio: '',
      tipo: '',
      image: ''
    };
  }

  updated(changedProperties) {
    if (changedProperties.has('productId') && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  async loadProduct(id) {
    const data = await productsService.getOne(id);
    if (data) {
      this.product = data;
    }
  }

  handleInput(e) {
    const field = e.target.name;
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    this.product = { ...this.product, [field]: value };
  }

  async handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('producto', this.product.producto);
    formData.append('precio', this.product.precio);
    formData.append('tipo', this.product.tipo);

    if (this.product.image instanceof File) {
      formData.append('image', this.product.image);
    }

    try {
      if (this.productId) {
        // En muchos backends PHP, PUT con FormData requiere _method spoofing o configuración especial.
        // Se envía como POST con un parámetro _method='PUT' si es necesario, 
        // pero aquí intentaremos PUT directo o lo que el usuario prefiera si falla. 
        // Por ahora mantenemos el verbo del servicio, pero pasando FormData.
        formData.append('_method', 'PUT');
        await productsService.update(this.productId, formData);
        alert('Producto actualizado correctamente');
      } else {
        await productsService.create(formData);
        alert('Producto creado correctamente');
      }
      navigator.goto('/products');
    } catch (error) {
      alert('Error al guardar el producto');
      console.error(error);
    }
  }

  render() {
    const title = this.productId ? 'Editar Producto' : 'Nuevo Producto';
    return html`
      <h1>${title}</h1>
      <form @submit=${this.handleSubmit}>
        <div class="form-group">
          <label for="producto">Nombre</label>
          <input type="text" id="producto" name="producto" .value=${this.product.producto} @input=${this.handleInput} required>
        </div>
        
        <div class="form-group">
          <label for="precio">Precio</label>
          <input type="number" id="precio" name="precio" .value=${this.product.precio} @input=${this.handleInput} required step="0.01">
        </div>
        
        <div class="form-group">
          <label for="tipo">Tipo</label>
          <input type="text" id="tipo" name="tipo" .value=${this.product.tipo} @input=${this.handleInput}>
        </div>
        
        <div class="form-group">
          <label for="image">Imagen</label>
          <input type="file" id="image" name="image" @change=${this.handleInput} accept="image/*">
          ${typeof this.product.image === 'string' && this.product.image
        ? html`<div style="margin-top:10px"><small>Imagen actual (dejar vacío para mantener):</small><br><img src="http://proyecto-laravel.local/storage/${this.product.imagePath}" height="100"></div>`
        : ''}
        </div>

        <div class="actions">
          <button type="submit" class="btn-save">Guardar</button>
          <a href="/products" class="btn btn-cancel" @click=${(e) => {
        e.preventDefault();
        navigator.goto('/products');
      }}>Cancelar</a>
        </div>
      </form>
    `;
  }
}

customElements.define('view-product-form', ViewProductForm);
