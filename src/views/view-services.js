import { LitElement, html, css } from 'lit';

export class ViewServices extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }
    .placeholder {
      text-align: center;
      padding: 50px;
      background: #f8f9fa;
      border: 2px dashed #dee2e6;
      border-radius: 10px;
      color: #6c757d;
    }
    h1 { margin-top: 0; color: #343a40; }
  `;

  render() {
    console.log('render services');
    return html`
      <h1>Catálogo de Servicios</h1>
      <div class="placeholder">
        <h2>🚧 En Construcción</h2>
        <p>Próximamente podrás administrar el catálogo de servicios aquí.</p>
      </div>
    `;
  }
}

customElements.define('view-services', ViewServices);
