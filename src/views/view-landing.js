import { LitElement, html, css } from 'lit';
import { tiposServiciosService } from '../services/tipos-servicios-service';
import { empresaService } from '../services/empresa-service';
import { planesMembresiasService } from '../services/planes-membresias-service';
import { authService } from '../services/auth-service.js';
import { popupService } from '../utils/popup-service.js';
import trabajadoresImg from '../assets/trabajadores.jpg';
import fondoImg from '../assets/fondo.png';

export class ViewLanding extends LitElement {

  static properties = {
    tipos_servicios: { type: Array },
    empresa: { type: Object },
    membershipPlans: { type: Array },
    contactEmail: { type: String },
    contactMessage: { type: String },
    sending: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
      color: #333;
    }
    
    /* Utility & Shared */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .section-title {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 3rem;
      color: #2c3e50;
      position: relative;
    }
    .section-title::after {
      content: '';
      display: block;
      width: 60px;
      height: 4px;
      background: #e74c3c;
      margin: 15px auto 0;
    }
    section {
      padding: 80px 0;
    }
    
    /* Hero Section */
    .hero {
      background-size: cover;
      background-position: center;
      color: white;
      text-align: center;
      padding: 150px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    }
    .hero p {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      color: #eee;
    }
    .btn {
      display: inline-block;
      padding: 12px 30px;
      background: #e74c3c;
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-weight: bold;
      transition: background 0.3s, transform 0.3s;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .btn:hover {
      background: #c0392b;
      transform: translateY(-2px);
    }

    /* Services Section */
    .services {
      background: #f9f9f9;
    }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
    }
    .service-card {
      background: white;
      padding: 40px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      transition: transform 0.3s;
    }
    .service-card:hover {
      transform: translateY(-10px);
    }
    .service-icon {
      font-size: 3rem;
      color: #3498db;
      margin-bottom: 20px;
    }
    .service-title {
      font-size: 1.5rem;
      margin-bottom: 15px;
      color: #2c3e50;
    }

