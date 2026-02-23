import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { navigator } from '../utils/navigator.js';
import { serviciosService } from '../services/servicios-service.js';
import { authService } from '../services/auth-service.js';
import confetti from 'canvas-confetti';

export class ViewServiciosOrdenAvances extends LitElement {
  static properties = {
    ordenId: { type: String },
    orden: { type: Object },
    avances: { type: Array },
    id_rol: { type: String },
    loading: { type: Boolean },
    currentUser: { type: Object },
    selectedAvance: { type: Object },
    showModal: { type: Boolean },
    isEditing: { type: Boolean },
    imagePreview: { type: String }
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
      --danger: #ef4444;
      --danger-hover: #dc2626;
      
      display: block;
      padding: 2rem 1rem;
      font-family: 'Inter', system-ui, sans-serif;
      color: var(--text);
      background-color: var(--bg);
      min-height: 100vh;
    }

    .container {
      max-width: 1000px;
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
      margin-bottom: 3rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
    }

    .btn-register {
      padding: 0.75rem 1.5rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
    }

    .btn-register:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
    }

    /* Progress Bar Styles */
    .progress-container {
      position: relative;
      margin-top: 10rem;
      margin-bottom: 4rem;
      padding: 0 2rem;
    }

    .progress-track {
      height: 48px;
      background: #e2e8f0;
      border-radius: 24px;
      position: relative;
      overflow: visible; /* To let flags stick out */
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
      border: 2px solid #cbd5e1;
      background-image: repeating-linear-gradient(
        45deg,
        rgba(59, 130, 246, 0.1),
        rgba(59, 130, 246, 0.1) 10px,
        transparent 10px,
        transparent 20px
      );
    }

    .progress-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 24px;
      transition: width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
      position: absolute;
      top: 0;
      left: 0;
    }

    /* Flags Logic */
    .flag {
      position: absolute;
      bottom: 100%;
      transform: translateX(-50%);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 5;
    }

    .flag:hover {
      transform: translateX(-50%) scale(1.1) translateY(-5px);
    }

    .flag.selected {
      z-index: 10;
    }

    .flag.selected .flag-icon {
      background: var(--primary);
      transform: translateY(-2px) scale(1.2);
      filter: drop-shadow(0 4px 6px rgba(59, 130, 246, 0.4));
    }

    .flag.selected .flag-percentage {
      color: var(--primary);
      transform: translateY(-2px);
    }

    .flag.selected .flag-line {
      background: var(--primary);
      height: 35px;
      width: 3px;
    }

    .flag-percentage {
      font-size: 0.85rem;
      font-weight: 800;
      color: var(--danger);
      margin-bottom: 0.25rem;
    }

    .flag-icon {
      width: 32px;
      height: 32px;
      background: var(--danger);
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z'%3E%3C/path%3E%3Cline x1='4' y1='22' x2='4' y2='15'%3E%3C/line%3E%3C/svg%3E");
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z'%3E%3C/path%3E%3Cline x1='4' y1='22' x2='4' y2='15'%3E%3C/line%3E%3C/svg%3E");
      mask-size: contain;
      -webkit-mask-size: contain;
      mask-repeat: no-repeat;
      -webkit-mask-repeat: no-repeat;
      transition: all 0.3s ease;
    }

    .flag-line {
      width: 2px;
      height: 30px;
      background: #94a3b8;
      margin-top: -2px;
      transition: all 0.3s ease;
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 0.75rem;
      padding: 0 0.5rem;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-light);
    }

    /* Details Panel */
    .details-card {
      background: white;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      padding: 2.5rem;
      margin-top: 2rem;
      position: relative;
      animation: slideUp 0.4s ease-out;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .details-title {
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      color: var(--text);
    }

    .details-content {
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--text-light);
      animation: fadeInContent 0.5s ease;
    }

    @keyframes fadeInContent {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .btn-delete {
      position: absolute;
      bottom: 2rem;
      right: 2.5rem;
      padding: 0.6rem 1.2rem;
      background: transparent;
      color: var(--danger);
      border: 2px solid var(--danger);
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-delete:hover {
      background: var(--danger);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }

    .btn-edit {
      padding: 0.6rem 1.8rem;
      background: transparent;
      color: #f59e0b;
      border: 2px solid #f59e0b;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-edit:hover {
      background: #f59e0b;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
    }

    .evidence-preview-container {
      margin-top: 1rem;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border);
      max-width: 300px;
      cursor: pointer;
      transition: transform 0.3s;
    }

    .evidence-preview-container:hover {
      transform: scale(1.02);
    }

    .evidence-large {
      width: 100%;
      height: 180px;
      object-fit: cover;
      display: block;
    }

    /* Modal / Form Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .modal {
      background: white;
      padding: 2.5rem;
      border-radius: 20px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      color: var(--text-light);
    }

    input, textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 1rem;
      font-family: inherit;
      box-sizing: border-box;
      background: white !important;
      color: black !important;
    }

    textarea {
      min-height: 120px;
      resize: vertical;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-cancel {
      padding: 0.75rem 1.5rem;
      background: #f1f5f9;
      border: none;
      border-radius: 12px;
      color: var(--text-light);
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: #e2e8f0;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      color: var(--text);
    }

    .btn-submit {
      padding: 0.75rem 2rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-submit:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
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

    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid var(--border);
      border-bottom-color: var(--primary);
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .file-upload-wrapper {
      position: relative;
      width: 100%;
    }

    .upload-zone {
      display: block;
      width: 100%;
      padding: 2rem;
      border: 2.5px dashed var(--border);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      background: #f8fafc;
      box-sizing: border-box;
      text-align: center;
    }

    .upload-zone:hover {
      border-color: var(--primary);
      background: #eff6ff;
      color: var(--primary);
      transform: translateY(-2px);
    }

    .upload-zone svg {
      color: var(--primary);
      width: 28px;
      height: 28px;
    }

    .upload-zone span {
      display: block;
      margin-top: 0.75rem;
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .upload-zone:hover span {
      color: var(--primary);
    }

    input[type="file"] {
      display: none;
    }

    .preview-container {
      margin-top: 1rem;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border);
      position: relative;
    }

    .preview-img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
    }

    .btn-remove-preview {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: rgba(255,255,255,0.9);
      border: none;
      padding: 0.4rem;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      color: var(--danger);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.2s;
    }

    .btn-remove-preview:hover {
      background: white;
      transform: scale(1.1);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 60vh;
      text-align: center;
      gap: 1.5rem;
    }

    .loading-container p {
      font-weight: 600;
      color: var(--text-light);
      margin: 0;
    }

    /* Jefes styles */
    .jefes-section {
      background: #f8fafc;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .jefes-label {
      font-weight: 800;
      font-size: 0.85rem;
      text-transform: uppercase;
      color: var(--text-light);
      letter-spacing: 0.05em;
    }

    .jefe-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: white;
      padding: 0.5rem 1rem;
      border-radius: 999px;
      border: 1px solid var(--border);
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--text);
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .jefe-badge svg {
      color: var(--primary);
    }
  `;

  constructor() {
    super();
    this.ordenId = '';
    this.orden = null;
    this.avances = [];
    this.id_rol = '';
    this.loading = true;
    this.currentUser = null;
    this.selectedAvance = null;
    this.showModal = false;
    this.isEditing = false;
    this.imagePreview = '';
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.ordenId) {
      await this.loadData();
    }
  }

  async loadData() {
    this.loading = true;
    try {
      const [orderData, avancesData, userData] = await Promise.all([
        serviciosService.getOneOrden(this.ordenId, true),
        serviciosService.getAvancesOrden(this.ordenId).catch(() => []),
        authService.getUser()
      ]);

      if (orderData) {
        this.orden = orderData.orden;
        this.id_rol = orderData.id_rol;
      }

      // Normalizar avances: asegurar que sea un array
      if (Array.isArray(avancesData)) {
        this.avances = avancesData;
      } else if (avancesData && typeof avancesData === 'object') {
        if (Array.isArray(avancesData.avances_orden)) {
          this.avances = avancesData.avances_orden;
        } else if (Array.isArray(avancesData.avances)) {
          this.avances = avancesData.avances;
        } else {
          this.avances = [];
        }
      } else {
        this.avances = [];
      }

      this.currentUser = userData;

      // Auto-select last avance if exists
      if (this.avances.length > 0) {
        this.selectedAvance = this.avances[this.avances.length - 1];
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.avances = [];
    } finally {
      this.loading = false;
    }
  }

  get totalPercentage() {
    if (!Array.isArray(this.avances)) return 0;
    return this.avances.reduce((acc, a) => acc + parseFloat(a.porcentaje_avance || a.porcentaje || 0), 0);
  }

  get myOperativoId() {
    if (!this.currentUser || !this.orden) return null;
    const myId = String(this.currentUser.id);
    const servicios = this.orden.servicios || this.orden.array_servicios || [];
    for (const s of servicios) {
      const op = (s.operativos_asignados || []).find(o => String(o.id_user) === myId && Number(o.es_jefe) === 1);
      if (op) return op.id_operativo;
    }
    return null;
  }

  get assignedJefes() {
    if (!this.orden) return [];
    const jefes = new Map();
    const servicios = this.orden.servicios || this.orden.array_servicios || [];
    servicios.forEach(s => {
      (s.operativos_asignados || []).forEach(o => {
        if (Number(o.es_jefe) === 1) {
          jefes.set(o.id_operativo, {
            nombre: o.nombre_operativo || o.nombre,
            id: o.id_operativo
          });
        }
      });
    });
    return Array.from(jefes.values());
  }

  get isJefeDeObra() {
    if (!this.currentUser || !this.orden) return false;
    const myId = String(this.currentUser.id);
    const servicios = this.orden.servicios || this.orden.array_servicios || [];
    return servicios.some(s =>
      (s.operativos_asignados || []).some(op =>
        String(op.id_user) === myId && Number(op.es_jefe) === 1
      )
    );
  }

  get canEdit() {
    // No se puede editar ni eliminar si la orden ya está completada
    if (this.orden?.estado?.toLowerCase().includes('comp')) return false;
    // Solo el Jefe de Obra asignado puede realizar acciones de escritura
    return this.isJefeDeObra;
  }

  selectAvance(avance) {
    this.selectedAvance = avance;
  }

  openRegisterModal() {
    this.selectedAvance = null;
    this.isEditing = false;
    this.showModal = true;
  }

  openEditModal() {
    if (!this.selectedAvance) return;
    this.isEditing = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isEditing = false;
    this.imagePreview = '';
  }

  handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.imagePreview = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePreview() {
    this.imagePreview = '';
    const fileInput = this.shadowRoot.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  }

  async handleSubmit(e) {
    e.preventDefault();
    const formEl = e.target;
    const formData = new FormData(formEl);

    const newPorcentaje = parseFloat(formData.get('porcentaje_avance'));

    // Calcular suma de los OTROS avances
    const otherAdvancesSum = this.avances
      .filter(a => !this.isEditing || a.id_avance_orden !== this.selectedAvance?.id_avance_orden)
      .reduce((acc, a) => acc + parseFloat(a.porcentaje_avance || a.porcentaje || 0), 0);

    if (otherAdvancesSum + newPorcentaje > 100) {
      alert(`El porcentaje total no puede exceder el 100%. El máximo permitido para este avance es ${100 - otherAdvancesSum}%.`);
      return;
    }

    // Agregar campos requeridos por el backend
    formData.append('id_orden', this.ordenId);

    // Solo permitimos el envío si es Jefe de Obra
    let opId = this.myOperativoId;

    if (!opId) {
      alert('Solo los Jefes de Obra asignados pueden registrar o editar avances.');
      return;
    }
    formData.append('id_operativo', opId);

    // Limpiar imagen si el input está vacío para evitar error en el backend
    const imageFile = formData.get('image');
    if (imageFile && imageFile instanceof File && imageFile.size === 0) {
      formData.delete('image');
    }

    try {
      this.loading = true;
      const today = new Date().toLocaleString('sv-SE', { timeZone: 'America/Caracas' }).split(' ')[0];
      if (this.isEditing && this.selectedAvance) { // Original condition
        await serviciosService.updateAvance(this.selectedAvance.id_avance_orden, formData);
      } else {
        await serviciosService.createAvance(formData);
      }
      this.showModal = false;
      this.isEditing = false;
      await this.loadData();

      if (this.totalPercentage >= 100) {
        this.triggerConfetti();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      this.loading = false;
    }
  }

  triggerConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }

  async handleDelete() {
    if (!this.selectedAvance) return;
    if (confirm('¿Está seguro de que desea eliminar este avance?')) {
      try {
        this.loading = true;
        await serviciosService.eliminarAvance(this.selectedAvance.id_avance_orden);
        this.selectedAvance = null;
        await this.loadData();
      } catch (error) {
        alert('Error: ' + error.message);
      } finally {
        this.loading = false;
      }
    }
  }

  render() {
    if (this.loading && !this.orden) {
      return html`
        <div class="loading-container">
          <div class="loader"></div>
          <p>Cargando información de la orden...</p>
        </div>
      `;
    }

    if (!this.orden) return html`<div class="container"><h2>Orden no encontrada</h2></div>`;

    const totalProgress = Math.min(this.totalPercentage, 100);
    const isCompleted = this.orden?.estado?.toLowerCase().includes('comp');
    const showRegisterBtn = this.isJefeDeObra && totalProgress < 100 && !isCompleted;

    return html`
      <div class="container">
        <header class="header">
          <div style="display: flex; align-items: center; gap: 2rem;">
            <h1>ORDEN #${this.orden.id_orden}</h1>
            ${showRegisterBtn ? html`
              <button class="btn-register" @click=${this.openRegisterModal}>
                Registrar Nuevo Avance
              </button>
            ` : ''}
          </div>
          <button class="btn-back" @click=${() => navigator.goto('/servicios/listado/orden')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m15 18-6-6 6-6"/></svg>
            Volver
          </button>
        </header>

        ${this.assignedJefes.length > 0 ? html`
          <div class="jefes-section">
            <span class="jefes-label">Jefe(s) de Obra:</span>
            ${this.assignedJefes.map(jefe => html`
              <div class="jefe-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                ${jefe.nombre}
              </div>
            `)}
          </div>
        ` : ''}

        <section class="progress-container">
          <div class="progress-track">
            <div class="progress-fill" style="width: ${totalProgress}%"></div>
            
            ${this.avances.reduce((acc, avance, idx) => {
      const currentSum = acc.sum + parseFloat(avance.porcentaje_avance || avance.porcentaje);
      acc.elements.push(html`
                <div class="flag ${this.selectedAvance?.id_avance_orden === avance.id_avance_orden ? 'selected' : ''}" 
                     style="left: ${currentSum}%"
                     @click=${() => this.selectAvance(avance)}>
                  <span class="flag-percentage">${Number(avance.porcentaje_avance || avance.porcentaje).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%</span>
                  <div class="flag-icon"></div>
                  <div class="flag-line"></div>
                </div>
              `);
      return { sum: currentSum, elements: acc.elements };
    }, { sum: 0, elements: [] }).elements}
          </div>
          
          <div class="progress-labels">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </section>

        ${this.avances.length === 0 ? html`
          <div style="background: #f8fafc; border: 2px dashed var(--border); border-radius: 20px; padding: 3rem; text-align: center; margin-top: 2rem; animation: fadeIn 0.5s ease-out;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; opacity: 0.5;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <h3 style="margin: 0; color: var(--text); font-weight: 700;">Sin avances registrados</h3>
            <p style="color: var(--text-light); margin-top: 0.5rem;">Esta orden aún no cuenta con reportes de progreso.</p>
            ${showRegisterBtn ? html`
              <p style="font-size: 0.9rem; font-weight: 600; color: var(--primary); margin-top: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                ¡Comienza registrando el primero!
              </p>
            ` : ''}
          </div>
        ` : ''}

        ${this.selectedAvance ? repeat([this.selectedAvance], (a) => a.id_avance_orden, (avance) => html`
          <article class="details-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                <h2 class="details-title" style="margin-bottom: 0;">
                    Fecha del avance: ${avance.created_at || avance.fecha_avance
        ? new Date(avance.created_at || avance.fecha_avance).toLocaleString('es-VE', {
          timeZone: 'America/Caracas',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        : 'Detalle del Avance'}
                </h2>
                <div style="text-align: right;">
                    <div style="font-size: 0.7rem; font-weight: 800; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.05em;">Registrado por:</div>
                    <div style="font-weight: 700; color: var(--primary); font-size: 0.95rem;">${avance.nombre_operativo || 'N/A'}</div>
                </div>
            </div>
            <div class="details-content">
              <div class="form-group">
                <label>Descripción del avance</label>
                <textarea disabled style="background: white !important; color: black !important; border: none; padding-left: 0;">${avance.descripcion}</textarea>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 2rem; margin-top: 1rem;">
                <div>
                    <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--text-light); text-transform:uppercase;">Porcentaje aportado</label>
                    <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">${Number(avance.porcentaje_avance || avance.porcentaje).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%</div>
                </div>
                ${avance.imagePath ? html`
                    <div style="flex: 1; min-width: 250px;">
                        <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--text-light); text-transform:uppercase;">Evidencia</label>
                        <div class="evidence-preview-container">
                            <img src="${serviciosService.baseUrl}/storage/${avance.imagePath}" class="evidence-large" alt="Evidencia de avance">
                        </div>
                    </div>
                ` : html`
                    <div style="flex: 1; min-width: 250px;">
                        <label style="display:block; font-size:0.75rem; font-weight:700; color:var(--text-light); text-transform:uppercase;">Evidencia</label>
                        <div style="background: #f8fafc; border-radius: 12px; padding: 1rem; text-align: center; color: var(--text-light); border: 2px dashed #e2e8f0; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; box-sizing: border-box; margin-top: 1rem; max-width: 300px;">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity: 0.3;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="3" x2="21" y2="21"></line><circle cx="8.5" cy="8.5" r="1.5"></circle></svg>
                            <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.6;">Sin imagen adjunta</span>
                        </div>
                    </div>
                `}
              </div>
            </div>
            
            ${this.canEdit ? html`
              <div style="position: absolute; bottom: 2rem; right: 2.5rem; display: flex; gap: 1rem; align-items: center;">
                <button class="btn-edit" @click=${this.openEditModal}>
                  Editar
                </button>
                <button class="btn-delete" style="position: static;" @click=${this.handleDelete}>
                  Eliminar
                </button>
              </div>
            ` : ''}
          </article>
        `) : html`
          <div style="text-align: center; padding: 4rem; color: var(--text-light);">
            <p>Haga clic en una de las banderas para ver los detalles del avance.</p>
          </div>
        `}
      </div>

      <!-- Modal para registrar/editar avance -->
      ${this.showModal ? html`
        <div class="modal-overlay" @click=${this.closeModal}>
          <div class="modal" @click=${e => e.stopPropagation()}>
            <h2 style="margin-top: 0; margin-bottom: 1.5rem;">${this.isEditing ? 'Editar Avance' : 'Nuevo Avance'}</h2>
            <form @submit=${this.handleSubmit}>
              <div class="form-group">
                <label>Descripción del Avance</label>
                <textarea name="descripcion" required placeholder="Detalle los trabajos realizados..." .value=${this.isEditing ? this.selectedAvance.descripcion : ''}></textarea>
              </div>
              <div class="form-group">
                <label>Porcentaje de Avance (%)</label>
                <input type="number" name="porcentaje_avance" min="0.01" max="100" step="0.01" required placeholder="Ej: 12.50" .value=${this.isEditing ? (this.selectedAvance.porcentaje_avance || this.selectedAvance.porcentaje) : ''}>
                <small style="color: var(--text-light);">
                    ${(() => {
          const otherSum = this.avances
            .filter(a => !this.isEditing || a.id_avance_orden !== this.selectedAvance?.id_avance_orden)
            .reduce((acc, a) => acc + parseFloat(a.porcentaje_avance || a.porcentaje || 0), 0);
          return html`Máximo permitido: ${(100 - otherSum).toFixed(2)}%`;
        })()}
                </small>
              </div>
              <div class="form-group">
                <label>Imagen de Evidencia (Opcional)</label>
                <div class="file-upload-wrapper">
                    <label for="imageInput" class="upload-zone ${this.imagePreview ? 'has-file' : ''}">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>${this.imagePreview ? 'Cambiar imagen de evidencia' : 'Subir imagen o foto'}</span>
                    </label>
                    <input type="file" name="image" id="imageInput" accept="image/*" @change=${this.handleFileChange}>
                </div>
                
                ${this.imagePreview ? html`
                    <div class="preview-container">
                        <img src="${this.imagePreview}" class="preview-img">
                        <button type="button" class="btn-remove-preview" @click=${this.removePreview}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                ` : ''}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn-cancel" @click=${this.closeModal}>Cancelar</button>
                <button type="submit" class="btn-submit">${this.isEditing ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('view-servicios-orden-avances', ViewServiciosOrdenAvances);
