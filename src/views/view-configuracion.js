import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { authService } from '../services/auth-service.js';
import { empresaService } from '../services/empresa-service.js';
import { popupService } from '../utils/popup-service.js';

export class ViewConfiguracion extends LitElement {
  static properties = {
    empresa: { type: Object },
    cuentas: { type: Array },
    loading: { type: Boolean },
    saving: { type: Boolean },
    showCuentaModal: { type: Boolean },
    editingCuenta: { type: Object },
    userRole: { type: String }
  };

  static styles = css`
    :host {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --success: #22c55e;
      --danger: #ef4444;
      --text: #1e293b;
      --text-light: #64748b;
      --border: #e2e8f0;
      --bg: #fff;
      --card-bg: #ffffff;
      --radius: 20px;
      --shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      
      display: block;
      padding: 2.5rem 2rem;
      min-height: 100vh;
      background-color: var(--bg);
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--text);
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3rem;
      animation: fadeInDown 0.6s ease-out;
    }

    .title-group h1 {
      font-size: 2.25rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
    }

    .title-group p {
      color: var(--text-light);
      margin: 0.5rem 0 0;
      font-weight: 500;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--text);
      color: white;
      border-radius: 12px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-back:hover {
      background: #000;
      transform: translateX(-4px);
    }

    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 2.5rem;
      animation: fadeInUp 0.8s ease-out;
    }

    .card {
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      padding: 2rem;
      height: fit-content;
    }

    .card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #f1f5f9;
    }

    .card-title h2 {
      font-size: 1.5rem;
      font-weight: 800;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-size: 0.75rem;
      font-weight: 750;
      text-transform: uppercase;
      color: var(--text-light);
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
      margin-left: 0.25rem;
    }

    input, textarea, select {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      font-size: 0.95rem;
      background: #f8fafc;
      color: var(--text);
      transition: all 0.2s;
      font-family: inherit;
      box-sizing: border-box;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      background: white;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .btn-save {
      background: var(--primary);
      color: white;
      border: none;
      padding: 1rem 2.5rem;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .btn-save:hover:not(:disabled) {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    /* Accounts Table */
    .accounts-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .account-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      background: #f8fafc;
      border-radius: 15px;
      border: 1px solid var(--border);
      transition: all 0.2s;
    }

    .account-item:hover {
      border-color: var(--primary);
      background: white;
      transform: scale(1.01);
    }

    .account-info h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
    }

    .account-info p {
      margin: 0.25rem 0 0;
      font-size: 0.85rem;
      color: var(--text-light);
    }

    .account-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-action {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-edit { background: #eff6ff; color: var(--primary); }
    .btn-edit:hover { background: var(--primary); color: white; }
    
    .btn-delete { background: #fee2e2; color: #ef4444; }
    .btn-delete:hover { background: #ef4444; color: white; }

    .btn-add {
      background: var(--success);
      color: white;
      border: none;
      padding: 0.6rem 1.2rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
    }

    .btn-add:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(34, 197, 94, 0.2);
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      background: white;
      padding: 2.5rem;
      border-radius: 24px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
      animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-header {
      margin-bottom: 2rem;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 800;
    }

    .modal-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-cancel {
      padding: 0.8rem;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: white;
      color: var(--text-light);
      font-weight: 700;
      cursor: pointer;
    }

    /* Checkbox Styles */
    .checkbox-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
        user-select: none;
        padding: 0.75rem 1rem;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px solid #cbd5e1;
        transition: all 0.2s;
    }

    .checkbox-container:hover {
        border-color: var(--primary);
        background: #f0f9ff;
    }

    .checkbox-container input {
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    .checkbox-container span {
        font-weight: 600;
        font-size: 0.95rem;
        color: var(--text);
    }

    /* Loading State */
    .loading-container { 
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center;
      padding: 10rem 0; 
      gap: 1.5rem; 
      height: 100vh;
    }
    .loader { 
      width: 48px; 
      height: 48px; 
      border: 5px solid #f1f5f9; 
      border-top-color: var(--primary); 
      border-radius: 50%; 
      animation: spin 1s linear infinite; 
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes modalSlideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    
    .logo-upload-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 16px;
      border: 2px dashed var(--border);
      transition: all 0.2s;
    }

    .logo-upload-container:hover {
      border-color: var(--primary);
      background: #f0f9ff;
    }

    .logo-preview {
      width: 120px;
      height: 120px;
      border-radius: 12px;
      object-fit: cover;
      background: #e2e8f0;
      border: 2px solid white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .btn-upload {
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      color: var(--text);
      transition: all 0.2s;
    }

    .btn-upload:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    .hidden-file-input {
      display: none;
    }

    @media (max-width: 1024px) {
      .grid-container { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      :host { padding: 1.5rem 1rem; }
      .header-section { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .btn-back { width: 100%; justify-content: center; }
    }
  `;

