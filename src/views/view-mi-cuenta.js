import { LitElement, html, css } from 'lit';
import { authService } from '../services/auth-service.js';
import { popupService } from '../utils/popup-service.js';

export class ViewMiCuenta extends LitElement {
    static properties = {
        user: { type: Object },
        loading: { type: Boolean },
        saving: { type: Boolean },
        showPasswordModal: { type: Boolean },
        showEmailVerifyModal: { type: Boolean },
        passwordData: { type: Object },
        emailVerifyData: { type: Object },
        showCurrentPassword: { type: Boolean },
        showNewPassword: { type: Boolean },
        showConfirmPassword: { type: Boolean }
    };

    static styles = css`
    :host {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --success: #10b981;
      --danger: #ef4444;
      --text: #1e293b;
      --text-light: #64748b;
      --border: #e2e8f0;
      --bg: #fff;
      --card-bg: #ffffff;
      --radius: 24px;
      --shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

      display: block;
      padding: 3rem 2rem;
      min-height: 100vh;
      background-color: var(--bg);
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--text);
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    .header-section {
      text-align: center;
      margin-bottom: 3.5rem;
      animation: fadeInDown 0.6s ease-out;
    }

    .header-section h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
      color: var(--text);
    }

    .header-section p {
      color: var(--text-light);
      margin-top: 0.75rem;
      font-size: 1.1rem;
      font-weight: 500;
    }

    .profile-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 3rem;
      border: 1px solid var(--border);
      animation: fadeInUp 0.8s ease-out;
      position: relative;
      overflow: hidden;
    }

    .profile-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 8px;
      background: linear-gradient(90deg, var(--primary), #8b5cf6);
    }

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 3rem;
    }

    .avatar-large {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      color: var(--primary);
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      border: 4px solid #fff;
      box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
    }

    .role-badge {
      padding: 0.5rem 1.25rem;
      background: #f1f5f9;
      color: #475569;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      position: relative;
    }

    label {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-light);
      padding-left: 0.5rem;
    }

    input, textarea {
      padding: 1rem 1.25rem;
      border: 2px solid var(--border);
      border-radius: 16px;
      font-size: 1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: #fff;
      color: #000;
      font-family: inherit;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .toggle-password {
      position: absolute;
      right: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-light);
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
      z-index: 10;
    }

    .toggle-password:hover {
      color: var(--primary);
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: var(--primary);
      background: #fff;
      box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.1);
      transform: translateY(-2px);
    }

    input:disabled {
      background: #f1f5f9;
      color: #94a3b8;
      cursor: not-allowed;
      border-color: #e2e8f0;
    }

    .actions {
      margin-top: 3.5rem;
      display: flex;
      gap: 1.5rem;
    }

    .btn {
      flex: 1;
      padding: 1.1rem;
      border-radius: 18px;
      font-weight: 750;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-3px);
      box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.4);
    }

    .btn-outline {
      background: white;
      border: 2px solid var(--border);
      color: var(--text);
    }

    .btn-outline:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: #f0f7ff;
      transform: translateY(-3px);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      background: white;
      padding: 3rem;
      border-radius: 32px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .modal-header h2 {
      font-size: 1.75rem;
      font-weight: 800;
      margin: 0 0 0.5rem;
    }

    .modal-header p {
      color: var(--text-light);
      margin-bottom: 2.5rem;
      font-weight: 500;
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2.5rem;
    }

    .loading-container {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 10rem 0; gap: 1.5rem;
    }

    .loader {
      width: 50px; height: 50px;
      border: 5px solid #f1f5f9;
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
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

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
      .profile-card { padding: 2rem 1.5rem; }
      .actions { flex-direction: column; }
    }
  `;

