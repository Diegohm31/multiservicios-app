import { LitElement, html, css } from 'lit';
import { tiposServiciosService } from '../services/tipos-servicios-service';
import trabajadoresImg from '../assets/trabajadores.jpg';
import fondoImg from '../assets/fondo.png';

export class ViewLanding extends LitElement {

  static properties = {
    tipos_servicios: { type: Array }
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
    */
  `;

  constructor() {
    super();
    this.tipos_servicios = [];
  }

  async firstUpdated() {
    this.tipos_servicios = await tiposServiciosService.getTiposServicios();
  }

  render() {
    return html`
      <!-- Hero -->
      <section class="hero" style="background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('${fondoImg}'); background-size: cover; background-position: center; background-repeat: no-repeat;">
        <div class="container">
          <h1>Servicios Integrales Multi-Hogar</h1>
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

      <!-- Promociones -->
      <section class="promo">
        <div class="container">
          <h2 class="section-title" style="color:white; margin-bottom:1rem">Promociones del Mes</h2>
          <p class="section-title::after" style="background:white"></p>
          <div class="promo-card">
             <h3>¡20% de Descuento en tu primer servicio!</h3>
             <p>Regístrate hoy y obtén un descuento especial en cualquier servicio de mantenimiento general.</p>
             <br>
             <a href="/register" class="btn" style="background:white; color:#3498db">Aprovechar Oferta</a>
          </div>
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
          <form class="contact-form" @submit=${(e) => e.preventDefault()}>
            <input type="text" placeholder="Nombre completo" required>
            <input type="email" placeholder="Correo electrónico" required>
            <textarea rows="5" placeholder="¿En qué podemos ayudarte?" required></textarea>
            <button type="submit" class="btn">Enviar Mensaje</button>
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
