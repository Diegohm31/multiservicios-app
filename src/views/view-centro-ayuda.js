import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { authService } from '../services/auth-service.js';

export class ViewCentroAyuda extends LitElement {
    static properties = {
        faqs: { type: Array },
        expandedFaq: { type: Number },
        customQuestion: { type: String },
        sending: { type: Boolean },
        user: { type: Object }
    };

    static styles = css`
    :host {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --text: #1e293b;
      --text-light: #64748b;
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
      margin-bottom: 3rem;
      animation: fadeInDown 0.6s ease-out;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-section h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
    }

    .header-section p {
      color: var(--text-light);
      margin: 0.5rem 0 0;
      font-size: 1.1rem;
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

    /* FAQ Accordion */
    .faq-container {
      max-width: 800px;
      margin: 0 auto 4rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .faq-item {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 15px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .faq-item:hover {
      border-color: var(--primary);
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    .faq-header {
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
      background: white;
    }

    .faq-header h3 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text);
    }

    .faq-icon {
      width: 20px;
      height: 20px;
      transition: transform 0.3s ease;
      color: var(--text-light);
    }

    .faq-item.active .faq-icon {
      transform: rotate(180deg);
      color: var(--primary);
    }

    .faq-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: #f8fafc;
    }

    .faq-item.active .faq-content {
      max-height: 500px;
    }

    .faq-answer {
      padding: 1.5rem;
      color: var(--text-light);
      line-height: 1.6;
      font-size: 0.95rem;
    }

    /* Custom Question Form */
    .form-section {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 2.5rem;
      border-radius: var(--radius);
      border: 1px solid #e2e8f0;
      box-shadow: var(--shadow);
      animation: fadeInUp 0.7s ease-out;
    }

    .form-section h2 {
      margin: 0 0 1rem;
      font-size: 1.5rem;
      font-weight: 800;
    }

    .form-section p {
      color: var(--text-light);
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    textarea {
      color: black;
      width: 100%;
      min-height: 150px;
      padding: 1rem;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      font-size: 1rem;
      font-family: inherit;
      resize: vertical;
      transition: all 0.2s;
      box-sizing: border-box;
      background: #f8fafc;
    }

    textarea:focus {
      outline: none;
      border-color: var(--primary);
      background: white;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .btn-send {
      background: var(--primary);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.3s;
      width: 100%;
      justify-content: center;
    }

    .btn-send:hover:not(:disabled) {
      background: var(--primary-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-send:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 640px) {
      :host { padding: 1.5rem 1rem; }
      .header-section { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .btn-back { width: 100%; justify-content: center; }
    }
  `;

    constructor() {
        super();
        this.expandedFaq = -1;
        this.customQuestion = '';
        this.sending = false;
        this.user = null;
        this.faqs = [
            {
                question: '¿Cómo puedo solicitar un servicio?',
                answer: 'Para solicitar un servicio, ingresa a la sección "Catálogo de Servicios", selecciona el que necesites y sigue los pasos para completar tu orden. Un administrador revisará tu solicitud y te enviará un presupuesto.'
            },
            {
                question: '¿Cuáles son los métodos de pago aceptados?',
                answer: 'Aceptamos transferencias bancarias, depósitos y pagos por plataformas digitales. Una vez realizado el pago, debes subir el comprobante en la sección "Mis Órdenes" para que sea validado por nuestro equipo.'
            },
            {
                question: '¿Qué es una membresía y qué beneficios ofrece?',
                answer: 'Nuestras membresías ofrecen descuentos exclusivos en servicios. Puedes consultar los planes disponibles en la sección "Membresías".'
            },
            {
                question: '¿Cómo puedo cancelar una orden?',
                answer: 'Puedes cancelar una orden desde la vista de detalles de la orden, siempre y cuando esta no haya sido puesta en ejecución. Si tienes problemas, contáctanos directamente.'
            },
            {
                question: '¿En cuánto tiempo recibiré mi presupuesto?',
                answer: 'Normalmente, procesamos las solicitudes en un periodo de 24 a 48 horas hábiles. Recibirás una notificación por correo electrónico una vez que tu presupuesto esté listo para ser revisado.'
            }
        ];
    }

    async connectedCallback() {
        super.connectedCallback();
        this.user = await authService.getUser();
    }

    toggleFaq(index) {
        this.expandedFaq = this.expandedFaq === index ? -1 : index;
    }

    handleInputChange(e) {
        this.customQuestion = e.target.value;
    }

    async sendQuestion() {
        if (!this.customQuestion.trim() || this.sending) return;

        this.sending = true;
        try {
            await authService.enviarDuda({
                duda: this.customQuestion,
                email: this.user?.email
            });

            alert('Tu duda ha sido enviada exitosamente. Un administrador se pondrá en contacto contigo pronto.');
            this.customQuestion = '';
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            this.sending = false;
        }
    }

    render() {
        return html`
      <div class="header-section">
        <div class="title-group">
          <p>Soporte y Consultas</p>
          <h1>Centro de Ayuda</h1>
        </div>
        <button class="btn-back" @click=${() => window.history.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Volver
        </button>
      </div>

      <div class="faq-container">
        ${this.faqs.map((faq, index) => html`
          <div class="faq-item ${this.expandedFaq === index ? 'active' : ''}">
            <div class="faq-header" @click=${() => this.toggleFaq(index)}>
              <h3>${faq.question}</h3>
              <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
            <div class="faq-content">
              <div class="faq-answer">${faq.answer}</div>
            </div>
          </div>
        `)}
      </div>

      <div class="form-section">
        <h2>¿Todavía tienes dudas?</h2>
        <p>Si no encontraste la respuesta que buscabas, envíanos tu pregunta directamente y nuestro equipo administrativo te responderá a la brevedad.</p>
        
        <div class="form-group">
          <textarea 
            placeholder="Escribe aquí tu duda o consulta detalladamente..." 
            .value=${this.customQuestion}
            @input=${this.handleInputChange}
          ></textarea>
        </div>

        <button 
          class="btn-send" 
          ?disabled=${!this.customQuestion.trim() || this.sending}
          @click=${this.sendQuestion}
        >
          ${this.sending ? html`
            <div class="loader" style="width: 20px; height: 20px; border-width: 3px; border-top-color: white;"></div>
            Enviando...
          ` : html`
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Enviar Consulta
          `}
        </button>
      </div>
    `;
    }
}

customElements.define('view-centro-ayuda', ViewCentroAyuda);