    /* About (Mission/Vision) */
    .about-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 50px;
      align-items: center;
    }
    .about-text h3 {
      font-size: 2rem;
      color: #34495e;
      margin-bottom: 1rem;
    }
    .about-text p {
      line-height: 1.8;
      color: #666;
      margin-bottom: 2rem;
    }

    /* Promotions */
    .promo {
      background: #3498db;
      color: white;
      text-align: center;
    }
    .promo h2 {
      color: white;
    }
    .promo-card {
      background: rgba(255,255,255,0.2);
      padding: 30px;
      border-radius: 10px;
      margin: 20px auto;
      max-width: 800px;
    }

    /* FAQ */
    .faq-item {
      border-bottom: 1px solid #eee;
      padding: 20px 0;
    }
    .faq-question {
      font-size: 1.2rem;
      font-weight: bold;
      cursor: pointer;
      color: #2c3e50;
      display: flex;
      justify-content: space-between;
    }
    .faq-answer {
      margin-top: 10px;
      color: #666;
      display: none;
    }
    .faq-item.active .faq-answer {
      display: block;
    }

    /* Contact */
    .contact {
      background: #2c3e50;
      color: white;
    }
    .contact h2 { color: white; }
    .contact-form {
      max-width: 600px;
      margin: 0 auto;
    }
    .contact-form input, .contact-form textarea {
      width: 100%;
      padding: 15px;
      margin-bottom: 20px;
      border: none;
      border-radius: 5px;
      font-family: inherit;
    }
    .contact-form button {
      width: 100%;
      border: none;
      cursor: pointer;
    }

    /* Navbar Override for Landing */
    /* Note: Since this view is inside the router outlet, the main navbar is outside. 
       We will handle navigation links inside the content for now or update the generic shell later.
    /* Memberships Section */
    .memberships {
      background: #fdfdfd;
    }
    .memberships-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-top: 20px;
    }
    .membership-card {
      background: white;
      padding: 30px;
      border-radius: 20px;
      text-align: left;
      transition: all 0.3s;
      display: flex;
      flex-direction: column;
      color: #333;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      border: 1px solid #f1f5f9;
    }
    .membership-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
    }
    .membership-header {
      padding-bottom: 20px;
      border-bottom: 1px solid #f1f5f9;
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .plan-icon-landing {
      width: 70px;
      height: 70px;
      background: #eff6ff;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
      overflow: hidden;
      border: 2px solid white;
      box-shadow: 0 8px 15px rgba(0,0,0,0.05);
      transition: transform 0.3s ease;
    }
    .membership-card:hover .plan-icon-landing {
      transform: scale(1.1) rotate(5deg);
    }
    .plan-icon-landing img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .plan-icon-landing svg {
      width: 35px;
      height: 35px;
      color: #3b82f6;
    }
    .membership-name {
      font-size: 1.6rem;
      font-weight: 800;
      color: #3b82f6;
      margin-bottom: 15px;
      margin-top: 0;
    }
    .price-container {
      display: flex;
      align-items: baseline;
      gap: 5px;
    }
    .membership-price {
      font-size: 2.2rem;
      color: #1e293b;
      font-weight: 800;
      margin: 0;
    }
    .price-symbol {
      font-size: 1.2rem;
      color: #64748b;
      font-weight: 600;
    }
    .membership-duration {
      color: #64748b;
      font-size: 0.95rem;
      font-weight: 500;
    }
    .membership-desc {
      color: #64748b;
      font-size: 1rem;
      line-height: 1.5;
      margin-bottom: 25px;
    }
    .services-title {
      font-size: 0.85rem;
      font-weight: 800;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 15px;
    }
    .services-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .service-tag {
      background: #f8fafc;
      padding: 8px 15px;
      border-radius: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.95rem;
      font-weight: 600;
      color: #1e293b;
    }
    .discount-badge {
      background: #3b82f6;
      color: white;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    
  `;

  constructor() {
    super();
    this.tipos_servicios = [];
    this.empresa = {};
    this.membershipPlans = [];
    this.contactEmail = '';
    this.contactMessage = '';
    this.sending = false;
  }

  async firstUpdated() {
    this.tipos_servicios = await tiposServiciosService.getTiposServicios();
    const empresasResult = await empresaService.getEmpresas();
    this.empresa = empresasResult[0];
    this.membershipPlans = await planesMembresiasService.getPlanes();
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    if (name === 'email') this.contactEmail = value;
    if (name === 'message') this.contactMessage = value;
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (!this.contactEmail.trim() || !this.contactMessage.trim() || this.sending) return;

    this.sending = true;
    try {
      await authService.enviarDuda({
        email: this.contactEmail,
        duda: this.contactMessage
      });

      popupService.success('Mensaje Enviado', 'Su mensaje ha sido enviado exitosamente. Nos pondremos en contacto con usted pronto.');
      this.contactEmail = '';
      this.contactMessage = '';

      // Reset form if needed
      const form = this.shadowRoot.querySelector('.contact-form');
      if (form) form.reset();

    } catch (error) {
      popupService.warning('Error', `No se pudo enviar el mensaje: ${error.message}`);
    } finally {
      this.sending = false;
    }
  }

  render() {
    return html`
      <!-- Hero -->
      <section class="hero" style="background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('${fondoImg}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
        <div class="container">
          <h1>Servicios Integrales ${this.empresa.nombre}</h1>
          <p>Expertos en Electricidad, Plomería, Construcción y más.</p>
          <a href="/register" class="btn">Regístrate Ahora</a>
        </div>
      </section>

      <!-- Services -->
      <section id="servicios" class="services">
        <div class="container">
          <h2 class="section-title">Nuestros Servicios</h2>
          <div class="services-grid">
            ${this.tipos_servicios.map(tipo_servicio => html`
              <div class="service-card">
                <div class="service-icon"><img src="http://api-multiservicios.local/storage/${tipo_servicio.imagePath}" alt="Icono" style="width: 100px; height: 100px;"></div>
                <h3 class="service-title">${tipo_servicio.nombre}</h3>
                <p>${tipo_servicio.descripcion}</p>
              </div>
            `)}
          </div>
        </div>
      </section>

      <!-- Quienes Somos -->
      <section id="nosotros">
        <div class="container">
          <h2 class="section-title">Quiénes Somos</h2>
          <div class="about-grid">
            <div class="about-text">
              <h3>Misión</h3>
              <p>Brindar soluciones integrales de mantenimiento y construcción con los más altos estándares de calidad, garantizando la satisfacción y seguridad de nuestros clientes.</p>
              <h3>Visión</h3>
              <p>Ser la empresa líder en servicios multisectoriales en la región, reconocidos por nuestra eficiencia, compromiso y profesionalismo.</p>
            </div>
            <div class="about-image">
               <img src="${trabajadoresImg}" alt="Trabajadores" style="width:100%; border-radius:10px; box-shadow:0 15px 30px rgba(0,0,0,0.1)">
            </div>
          </div>
        </div>
      </section>

      <!-- Promociones y Membresías -->
      <section class="promo">
        <div class="container">
          <h2 class="section-title" style="color:white; margin-bottom:1rem">Planes de Membresías Activos</h2>
          <p class="section-title::after" style="background:white"></p>

          <!-- Cards de Membresías Blancas dentro de la sección azul -->
          ${this.membershipPlans && this.membershipPlans.length > 0 ? html`
            <div class="memberships-grid">
              ${this.membershipPlans.map(plan => html`
                <div class="membership-card">
                  <div class="membership-header">
                    <div class="plan-icon-landing">
                      ${plan.imagePath ? html`
                        <img src="http://api-multiservicios.local/storage/${plan.imagePath}" alt="${plan.nombre}">
                      ` : html`
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      `}
                    </div>
                    <h3 class="membership-name">${plan.nombre}</h3>
                    <div class="price-container">
                      <span class="price-symbol">Bs.</span>
                      <span class="membership-price">${Number(plan.precio).toFixed(2)}</span>
                      <span class="membership-duration">/ ${plan.duracion_meses} ${plan.duracion_meses === 1 ? 'mes' : 'meses'}</span>
                    </div>
                  </div>

                  <p class="membership-desc">${plan.descripcion}</p>

                  <div class="services-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Servicios Incluidos
                  </div>

                  <div class="services-list">
                    ${(plan.array_tipos_servicios || []).map(ts => html`
                      <div class="service-tag">
                        <span>${ts.nombre_tipo_servicio}</span>
                        <span class="discount-badge">${Number(ts.porcentaje_descuento).toFixed(2)}% desc.</span>
                      </div>
                    `)}
                  </div>
                </div>
              `)}
            </div>
          ` : ''}
        </div>
      </section>

      <!-- FAQ -->
      <section id="faq">
        <div class="container">
          <h2 class="section-title">Preguntas Frecuentes</h2>
          <div class="faq-item" @click=${this.toggleFaq}>
            <div class="faq-question">¿Tienen garantía los trabajos? <span>+</span></div>
            <div class="faq-answer">Sí, todos nuestros trabajos cuentan con 30 días de garantía por mano de obra.</div>
          </div>
          <div class="faq-item" @click=${this.toggleFaq}>
            <div class="faq-question">¿Cuál es el tiempo de respuesta? <span>+</span></div>
            <div class="faq-answer">Atendemos urgencias en menos de 2 horas. Para proyectos, agendamos visitas en 24h.</div>
          </div>
          <div class="faq-item" @click=${this.toggleFaq}>
            <div class="faq-question">¿Facturan sus servicios? <span>+</span></div>
            <div class="faq-answer">Sí, emitimos factura fiscal para todos nuestros servicios.</div>
          </div>
        </div>
      </section>

      <!-- Contacto -->
      <section id="contacto" class="contact">
        <div class="container">
          <h2 class="section-title">Contáctanos</h2>
          <form class="contact-form" @submit=${this.handleSubmit}>
            <input 
              type="email" 
              name="email"
              placeholder="Correo electrónico" 
              .value=${this.contactEmail}
              @input=${this.handleInputChange}
              required
            >
            <textarea 
              name="message"
              rows="5" 
              placeholder="¿En qué podemos ayudarte?" 
              .value=${this.contactMessage}
              @input=${this.handleInputChange}
              required
            ></textarea>
            <button type="submit" class="btn" ?disabled=${this.sending}>
              ${this.sending ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </section>
    `;
  }

  toggleFaq(e) {
    const item = e.currentTarget;
    item.classList.toggle('active');
  }
}

customElements.define('view-landing', ViewLanding);