  constructor() {
    super();
    this.empresa = { nombre: '', correo: '', telefono: '', direccion: '', rif: '', porcentaje_iva: 15, image: null, imagePath: '' };
    this.cuentas = [];
    this.loading = true;
    this.saving = false;
    this.showCuentaModal = false;
    this.editingCuenta = this.resetCuenta();
    this.userRole = '';
  }

  async connectedCallback() {
    super.connectedCallback();
    const userResult = await authService.getUser();
    if (userResult?.id_rol !== '00003') {
      navigator.goto('/dashboard');
      return;
    }
    this.userRole = userResult.id_rol;
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      const empresasResult = await empresaService.getEmpresas();
      if (empresasResult && empresasResult.length > 0) {
        this.empresa = empresasResult[0];
      }
      this.cuentas = await empresaService.getCuentasBancarias();
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      this.loading = false;
    }
  }

  resetCuenta() {
    return {
      banco: '',
      tipo_cuenta: 'Ahorro',
      telefono: '',
      numero_cuenta: '',
      pago_movil: false,
      id_empresa: this.empresa?.id_empresa || ''
    };
  }

  handleEmpresaChange(e) {
    const { id, value, type, files } = e.target;
    const field = id.replace('empresa-', '');

    if (type === 'file') {
      const file = files[0];
      if (file) {
        this.empresa = {
          ...this.empresa,
          image: file,
          _preview: URL.createObjectURL(file)
        };
      }
      return;
    }

    const finalValue = type === 'number' ? Number(value) : value;
    this.empresa = { ...this.empresa, [field]: finalValue };
  }

  async saveEmpresa() {
    if (this.saving) return;
    this.saving = true;
    try {
      const formData = new FormData();
      Object.entries(this.empresa).forEach(([key, value]) => {
        if (key === '_preview') return;
        if (key === 'image' && !(value instanceof File)) return;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      let result;
      if (this.empresa.id_empresa) {
        formData.append('_method', 'PUT'); // For Laravel multipart PUT support
        result = await empresaService.updateEmpresa(this.empresa.id_empresa, formData);
      } else {
        result = await empresaService.storeEmpresa(formData);
      }

      if (result) {
        this.empresa = result;
        // Dispatch event for main-app to refresh logo and name
        window.dispatchEvent(new CustomEvent('company-updated'));
        popupService.success('Éxito', 'Información de la empresa guardada correctamente');
      }
    } catch (error) {
      popupService.warning('Error', 'Error al guardar: ' + error.message);
    } finally {
      this.saving = false;
    }
  }

  openAddCuenta() {
    this.editingCuenta = this.resetCuenta();
    this.editingCuenta.id_empresa = this.empresa.id_empresa;
    this.showCuentaModal = true;
  }

  openEditCuenta(cuenta) {
    this.editingCuenta = { ...cuenta };
    this.showCuentaModal = true;
  }

  handleCuentaChange(e) {
    const { id, value, type, checked } = e.target;
    const field = id.replace('cuenta-', '');
    this.editingCuenta = {
      ...this.editingCuenta,
      [field]: type === 'checkbox' ? checked : value
    };
  }

  async saveCuenta() {
    if (this.saving) return;
    this.saving = true;
    try {
      let result;
      if (this.editingCuenta.id_cuenta_bancaria) {
        result = await empresaService.updateCuentaBancaria(this.editingCuenta.id_cuenta_bancaria, this.editingCuenta);
      } else {
        result = await empresaService.storeCuentaBancaria(this.editingCuenta);
      }

      if (result) {
        await this.loadData();
        this.showCuentaModal = false;
      }
    } catch (error) {
      popupService.warning('Error', 'Error al guardar cuenta: ' + error.message);
    } finally {
      this.saving = false;
    }
  }

  async deleteCuenta(id) {
    popupService.confirm(
      'Eliminar Cuenta',
      '¿Estás seguro de eliminar esta cuenta bancaria?',
      async () => {
        try {
          const success = await empresaService.deleteCuentaBancaria(id);
          if (success) {
            await this.loadData();
            popupService.success('Éxito', 'Cuenta bancaria eliminada correctamente');
          }
        } catch (error) {
          popupService.warning('Error', 'Error al eliminar');
        }
      }
    );
  }

  render() {
    if (this.loading) {
      return html`
                <div class="loading-container">
                    <div class="loader"></div>
                    <p style="color: var(--text-light); font-weight: 500;">Cargando configuración...</p>
                </div>
            `;
    }

    return html`
      <div class="header-section">
        <div class="title-group">
          <h1>Configuración General</h1>
          <p>Gestiona la información maestra de tu empresa y métodos de pago</p>
        </div>
        <button class="btn-back" @click=${() => window.history.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver
        </button>
      </div>

      <div class="grid-container">
        <!-- Empresa Section -->
        <div class="card">
          <div class="card-title">
            <h2>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 21h18M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2M3 7h18M21 7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2M15 5v14"/></svg>
              Datos de Empresa
            </h2>
          </div>

          <div class="logo-upload-container">
            <img 
              class="logo-preview" 
              src="${this.empresa._preview || (this.empresa.imagePath ? `${empresaService.baseUrl}/storage/${this.empresa.imagePath}` : 'https://ui-avatars.com/api/?name=Logo&background=e2e8f0&color=64748b&size=120')}" 
              alt="Logo Preview"
            >
            <button class="btn-upload" @click=${() => this.shadowRoot.querySelector('#empresa-image').click()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 4px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Subir Logo
            </button>
            <input 
              type="file" 
              id="empresa-image" 
              class="hidden-file-input" 
              accept="image/*" 
              @change=${this.handleEmpresaChange}
            >
          </div>

          <div class="form-group">
            <label for="empresa-nombre">Nombre de la Empresa</label>
            <input type="text" id="empresa-nombre" .value=${this.empresa.nombre} @input=${this.handleEmpresaChange}>
          </div>

          <div class="form-group">
            <label for="empresa-rif">RIF / Registro Fiscal</label>
            <input type="text" id="empresa-rif" .value=${this.empresa.rif} @input=${this.handleEmpresaChange}>
          </div>

          <div class="form-group">
            <label for="empresa-correo">Correo Administrativo</label>
            <input type="email" id="empresa-correo" .value=${this.empresa.correo} @input=${this.handleEmpresaChange}>
          </div>

          <div class="form-group">
            <label for="empresa-telefono">Teléfono de Contacto</label>
            <input type="text" id="empresa-telefono" .value=${this.empresa.telefono} @input=${this.handleEmpresaChange}>
          </div>

          <div class="form-group">
            <label for="empresa-porcentaje_iva">IVA (%)</label>
            <input type="number" id="empresa-porcentaje_iva" .value=${this.empresa.porcentaje_iva} @input=${this.handleEmpresaChange} min="0" max="100" step="1">
          </div>

          <div class="form-group">
            <label for="empresa-direccion">Dirección Fiscal</label>
            <textarea id="empresa-direccion" style="color: black;" .value=${this.empresa.direccion} @input=${this.handleEmpresaChange}></textarea>
          </div>

          <button class="btn-save" @click=${this.saveEmpresa} ?disabled=${this.saving}>
            ${this.saving ? 'Guardando...' : html`
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Guardar Cambios
            `}
          </button>
        </div>

        <!-- Cuentas Section -->
        <div class="card">
          <div class="card-title">
            <h2>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              Cuentas Bancarias
            </h2>
            <button class="btn-add" @click=${this.openAddCuenta}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
              Añadir Cuenta
            </button>
          </div>

          <div class="accounts-list">
            ${this.cuentas.length === 0 ? html`
              <div style="text-align: center; padding: 4rem; color: var(--text-light);">
                <p>No hay cuentas bancarias registradas aún.</p>
              </div>
            ` : this.cuentas.map(cuenta => html`
              <div class="account-item">
                <div class="account-info">
                  <h4>${cuenta.banco}</h4>
                  <p>${cuenta.tipo_cuenta} • ${cuenta.numero_cuenta}</p>
                  <p>${cuenta.telefono} ${cuenta.pago_movil ? ' • ✅ Pago Móvil' : ''}</p>
                </div>
                <div class="account-actions">
                  <button class="btn-action btn-edit" @click=${() => this.openEditCuenta(cuenta)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button class="btn-action btn-delete" @click=${() => this.deleteCuenta(cuenta.id_cuenta_bancaria)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>
            `)}
          </div>
        </div>
      </div>

      <!-- Modal Add/Edit Account -->
      ${this.showCuentaModal ? html`
        <div class="modal-overlay" @click=${(e) => e.target.className === 'modal-overlay' && (this.showCuentaModal = false)}>
          <div class="modal-content">
            <div class="modal-header">
              <h2>${this.editingCuenta.id_cuenta_bancaria ? 'Editar Cuenta' : 'Nueva Cuenta'}</h2>
            </div>

            <div class="form-group">
              <label for="cuenta-banco">Banco / Entidad</label>
              <input type="text" id="cuenta-banco" .value=${this.editingCuenta.banco} @input=${this.handleCuentaChange}>
            </div>

            <div class="form-group">
              <label for="cuenta-tipo_cuenta">Tipo de Cuenta</label>
              <select id="cuenta-tipo_cuenta" @change=${this.handleCuentaChange}>
                <option value="Ahorro" ?selected=${this.editingCuenta.tipo_cuenta === 'Ahorro'}>Ahorro</option>
                <option value="Corriente" ?selected=${this.editingCuenta.tipo_cuenta === 'Corriente'}>Corriente</option>
              </select>
            </div>

            <div class="form-group">
              <label for="cuenta-numero_cuenta">Número de Cuenta</label>
              <input type="text" id="cuenta-numero_cuenta" .value=${this.editingCuenta.numero_cuenta} @input=${this.handleCuentaChange}>
            </div>

            <div class="form-group">
              <label for="cuenta-telefono">Teléfono Asociado</label>
              <input type="text" id="cuenta-telefono" .value=${this.editingCuenta.telefono} @input=${this.handleCuentaChange}>
            </div>

            <div class="form-group">
                <label class="checkbox-container">
                    <input type="checkbox" id="cuenta-pago_movil" ?checked=${this.editingCuenta.pago_movil} @change=${this.handleCuentaChange}>
                    <span>Habilitar Pago Móvil</span>
                </label>
            </div>

            <div class="modal-actions">
              <button class="btn-cancel" @click=${() => this.showCuentaModal = false}>Cancelar</button>
              <button class="btn-save" @click=${this.saveCuenta} ?disabled=${this.saving}>
                ${this.saving ? 'Guardando...' : 'Guardar Cuenta'}
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('view-configuracion', ViewConfiguracion);
