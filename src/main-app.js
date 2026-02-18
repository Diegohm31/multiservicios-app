import { LitElement, html, css } from 'lit';
import { Router } from '@lit-labs/router';
import './views/view-landing.js';
import './views/view-auth-login.js';
import './views/view-auth-register.js';
import './views/view-auth-olvide-password.js';
import './views/view-auth-new-password.js';
import './views/view-categoria.js';
import './views/view-especialidades-listado.js';
import './views/view-especialidad-form.js';
import './views/view-operativos-listado.js';
import './views/view-operativo-form.js';
import './views/view-inventario-tipo-equipo-listado.js';
import './views/view-inventario-tipo-equipo-form.js';
import './views/view-inventario-equipo-listado.js';
import './views/view-inventario-equipo-form.js';
import './views/view-inventario-material-listado.js';
import './views/view-inventario-material-form.js';
import './views/view-inventario-movimiento-listado.js';
import './views/view-inventario-movimiento-form.js';
import './views/view-servicios-tipo-servicio-listado.js';
import './views/view-servicios-tipo-servicio-form.js';
import './views/view-servicios-servicio-listado.js';
import './views/view-servicios-servicio-form.js';
import './views/view-catalogo-servicios.js';
import './views/view-servicios-orden-listado.js';
import './views/view-servicios-orden-detalles.js';
import './views/view-servicios-orden-presupuesto.js';
import './views/view-servicios-orden-pago.js';
import './views/view-reportes-pagos-listado.js';
import './views/view-reportes-pagos-detalles.js';
import './views/view-servicios-orden-asignar-personal.js';
import './views/view-servicios-orden-avances.js';

import { authService } from './services/auth-service.js';
import { navigator } from './utils/navigator.js';


export class MainApp extends LitElement {

  static properties = {
    opciones_aside_bar: { type: Array },
    isMenuOpen: { type: Boolean },
    currentPath: { type: String },
    user: { type: Object },
    activeCategoryId: { type: String }
  };

  constructor() {
    super();

    this.opciones_aside_bar = [];
    this.isMenuOpen = false;
    this.currentPath = window.location.pathname;
    this.user = {};
    this.activeCategoryId = localStorage.getItem('activeCategoryId');
  }

