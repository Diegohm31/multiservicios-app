import { LitElement, html, css } from 'lit';
import { productsService } from '../services/products-service.js';
import { navigator } from '../utils/navigator.js';

export class ViewProductList extends LitElement {
  static properties = {
    products: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    h1 {
      margin: 0;
      color: #333;
    }
    .btn-create {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .btn-create:hover {
      background-color: #0056b3;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
    }
    .card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .card-body {
      padding: 15px;
    }
    .card-title {
      font-size: 1.25em;
      margin: 0 0 10px;
      font-weight: bold;
    }
    .card-price {
      color: #28a745;
      font-weight: bold;
      font-size: 1.1em;
      margin-bottom: 10px;
    }
    .card-desc {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 15px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn {
      padding: 5px 10px;
      border-radius: 4px;
      text-decoration: none;
      cursor: pointer;
      border: none;
      font-size: 0.9em;
    }
    .btn-edit {
      background-color: #ffc107;
      color: #333;
    }
    .btn-delete {
      background-color: #dc3545;
      color: white;
    }
  `;

  constructor() {
    super();
    this.products = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadProducts();
  }

  async loadProducts() {
    this.products = await productsService.getAll();
    // console.log(this.products);
  }

  async deleteProduct(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      const success = await productsService.delete(id);
      if (success) {
        this.loadProducts();
      } else {
        alert('Error al eliminar');
      }
    }
  }

  render() {
    console.log('render product list');
    return html`
      <div class="header">
        <h1>Productos</h1>
        <a class="btn-create" href="/products/create" @click=${(e) => { e.preventDefault(); navigator.goto('/products/create'); }}>Nuevo Producto</a>
      </div>
      
      <div class="grid">
        ${this.products.map(product => html`
          <div class="card">
            ${product.image ? html`<img src="http://proyecto-laravel.local/storage/${product.imagePath}" alt="${product.producto}" style="width: 100%; height: auto; object-fit: cover;">` : html`<div style="height:200px; background:#eee; display:flex; align-items:center; justify-content:center; color:#aaa;">Sin Imagen</div>`}
            <div class="card-body">
              <h2 class="card-title">${product.producto}</h2>
              <div class="card-price">$${product.precio}</div>
              <div class="card-desc">${product.tipo}</div>
              <div class="actions">
                <a class="btn btn-edit" href="/products/edit/${product.id_producto}" @click=${(e) => { e.preventDefault(); navigator.goto(`/products/edit/${product.id_producto}`); }}>Editar</a>
                <button class="btn btn-delete" @click=${() => this.deleteProduct(product.id_producto)}>Eliminar</button>
              </div>
            </div>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('view-product-list', ViewProductList);
