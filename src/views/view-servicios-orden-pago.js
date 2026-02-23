import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { serviciosService } from '../services/servicios-service.js';

export class ViewServiciosOrdenPago extends LitElement {
  static properties = {
    ordenId: { type: String },
    orden: { type: Object },
    loading: { type: Boolean },
    processing: { type: Boolean },
    formData: { type: Object },
    previewUrl: { type: String },
  };

  static styles = css`
    :host {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --success: #10b981;
      --danger: #ef4444;
      --bg: #fff;
      --card-bg: #ffffff;
      --text: #1e293b;
      --text-light: #64748b;
      --border: #e2e8f0;
      --radius: 16px;
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      
      display: block;
      padding: 2rem 1rem;
      font-family: 'Inter', -apple-system, sans-serif;
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

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      font-size: 1.875rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
    }

    .card {
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .form-group {
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
      color: var(--text-light);
    }

    input, select {
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.2s;
      background-color: #ffffff;
      color: #000000;
    }

    input:focus, select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .summary-box {
      background: #f1f5f9;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .amount-display {
      text-align: right;
    }

    .amount-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--text-light);
    }

    .amount-value {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary);
    }

    .btn-submit {
      background: var(--success);
      color: white;
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      width: 100%;
      margin-top: 1rem;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-submit:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-2px);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.2rem;
      background: var(--text);
      color: white;
      border-radius: 10px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }

    .btn-back:hover {
      background: #000;
      transform: translateX(-4px);
    }

    .upload-zone {
      border: 2.5px dashed #cbd5e1;
      border-radius: 12px;
      padding: 2.5rem;
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
      background: #f0f7ff;
      color: var(--primary);
      transform: translateY(-2px);
    }

    .upload-zone span {
      font-weight: 700;
      font-size: 1rem;
    }

    .upload-zone.has-file {
      border-color: var(--success);
      background: #f0fdf4;
      color: var(--success);
    }

    input[type="file"] {
      display: none;
    }

    .loader {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  constructor() {
    super();
    this.loading = true;
    this.processing = false;
    this.formData = {
      id_orden: '',
      monto: '',
      metodo_pago: '',
      num_referencia: '',
      image: null
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      const orderData = await serviciosService.getOneOrden(this.ordenId, false);

      if (orderData && orderData.orden) {
        this.orden = orderData.orden;

        // El monto se obtiene directamente del presupuesto asociado a la orden
        const total = this.orden.presupuesto?.total_a_pagar || 0;

        this.formData = {
          ...this.formData,
          monto: parseFloat(total).toFixed(2),
          id_orden: this.ordenId
        };
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error al cargar la información de la orden');
    } finally {
      this.loading = false;
    }
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.formData = { ...this.formData, [name]: value };
  }

  handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      this.formData = { ...this.formData, image: file };
      this.previewUrl = URL.createObjectURL(file);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.formData.metodo_pago || !this.formData.num_referencia || !this.formData.image) {
      alert('Por favor complete todos los campos obligatorios y adjunte el comprobante.');
      return;
    }

    this.processing = true;
    try {
      const formData = new FormData();
      formData.append('id_orden', this.ordenId);
      formData.append('monto', this.formData.monto);
      formData.append('metodo_pago', this.formData.metodo_pago);
      formData.append('num_referencia', this.formData.num_referencia);
      formData.append('image', this.formData.image);

      await serviciosService.createReportePago(formData);
      alert('Reporte de pago enviado correctamente. Será validado por un administrador.');
      navigator.goto('/servicios/listado/orden');
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Error al enviar el reporte: ' + error.message);
    } finally {
      this.processing = false;
    }
  }

  render() {
    if (this.loading) {
      return html`
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh;">
          <div class="loader" style="border-top-color: var(--primary); width: 40px; height: 40px;"></div>
          <p style="margin-top: 1rem; color: var(--text-light);">Cargando información...</p>
        </div>
      `;
    }

    if (!this.orden) {
      return html`<div class="container"><h2>Orden no encontrada</h2></div>`;
    }

    return html`
      <div class="container">
        <header class="header">
          <div>
            <h1>Reportar Pago</h1>
            <p style="color: var(--text-light); margin-top: 0.5rem;">Reporte de pago para la Orden #${this.orden.id_orden}</p>
          </div>
          <button class="btn-back" @click=${() => navigator.goto('/servicios/listado/orden')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
            Volver
          </button>
        </header>

        <section class="summary-box">
          <div>
            <div style="font-weight: 700; color: var(--text);">Información de la Orden</div>
            <div style="font-size: 0.9rem; color: var(--text-light);">${this.orden.direccion}</div>
          </div>
          <div class="amount-display">
            <div class="amount-label">Monto a Pagar</div>
            <div class="amount-value">$${parseFloat(this.formData.monto).toFixed(2)}</div>
          </div>
        </section>

        <div class="card">
          <form @submit=${this.handleSubmit}>
            <div class="form-grid">
              <div class="form-group">
                <label>Método de Pago</label>
                <select name="metodo_pago" .value=${this.formData.metodo_pago} @change=${this.handleInput} required>
                  <option value="">Seleccione un método</option>
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                  <option value="Pago Móvil">Pago Móvil</option>
                  <option value="Zelle">Zelle</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Binance">Binance (USDT)</option>
                </select>
              </div>

              <div class="form-group">
                <label>Número de Referencia</label>
                <input type="text" name="num_referencia" .value=${this.formData.num_referencia} @input=${this.handleInput} required>
              </div>

              <div class="form-group">
                <label>Monto Reportado ($)</label>
                <input type="number" step="0.01" name="monto" .value=${this.formData.monto} readonly style="background-color: #f1f5f9; cursor: not-allowed; color: var(--text-light);">
              </div>

              <div class="form-group full-width">
                <label>Comprobante de Pago (Imagen)</label>
                <label class="upload-zone ${this.formData.image ? 'has-file' : ''}" for="image">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>${this.formData.image ? this.formData.image.name : 'Subir Comprobante / Capture'}</span>
                </label>
                <input type="file" id="image" name="image" @change=${this.handleFileChange} accept="image/*" required>
                ${this.previewUrl ? html`
                  <div style="margin-top: 1rem; text-align: center;">
                    <img src="${this.previewUrl}" alt="Vista previa del comprobante" style="max-width: 100%; max-height: 300px; border-radius: 10px; border: 1px solid var(--border);">
                  </div>
                ` : ''}
              </div>
            </div>

            <button type="submit" class="btn-submit" ?disabled=${this.processing}>
              ${this.processing ? html`<div class="loader"></div> Enviando...` : 'Enviar Reporte de Pago'}
            </button>
          </form>
        </div>
      </div>
    `;
  }
}

customElements.define('view-servicios-orden-pago', ViewServiciosOrdenPago);