    constructor() {
        super();
        this.user = null;
        this.loading = true;
        this.saving = false;
        this.showPasswordModal = false;
        this.showEmailVerifyModal = false;
        this.showCurrentPassword = false;
        this.showNewPassword = false;
        this.showConfirmPassword = false;
        this.passwordData = {
            current_password: '',
            new_password: '',
            new_password_confirmation: ''
        };
        this.emailVerifyData = {
            new_email: '',
            codigo: ''
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadUserInfo();
    }

    async loadUserInfo() {
        this.loading = true;
        try {
            this.user = await authService.getUser();
        } catch (error) {
            console.error('Error loading user info:', error);
        } finally {
            this.loading = false;
        }
    }

    getRoleName(id_rol) {
        switch (id_rol) {
            case '00001': return 'Cliente';
            case '00002': return 'Personal Operativo';
            case '00003': return 'Administrador';
            default: return 'Usuario';
        }
    }

    handleInputChange(e) {
        const { id, value } = e.target;
        this.user = { ...this.user, [id]: value };
    }

    handlePasswordInputChange(e) {
        const { id, value } = e.target;
        this.passwordData = { ...this.passwordData, [id]: value };
    }

    handleEmailVerifyInputChange(e) {
        const { id, value } = e.target;
        this.emailVerifyData = { ...this.emailVerifyData, [id]: value };
    }

    toggleVisibility(field) {
        if (field === 'current') this.showCurrentPassword = !this.showCurrentPassword;
        if (field === 'new') this.showNewPassword = !this.showNewPassword;
        if (field === 'confirm') this.showConfirmPassword = !this.showConfirmPassword;
    }

    async handleUpdateProfile() {
        this.saving = true;
        try {
            const response = await authService.updateProfile({
                name: this.user.name,
                email: this.user.email,
                telefono: this.user.telefono,
                direccion: this.user.direccion
            });

            if (response.email_change_pending) {
                popupService.info('Cambio Pendiente', response.message);
                this.emailVerifyData.new_email = response.new_email;
                this.showEmailVerifyModal = true;
                this.user = response.data; // Actualizar con otros cambios
                return;
            }

            popupService.success('Éxito', 'Perfil actualizado con éxito');
            this.user = response.data;
        } catch (error) {
            popupService.warning('Error', 'Error al actualizar el perfil: ' + error.message);
        } finally {
            this.saving = false;
        }
    }

    async handleVerifyEmail() {
        if (!this.emailVerifyData.codigo) {
            popupService.info('Código Requerido', 'Por favor, ingrese el código de verificación');
            return;
        }

        this.saving = true;
        try {
            const response = await authService.verifyEmailChange(this.emailVerifyData);
            popupService.success('Éxito', response.message);
            if (response.logout) {
                // Forzar logout y redirección
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } catch (error) {
            popupService.warning('Error', 'Error: ' + error.message);
        } finally {
            this.saving = false;
        }
    }

    async handleChangePassword() {
        if (this.passwordData.new_password !== this.passwordData.new_password_confirmation) {
            popupService.warning('Error', 'Las contraseñas nuevas no coinciden');
            return;
        }

        this.saving = true;
        try {
            await authService.updatePassword(this.passwordData);
            popupService.success('Éxito', 'Contraseña actualizada con éxito');
            this.closePasswordModal();
        } catch (error) {
            popupService.warning('Error', 'Error: ' + error.message);
        } finally {
            this.saving = false;
        }
    }

    openPasswordModal() {
        this.passwordData = { current_password: '', new_password: '', new_password_confirmation: '' };
        this.showCurrentPassword = false;
        this.showNewPassword = false;
        this.showConfirmPassword = false;
        this.showPasswordModal = true;
    }

    closePasswordModal() {
        this.showPasswordModal = false;
    }

    render() {
        if (this.loading) {
            return html`
                <div class="loading-container">
                    <div class="loader"></div>
                    <p style="color: var(--text-light); font-weight: 500;">Cargando tu información...</p>
                </div>
            `;
        }

        if (!this.user) {
            return html`<p style="text-align: center; padding: 5rem;">No se pudo cargar la información del usuario.</p>`;
        }

        return html`
            <div class="container">
                <div class="header-section">
                    <div style="display: flex; justify-content: flex-end;">
                        <button class="btn-back" @click=${() => window.history.back()}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                            Volver
                        </button>
                    </div>
                    <h1>Mi Cuenta</h1>
                    <p>Gestiona tu información personal y seguridad</p>
                </div>

                <div class="profile-card">
                    <div class="avatar-section">
                        <div class="avatar-large">
                            ${(this.user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span class="role-badge">${this.getRoleName(this.user.id_rol)}</span>
                    </div>

                    <div class="form-grid">
                        <div class="form-group">
                            <label for="name">Nombre Completo</label>
                            <input type="text" id="name" .value="${this.user.name || ''}" @input="${this.handleInputChange}">
                        </div>

                        <div class="form-group">
                            <label for="email">Correo Electrónico</label>
                            <input type="email" id="email" .value="${this.user.email || ''}" @input="${this.handleInputChange}">
                        </div>

                        <div class="form-group">
                            <label for="cedula">Cédula / Identificación (No editable)</label>
                            <input type="text" id="cedula" .value="${this.user.cedula || ''}" disabled>
                        </div>

                        <div class="form-group">
                            <label for="telefono">Teléfono de Contacto</label>
                            <input type="text" id="telefono" .value="${this.user.telefono || ''}" @input="${this.handleInputChange}">
                        </div>

                        ${this.user.id_rol === '00001' ? html`
                            <div class="form-group full-width">
                                <label for="direccion">Dirección Personal</label>
                                <textarea id="direccion" rows="3" .value="${this.user.direccion || ''}" @input="${this.handleInputChange}"></textarea>
                            </div>
                        ` : ''}
                    </div>

                    <div class="actions">
                        <button class="btn btn-primary" ?disabled="${this.saving}" @click="${this.handleUpdateProfile}">
                            ${this.saving ? 'Guardando...' : html`
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                                Guardar Cambios
                            `}
                        </button>
                        <button class="btn btn-outline" @click="${this.openPasswordModal}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            Cambiar Contraseña
                        </button>
                    </div>
                </div>
            </div>

            ${this.showPasswordModal ? html`
                <div class="modal-overlay" @click="${(e) => e.target.className === 'modal-overlay' && this.closePasswordModal()}">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>Seguridad</h2>
                            <p>Actualiza tu contraseña para mantener tu cuenta segura</p>
                        </div>

                        <div class="modal-form">
                            <div class="form-group">
                                <label for="current_password">Contraseña Actual</label>
                                <div class="input-wrapper">
                                    <input type="${this.showCurrentPassword ? 'text' : 'password'}" id="current_password" .value="${this.passwordData.current_password}" @input="${this.handlePasswordInputChange}">
                                    <button class="toggle-password" @click="${() => this.toggleVisibility('current')}">
                                        ${this.showCurrentPassword ? html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>` : html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`}
                                    </button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="new_password">Nueva Contraseña</label>
                                <div class="input-wrapper">
                                    <input type="${this.showNewPassword ? 'text' : 'password'}" id="new_password" .value="${this.passwordData.new_password}" @input="${this.handlePasswordInputChange}">
                                    <button class="toggle-password" @click="${() => this.toggleVisibility('new')}">
                                        ${this.showNewPassword ? html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>` : html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`}
                                    </button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="new_password_confirmation">Confirmar Nueva Contraseña</label>
                                <div class="input-wrapper">
                                    <input type="${this.showConfirmPassword ? 'text' : 'password'}" id="new_password_confirmation" .value="${this.passwordData.new_password_confirmation}" @input="${this.handlePasswordInputChange}">
                                    <button class="toggle-password" @click="${() => this.toggleVisibility('confirm')}">
                                        ${this.showConfirmPassword ? html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>` : html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="modal-actions">
                            <button class="btn btn-outline" @click="${this.closePasswordModal}">Cancelar</button>
                            <button class="btn btn-primary" ?disabled="${this.saving}" @click="${this.handleChangePassword}">
                                ${this.saving ? 'Actualizando...' : 'Actualizar'}
                            </button>
                        </div>
                    </div>
                </div>
            ` : ''}

            ${this.showEmailVerifyModal ? html`
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>Verificación de Correo</h2>
                            <p>Hemos enviado un código a <strong>${this.emailVerifyData.new_email}</strong>. Por favor, ingrésalo para completar el cambio.</p>
                        </div>

                        <div class="modal-form">
                            <div class="form-group">
                                <label for="codigo">Código de Verificación</label>
                                <input type="text" id="codigo" placeholder="000000" .value="${this.emailVerifyData.codigo}" @input="${this.handleEmailVerifyInputChange}">
                            </div>
                        </div>

                        <div class="modal-actions">
                            <button class="btn btn-outline" @click="${() => this.showEmailVerifyModal = false}">Cancelar</button>
                            <button class="btn btn-primary" ?disabled="${this.saving}" @click="${this.handleVerifyEmail}">
                                ${this.saving ? 'Verificando...' : 'Confirmar Cambio'}
                            </button>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }
}

customElements.define('view-mi-cuenta', ViewMiCuenta);