  router = new Router(this, [
    {
      path: '/',
      enter: async () => {
        if (authService.isLoggedIn()) {
          navigator.goto('/categoria/00007'); // Redirige a la vista inicial (dashboard)
          return false; // Evita que se renderice la vista landing
        }
        return true; // Permite que se renderice la vista landing
      },
      render: () => html`<view-landing></view-landing>`
    },
    {
      path: '/login',
      enter: async () => {
        if (authService.isLoggedIn()) {
          navigator.goto('/categoria/00007');
          return false;
        }
        return true;
      },
      render: () => html`<view-auth-login></view-auth-login>`
    },
    {
      path: '/register',
      enter: async () => {
        if (authService.isLoggedIn()) {
          navigator.goto('/categoria/00007');
          return false;
        }
        return true;
      },
      render: () => html`<view-auth-register></view-auth-register>`
    },
    {
      path: '/olvide_password',
      enter: async () => {
        if (authService.isLoggedIn()) {
          navigator.goto('/categoria/00007');
          return false;
        }
        return true;
      },
      render: () => html`<view-auth-olvide-password></view-auth-olvide-password>`
    },
    {
      path: '/new_password/:email',
      enter: async () => {
        if (authService.isLoggedIn()) {
          navigator.goto('/categoria/00007');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-auth-new-password .email=${params.email}></view-auth-new-password>`
    },
    {
      path: '/categoria/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-categoria .id_padre=${params.id}></view-categoria>`
    },
    {
      path: '/operativos/listado',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-operativos-listado></view-operativos-listado>`
    },
    {
      path: '/operativos/register',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-operativo-form></view-operativo-form>`
    },
    {
      path: '/especialidades/listado',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-especialidades-listado></view-especialidades-listado>`
    },
    {
      path: '/especialidades/register',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-especialidad-form></view-especialidad-form>`
    },
    {
      path: '/especialidades/edit/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-especialidad-form .especialidadId=${params.id}></view-especialidad-form>`
    },
    {
      path: '/operativos/edit/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-operativo-form .operativoId=${params.id}></view-operativo-form>`
    },
    {
      path: '/inventario/listado/tipo_equipo',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-inventario-tipo-equipo-listado></view-inventario-tipo-equipo-listado>`
    },
    {
      path: '/inventario/register/tipo_equipo',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-inventario-tipo-equipo-form></view-inventario-tipo-equipo-form>`
    },
    {
      path: '/inventario/edit/tipo_equipo/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-inventario-tipo-equipo-form .tipo_equipoId=${params.id}></view-inventario-tipo-equipo-form>`
    },
    {
      path: '/inventario/listado/equipo',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-inventario-equipo-listado></view-inventario-equipo-listado>`
    },
    {
      path: '/inventario/register/equipo',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-inventario-equipo-form></view-inventario-equipo-form>`
    },
    {
      path: '/inventario/edit/equipo/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-inventario-equipo-form .equipoId=${params.id}></view-inventario-equipo-form>`
    },
    {
      path: '/inventario/listado/material',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-inventario-material-listado></view-inventario-material-listado>`
    },
    {
      path: '/inventario/register/material',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-inventario-material-form></view-inventario-material-form>`
    },
    {
      path: '/inventario/edit/material/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-inventario-material-form .materialId=${params.id}></view-inventario-material-form>`
    },
    {
      path: '/inventario/listado/movimiento',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-inventario-movimiento-listado></view-inventario-movimiento-listado>`
    },
    {
      path: '/inventario/register/movimiento',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-inventario-movimiento-form></view-inventario-movimiento-form>`
    },
    {
      path: '/servicios/listado/tipo_servicio',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-servicios-tipo-servicio-listado></view-servicios-tipo-servicio-listado>`
    },
    {
      path: '/servicios/register/tipo_servicio',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-servicios-tipo-servicio-form></view-servicios-tipo-servicio-form>`
    },
    {
      path: '/servicios/edit/tipo_servicio/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-servicios-tipo-servicio-form .tipo_servicioId=${params.id}></view-servicios-tipo-servicio-form>`
    },
    {
      path: '/servicios/listado/servicio',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-servicios-servicio-listado></view-servicios-servicio-listado>`
    },
    {
      path: '/servicios/register/servicio',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-servicios-servicio-form></view-servicios-servicio-form>`
    },
    {
      path: '/servicios/edit/servicio/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-servicios-servicio-form .servicioId=${params.id}></view-servicios-servicio-form>`
    },
    {
      path: '/servicios/catalogo',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-catalogo-servicios></view-catalogo-servicios>`
    },
    {
      path: '/servicios/listado/orden',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-servicios-orden-listado></view-servicios-orden-listado>`
    },
    {
      path: '/servicios/orden/detalles/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-servicios-orden-detalles .ordenId=${params.id}></view-servicios-orden-detalles>`
    },
    {
      path: '/servicios/orden/presupuesto/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-servicios-orden-presupuesto .ordenId=${params.id}></view-servicios-orden-presupuesto>`
    },
    {
      path: '/servicios/orden/pago/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-servicios-orden-pago .ordenId=${params.id}></view-servicios-orden-pago>`
    },
    {
      path: '/servicios/orden/asignar-personal/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-servicios-orden-asignar-personal .ordenId=${params.id}></view-servicios-orden-asignar-personal>`
    },

    {
      path: '/reportesPagos/listado',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: () => html`<view-reportes-pagos-listado></view-reportes-pagos-listado>`
    },
    {
      path: '/reportes-pagos/detalles/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-reportes-pagos-detalles .reporteId=${params.id}></view-reportes-pagos-detalles>`
    },
    {
      path: '/servicios/orden/avances/:id',
      enter: async () => {
        if (!authService.isLoggedIn()) {
          navigator.goto('/login');
          return false;
        }
        return true;
      },
      render: (params) => html`<view-servicios-orden-avances .ordenId=${params.id}></view-servicios-orden-avances>`
    },
    // {
    //   path: '/products/create',
    //   enter: async () => {
    //     if (!authService.isLoggedIn()) {
    //       navigator.goto('/login');
    //       return false;
    //     }
    //     return true;
    //   },
    //   render: () => html`<view-product-form></view-product-form>`
    // },
    // {
    //   path: '/products/edit/:id',
    //   enter: async () => {
    //     if (!authService.isLoggedIn()) {
    //       navigator.goto('/login');
    //       return false;
    //     }
    //     return true;
    //   },
    //   render: (params) => html`<view-product-form .productId=${params.id}></view-product-form>`
    // },
    // {
    //   path: '/clients',
    //   enter: async () => {
    //     if (!authService.isLoggedIn()) {
    //       navigator.goto('/login');
    //       return false;
    //     }
    //     return true;
    //   },
    //   render: () => html`<view-clients></view-clients>`
    // },
    // {
    //   path: '/services',
    //   enter: async () => {
    //     if (!authService.isLoggedIn()) {
    //       navigator.goto('/login');
    //       return false;
    //     }
    //     return true;
    //   },
    //   render: () => html`<view-services></view-services>`
    // }
  ]);

  connectedCallback() {
    super.connectedCallback();

    // this.opciones_aside_bar = [
    //   { path: '/products', label: 'Productos' },
    //   { path: '/clients', label: 'Clientes' },
    //   { path: '/services', label: 'Servicios' }
    // ];  

    if (authService.isLoggedIn()) {
      this.loadMenu();
    }

    this.updateActiveCategory();

    window.addEventListener('popstate', () => {
      this.currentPath = window.location.pathname;
      this.updateActiveCategory();
    });

  }

  updateActiveCategory() {
    const match = window.location.pathname.match(/\/categoria\/(\w+)/);
    if (match) {
      this.activeCategoryId = match[1];
      localStorage.setItem('activeCategoryId', this.activeCategoryId);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  async loadMenu() {
    this.opciones_aside_bar = await authService.getMenu();
    const user = await authService.getUser();
    if (user) {
      this.user = user;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  async handleLogout() {
    await authService.logout();
    this.isMenuOpen = false; // Reset menu on logout
    this.opciones_aside_bar = [];
    this.user = {};
    this.activeCategoryId = null;
    localStorage.removeItem('activeCategoryId');
    navigator.goto('/');
  }

  async scrollTo(e, id) {
    e.preventDefault();

    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
      await new Promise(r => setTimeout(r, 100)); // Wait for router
    }

    if (!id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const landing = this.shadowRoot.querySelector('view-landing');
    if (landing) {
      const el = landing.shadowRoot ? landing.shadowRoot.getElementById(id) : null;
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  isCurrent(path) {
    if (this.currentPath === path) return true;
    if (path !== '/' && this.currentPath.startsWith(path)) return true;
    return false;
  }

  isCategoryActive(id) {
    return this.activeCategoryId === id;
  }



  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #333;
      width: 100%;
    }

    /* Layout Structure */
    .app-header {
      background-color: #343a40;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .app-body {
      display: flex;
      flex: 1;
      position: relative;
    }

    /* Sidebar */
    .app-sidebar {
      width: 250px;
      background-color: #f8f9fa;
      border-right: 1px solid #dee2e6;
      display: flex;
      flex-direction: column;
      padding: 20px 0;
      flex-shrink: 0;
    }

    /* Main Content */
    .app-main {
      flex: 1;
      padding: 2rem;
      background-color: #fff;
      overflow-x: hidden;
    }

    /* Unauthenticated Layout override */
    .app-body.public {
      display: block;
    }
    .app-body.public .app-main {
      padding: 0;
    }

    /* Components styles */
    .brand {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
    }

    .nav-link {
      color: #adb5bd;
      text-decoration: none;
      margin-left: 20px;
      transition: color 0.3s;
    }
    .nav-link:hover { color: white; }

    .btn-login {
      background: rgba(255,255,255,0.1); 
      padding: 5px 15px; 
      border-radius: 20px; 
      color: #3498db;
      font-weight: bold;
    }

    /* Sidebar Links */
    .sidebar-link {
      display: block;
      padding: 12px 20px;
      color: #333;
      text-decoration: none;
      border-left: 4px solid transparent;
      transition: all 0.2s;
    }
    .sidebar-link:hover {
      background-color: #e9ecef;
      color: #007bff;
    }
    .sidebar-link.active {
      background-color: #e2e6ea;
      color: #007bff;
      border-left-color: #007bff;
    }

    .btn-logout-header {
      padding: 5px 15px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      margin-left: 10px;
    }
    .btn-logout-header:hover { background: #c82333; }


    /* Footer */
    .app-footer {
      background-color: #343a40;
      color: #adb5bd;
      text-align: center;
      padding: 20px;
      font-size: 0.9rem;
    }
    .app-footer a { color: #fff; text-decoration: none; }

    /* Responsive Styles */
    .menu-toggle {
      display: none;
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding-right: 15px;
    }

    /* Mobile Nav Container (Public) */
    .mobile-nav-public {
      display: none;
      flex-direction: column;
      background-color: #343a40;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 999;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .mobile-nav-public a {
      color: white;
      text-decoration: none;
      padding: 15px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: block;
    }
    .mobile-nav-public a:hover {
      background-color: rgba(255,255,255,0.1);
    }

    @media (max-width: 768px) {
      .menu-toggle {
        display: block;
      }
      
      /* Hide standard nav links on mobile in header */
      .app-header nav .nav-link {
        display: none;
      }
      
      .mobile-nav-public.open {
        display: flex;
      }

      /* Sidebar behavior on mobile (Private) */
      .app-sidebar {
        position: fixed;
        top: 60px; /* Height of header approx */
        left: 0;
        bottom: 0;
        width: 250px;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
        z-index: 1001;
        box-shadow: 2px 0 5px rgba(0,0,0,0.2);
      }
      
      .app-sidebar.open {
        transform: translateX(0);
      }
      
      /* Adjust main content when sidebar is overlay */
      .app-body.private .app-main {
        padding: 1rem;
      }
    }
  `;
  render() {
    const loggedIn = authService.isLoggedIn();

    // Check if current route is public
    const publicRoutes = ['/', '/login', '/register'];
    const isPublicView = publicRoutes.includes(this.currentPath);

    // PrivateLayout: Sidebar visible ONLY if logged in AND NOT on a public page
    const showPrivateLayout = loggedIn && !isPublicView;

    return html`
      <header class="app-header">
        <div style="display:flex; align-items:center">
           <button class="menu-toggle" @click=${this.toggleMenu}>☰</button>
           <img src="/logo_msv.png" alt="Logo" style="width: 50px; height: 50px; margin-right: 10px">
           <a href="/" class="brand" @click=${(e) => this.scrollTo(e, null)}>MultiServicios Villarroel</a>
        </div>
        
        <nav>
           ${!loggedIn ? html`
              <!-- Public Nav Desktop -->
              <a href="/" class="nav-link" @click=${(e) => this.scrollTo(e, null)}>Inicio</a>
              <a href="/#servicios" class="nav-link" @click=${(e) => this.scrollTo(e, 'servicios')}>Servicios</a>
              <a href="/#nosotros" class="nav-link" @click=${(e) => this.scrollTo(e, 'nosotros')}>Nosotros</a>
              <a href="/#faq" class="nav-link" @click=${(e) => this.scrollTo(e, 'faq')}>FAQs</a>
              <a href="/#contacto" class="nav-link" @click=${(e) => this.scrollTo(e, 'contacto')}>Contacto</a>
              <a href="/login" class="nav-link btn-login" @click=${(e) => { e.preventDefault(); navigator.goto('/login'); }}>Acceso Clientes</a>

              <!-- Mobile Nav Public Dropdown -->
              <div class="mobile-nav-public ${this.isMenuOpen ? 'open' : ''}">
                <a href="/" @click=${(e) => { this.scrollTo(e, null); this.toggleMenu(); }}>Inicio</a>
                <a href="/#servicios" @click=${(e) => { this.scrollTo(e, 'servicios'); this.toggleMenu(); }}>Servicios</a>
                <a href="/#nosotros" @click=${(e) => { this.scrollTo(e, 'nosotros'); this.toggleMenu(); }}>Nosotros</a>
                <a href="/#faq" @click=${(e) => { this.scrollTo(e, 'faq'); this.toggleMenu(); }}>FAQs</a>
                <a href="/#contacto" @click=${(e) => { this.scrollTo(e, 'contacto'); this.toggleMenu(); }}>Contacto</a>
                <a href="/login" @click=${(e) => { e.preventDefault(); navigator.goto('/login'); this.toggleMenu(); }}>Acceso Clientes</a>
              </div>

           ` : html`
              <!-- Logged In Nav -->
              <span style="color:white; margin-right:15px; font-size: 0.9rem;">Bienvenido, ${this.user.name}</span>
              <button class="btn-logout-header" @click=${this.handleLogout}> salir</button>
           `}
        </nav>
      </header>

      <!-- Main Body Wrapper -->
      <div class="app-body ${showPrivateLayout ? 'private' : 'public'}" @user-logged-in=${this.loadMenu}>
        
        <!-- Sidebar (Only if logged in AND NOT public view) -->

         <!-- <aside class="app-sidebar">
            <a href="/products" class="sidebar-link ${this.isCurrent('/products') ? 'active' : ''}">Productos</a>
            <a href="/clients" class="sidebar-link ${this.isCurrent('/clients') ? 'active' : ''}">Clientes</a>
            <a href="/services" class="sidebar-link ${this.isCurrent('/services') ? 'active' : ''}">Servicios</a>
          </aside> -->

        <!-- mostrar en la sidebar solo aquellas opciones que sean es_categoria = true -->
        
        ${showPrivateLayout ? html`
          <aside class="app-sidebar ${this.isMenuOpen ? 'open' : ''}">
            ${this.opciones_aside_bar.map(opcion => html`
                <a href="#" class="sidebar-link ${this.isCategoryActive(opcion.id_opcion) ? 'active' : ''}" @click=${(e) => { e.preventDefault(); this.isMenuOpen = false; navigator.goto(`/categoria/${opcion.id_opcion}`); }}>${opcion.nombre}</a>
            `)}
          </aside>
        ` : ''}


        <!-- Router Outlet -->
        <main class="app-main">
          ${this.router.outlet()}
        </main>

      </div>

      <!-- Footer Global -->
      <footer class="app-footer">
        <p>&copy; 2026 MultiServicios S.A. Todos los derechos reservados.</p>
        <p>
          <a href="#">Política de Privacidad</a> | 
          <a href="#">Términos de Uso</a> |
          <a href="#">Soporte</a>
        </p>
      </footer>
    `;
  }
}

customElements.define('main-app', MainApp);
