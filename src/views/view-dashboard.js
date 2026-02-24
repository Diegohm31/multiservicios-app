import { LitElement, html, css } from 'lit';
import { navigator } from '../utils/navigator.js';
import { authService } from '../services/auth-service.js';
import { serviciosService } from '../services/servicios-service.js';
import { usuariosService } from '../services/usuarios-service.js';
import Chart from 'chart.js/auto';

export class ViewDashboard extends LitElement {
  static properties = {
    user: { type: Object },
    metrics: { type: Object },
    recentOrders: { type: Array },
    shortcuts: { type: Array },
    loading: { type: Boolean }
  };

  static styles = css`
    :host {
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --text: #1e293b;
      --text-light: #64748b;
      --bg: #fff;
      --card-bg: #ffffff;
      --radius: 20px;
      --shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      
      display: block;
      padding: 2rem;
      min-height: 100vh;
      background-color: var(--bg);
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--text);
    }

    .welcome-section {
      margin-bottom: 2rem;
      animation: fadeInDown 0.6s ease-out;
    }

    .welcome-section h1 {
      font-size: 2.25rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
    }

    .welcome-section p {
      color: var(--text-light);
      margin: 0.25rem 0 0;
      font-size: 1rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2.5rem;
      animation: fadeInUp 0.7s ease-out;
    }

    .stat-card {
      background: var(--card-bg);
      padding: 1.5rem;
      border-radius: var(--radius);
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .stat-info .label {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-info .value {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text);
      display: block;
    }

    /* Analysis Section (Charts) */
    .analysis-section {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
      animation: fadeInUp 0.75s ease-out;
    }

    .chart-card {
      background: var(--card-bg);
      padding: 1.5rem;
      border-radius: var(--radius);
      border: 1px solid #e2e8f0;
      box-shadow: var(--shadow);
      min-height: 420px;
      display: flex;
      flex-direction: column;
    }

    .chart-container {
      flex: 1;
      position: relative;
      width: 100%;
      min-height: 280px;
    }

    .chart-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid #f1f5f9;
    }

    .chart-stat-item {
        text-align: center;
    }

    .chart-stat-label {
        font-size: 0.65rem;
        font-weight: 700;
        color: var(--text-light);
        text-transform: uppercase;
        margin-bottom: 0.25rem;
        display: block;
    }

    .chart-stat-value {
        font-size: 0.95rem;
        font-weight: 800;
        color: var(--text);
    }

    .chart-stat-sub {
        font-size: 0.7rem;
        color: var(--text-light);
        display: block;
    }

    /* Main Content Layout */
    .dashboard-layout {
      display: grid;
      grid-template-columns: 1.8fr 1fr;
      gap: 1.5rem;
      animation: fadeInUp 0.8s ease-out;
    }

    .content-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      border: 1px solid #e2e8f0;
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .card-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h2 {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0;
    }

    /* Improved Ver Todo Button */
    .btn-view-all {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: #f1f5f9;
        color: var(--text);
        border: none;
        border-radius: 10px;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-view-all:hover {
        background: var(--primary);
        color: white;
        transform: scale(1.05);
    }

    /* Table Styles */
    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      padding: 0.85rem 1.5rem;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--text-light);
      background: #f8fafc;
    }

    td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      font-size: 0.85rem;
    }

    .status-pill {
      padding: 0.25rem 0.75rem;
      border-radius: 8px;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    /* Status Colors from view-servicios-orden-listado.js */
    .status-pendiente { background: #fef3c7; color: #92400e; }
    .status-aceptada { background: #dcfce7; color: #166534; }
    .status-presupuestada { background: #f3e8ff; color: #6b21a8; }
    .status-en-ejecucion, .status-en_ejecucion { background: #e0f2fe; color: #075985; }
    .status-completada { background: #dcfce7; color: #15803d; }
    .status-cancelada { background: #fee2e2; color: #991b1b; }
    .status-en_espera { background: #e0f2fe; color: #075985; }
    .status-por-pagar { background: #ffedd5; color: #c2410c; }
    .status-verificando_pago { background: #e0e7ff; color: #3730a3; }
    .status-asignando_personal { background: #dcfce7; color: #166534; }

    /* Shortcuts */
    .shortcuts-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.5rem;
    }

    .shortcut-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem;
      border-radius: 12px;
      border: 1px solid #f1f5f9;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      color: var(--text);
    }

    .shortcut-item:hover {
      background: #f8fbff;
      border-color: var(--primary);
      transform: translateX(5px);
    }

    .shortcut-icon {
      width: 36px;
      height: 36px;
      background: #eff6ff;
      color: var(--primary);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .shortcut-info span {
      font-weight: 600;
      font-size: 0.9rem;
    }

    /* Loader */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 0;
      gap: 1rem;
    }

    .loader {
      width: 40px;
      height: 40px;
      border: 4px solid #f1f5f9;
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 1024px) {
      .dashboard-layout, .analysis-section { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      :host { padding: 1rem; }
      .welcome-section h1 { font-size: 1.75rem; }
      .stats-grid { grid-template-columns: 1fr; }
    }
  `;

  constructor() {
    super();
    this.user = null;
    this.metrics = {
      total: 0,
      active: 0,
      completed: 0,
      extra: 0,
      clients: 0
    };
    this.recentOrders = [];
    this.shortcuts = [];
    this.loading = true;
    this.chartInstances = {};
    this.barStats = { mean: 0, max: { val: 0, label: '' }, min: { val: 0, label: '' } };
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.init();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    Object.values(this.chartInstances).forEach(chart => chart.destroy());
  }

  async init() {
    this.loading = true;
    try {
      this.user = await authService.getUser();
      const [ordenesData, clientsData] = await Promise.all([
        serviciosService.getOrdenes(),
        this.user?.id_rol === '00003' ? usuariosService.getClientes() : Promise.resolve([])
      ]);

      const allOrders = ordenesData?.ordenes || [];
      this.recentOrders = [...allOrders].sort((a, b) => b.id_orden - a.id_orden).slice(0, 5);

      this.calculateMetrics(allOrders, clientsData);
      this.loadShortcuts();

      this.loading = false;
      await this.updateComplete;
      this.initCharts(allOrders);
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      this.loading = false;
    }
  }

  calculateMetrics(orders, clients) {
    const roleId = String(this.user?.id_rol);

    if (roleId === '00003') {
      this.metrics = {
        total: orders.length,
        active: orders.filter(o => !['Completada', 'Cancelada'].includes(o.estado)).length,
        completed: orders.filter(o => o.estado === 'Completada').length,
        extra: orders.filter(o => o.estado === 'Verificando pago').length,
        clients: Array.isArray(clients) ? clients.length : 0
      };
    } else if (roleId === '00002') {
      this.metrics = {
        total: orders.length,
        active: orders.filter(o => o.estado === 'En ejecucion').length,
        completed: orders.filter(o => o.estado === 'Completada').length,
        extra: orders.filter(o => o.estado === 'En espera').length
      };
    } else {
      this.metrics = {
        total: orders.length,
        active: orders.filter(o => !['Completada', 'Cancelada'].includes(o.estado)).length,
        completed: orders.filter(o => o.estado === 'Completada').length,
        extra: orders.filter(o => o.estado === 'Por pagar').length
      };
    }
  }

  loadShortcuts() {
    const roleId = String(this.user?.id_rol);
    if (roleId === '00003') {
      this.shortcuts = [
        { label: 'Gestionar Órdenes', route: '/servicios/listado/orden', color: '#eff6ff' },
        { label: 'Validar Pagos', route: '/reportesPagos/listado', color: '#f0fdf4' },
        { label: 'Control Inventario', route: '/categoria/00008', color: '#fff7ed' },
        { label: 'Personal Operativo', route: '/operativos/listado', color: '#faf5ff' }
      ];
    } else if (roleId === '00002') {
      this.shortcuts = [
        { label: 'Mis Asignaciones', route: '/servicios/listado/orden', color: '#eff6ff' }
      ];
    } else {
      this.shortcuts = [
        { label: 'Nueva Orden', route: '/servicios/catalogo', color: '#f0fdf4' },
        { label: 'Mis Órdenes', route: '/servicios/listado/orden', color: '#eff6ff' },
        { label: 'Membresías', route: '/membresias/planes/listado', color: '#faf5ff' },
        //{ label: 'Mis Pagos', route: '/reportesPagos/listado', color: '#fff7ed' }
      ];
    }
  }

  initCharts(orders) {
    if (!orders || orders.length === 0) return;

    Object.values(this.chartInstances).forEach(chart => chart.destroy());

    // --- Status Mapping for Colors ---
    // Using more vibrant colors for the chart segments to avoid the "washed out" look
    const statusConfig = {
      'Pendiente': { chart: '#f59e0b', bg: '#fef3c7', border: '#92400e' },
      'Aceptada': { chart: '#10b981', bg: '#dcfce7', border: '#166534' },
      'Presupuestada': { chart: '#a855f7', bg: '#f3e8ff', border: '#6b21a8' },
      'En ejecucion': { chart: '#0284c7', bg: '#e0f2fe', border: '#075985' },
      'Completada': { chart: '#22c55e', bg: '#dcfce7', border: '#15803d' },
      'Cancelada': { chart: '#ef4444', bg: '#fee2e2', border: '#991b1b' },
      'En espera': { chart: '#0ea5e9', bg: '#e0f2fe', border: '#075985' },
      'Por pagar': { chart: '#f97316', bg: '#ffedd5', border: '#c2410c' },
      'Verificando pago': { chart: '#6366f1', bg: '#e0e7ff', border: '#3730a3' },
      'Asignando personal': { chart: '#14b8a6', bg: '#dcfce7', border: '#166534' },
      'Default': { chart: '#94a3b8', bg: '#f1f5f9', border: '#475569' }
    };

    // --- Chart 1: Estado de Órdenes (Doughnut) ---
    const statusCounts = orders.reduce((acc, o) => {
      acc[o.estado] = (acc[o.estado] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    const backgroundColors = labels.map(l => statusConfig[l]?.chart || statusConfig['Default'].chart);

    const pieCtx = this.shadowRoot.getElementById('statusChart').getContext('2d');
    this.chartInstances.status = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          hoverOffset: 15,
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: { size: 10, weight: '700' }
            }
          }
        },
        cutout: '72%'
      }
    });

    // --- Chart 2: Volumen Mensual (Bar) ---
    const monthlyData = orders.reduce((acc, o) => {
      const date = new Date(o.fecha_emision);
      const monthLabel = date.toLocaleString('es-ES', { month: 'short' }).toUpperCase();
      acc[monthLabel] = (acc[monthLabel] || 0) + 1;
      return acc;
    }, {});

    const barLabels = Object.keys(monthlyData);
    const barValues = Object.values(monthlyData);

    // Stats calculation
    const sum = barValues.reduce((a, b) => a + b, 0);
    const mean = (sum / barValues.length).toFixed(1);
    const maxVal = Math.max(...barValues);
    const minVal = Math.min(...barValues);
    const maxLabel = barLabels[barValues.indexOf(maxVal)];
    const minLabel = barLabels[barValues.indexOf(minVal)];

    this.barStats = {
      mean,
      max: { val: maxVal, label: maxLabel },
      min: { val: minVal, label: minLabel }
    };
    this.requestUpdate();

    const barCtx = this.shadowRoot.getElementById('volumeChart').getContext('2d');
    this.chartInstances.volume = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [{
          label: 'Órdenes',
          data: barValues,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderRadius: 6,
          hoverBackgroundColor: '#3b82f6',
          barThickness: 25
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { stepSize: 1, font: { size: 10, weight: '600' } }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 10, weight: '700' } }
          }
        }
      }
    });
  }

  getStatusClass(status) {
    const s = status?.toLowerCase().replace(/\s+/g, '_') || '';
    // Special case for 'en_ejecucion' vs 'en-ejecucion'
    const normalizedStatus = s === 'en_ejecución' ? 'en_ejecucion' : s;
    return `status-${normalizedStatus.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
  }

  render() {
    if (this.loading) {
      return html`
                <div class="loading-container">
                    <div class="loader"></div>
                    <p>Preparando tu dashboard personalizado...</p>
                </div>
            `;
    }

    const roleName = this.user?.id_rol === '00003' ? 'Administrador' : (this.user?.id_rol === '00002' ? 'Operativo' : 'Cliente');

    return html`
            <div class="welcome-section">
                <p>Resumen de Actividad • ${roleName}</p>
                <h1>¡Hola, ${this.user?.name.split(' ')[0]}! 👋</h1>
                <p>Esto es lo que está pasando en la plataforma.</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon" style="background: #eff6ff; color: #3b82f6;">📦</div>
                    <div class="stat-info">
                        <span class="label">Total Órdenes</span>
                        <span class="value">${this.metrics.total}</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #fff7ed; color: #f59e0b;">⚡</div>
                    <div class="stat-info">
                        <span class="label">En Proceso</span>
                        <span class="value">${this.metrics.active}</span>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #f0fdf4; color: #10b981;">✅</div>
                    <div class="stat-info">
                        <span class="label">Completadas</span>
                        <span class="value">${this.metrics.completed}</span>
                    </div>
                </div>
                
                ${this.user?.id_rol === '00003' ? html`
                <div class="stat-card">
                    <div class="stat-icon" style="background: #f5f3ff; color: #8b5cf6;">👥</div>
                    <div class="stat-info">
                        <span class="label">Clientes</span>
                        <span class="value">${this.metrics.clients}</span>
                    </div>
                </div>
                ` : ''}

                <div class="stat-card">
                    <div class="stat-icon" style="background: #fdf2f2; color: #ef4444;">✨</div>
                    <div class="stat-info">
                        <span class="label">
                            ${this.user?.id_rol === '00003' ? 'Pagos por Validar' : (this.user?.id_rol === '00002' ? 'En Espera' : 'Pagos Pendientes')}
                        </span>
                        <span class="value">${this.metrics.extra}</span>
                    </div>
                </div>
            </div>

            <div class="analysis-section">
                <div class="chart-card">
                    <div class="card-header" style="border:none; padding: 0 0 1rem 0;">
                        <h2>Tendencia de Órdenes Mensual</h2>
                    </div>
                    <div class="chart-container">
                        <canvas id="volumeChart"></canvas>
                    </div>
                    <div class="chart-stats">
                        <div class="chart-stat-item">
                            <span class="chart-stat-label">Media Mensual</span>
                            <span class="chart-stat-value">${this.barStats.mean}</span>
                        </div>
                        <div class="chart-stat-item">
                            <span class="chart-stat-label">Valor Máximo</span>
                            <span class="chart-stat-value">${this.barStats.max.val}</span>
                            <span class="chart-stat-sub">${this.barStats.max.label}</span>
                        </div>
                        <div class="chart-stat-item">
                            <span class="chart-stat-label">Valor Mínimo</span>
                            <span class="chart-stat-value">${this.barStats.min.val}</span>
                            <span class="chart-stat-sub">${this.barStats.min.label}</span>
                        </div>
                    </div>
                </div>
                <div class="chart-card">
                    <div class="card-header" style="border:none; padding: 0 0 1rem 0;">
                        <h2>Estado de Órdenes</h2>
                    </div>
                    <div class="chart-container">
                        <canvas id="statusChart"></canvas>
                    </div>
                </div>
            </div>

            <div class="dashboard-layout">
                <div class="content-card">
                    <div class="card-header">
                        <h2>Órdenes Recientes</h2>
                        <button class="btn-view-all" @click=${() => navigator.goto('/servicios/listado/orden')}>
                            Ver todo
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 80px;">ID</th>
                                    <th>Ubicación</th>
                                    <th>Fecha</th>
                                    <th>Estado Actual</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.recentOrders.length === 0 ? html`<tr><td colspan="4" style="text-align: center; padding: 2rem; color: var(--text-light);">No hay órdenes recientes.</td></tr>` : ''}
                                ${this.recentOrders.map(order => html`
                                    <tr style="cursor: pointer;" @click=${() => navigator.goto(`/servicios/orden/detalles/${order.id_orden}`)}>
                                        <td style="font-weight: 800; color: var(--primary);">#${order.id_orden}</td>
                                        <td>${order.direccion.length > 40 ? order.direccion.substring(0, 40) + '...' : order.direccion}</td>
                                        <td>${order.fecha_emision}</td>
                                        <td>
                                            <span class="status-pill ${this.getStatusClass(order.estado)}">
                                                ${order.estado}
                                            </span>
                                        </td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="content-card">
                    <div class="card-header">
                        <h2>Accesos Directos</h2>
                    </div>
                    <div class="shortcuts-list">
                        ${this.shortcuts.map(shortcut => html`
                            <a href="javascript:void(0)" class="shortcut-item" @click=${() => navigator.goto(shortcut.route)}>
                                <div class="shortcut-icon" style="background: ${shortcut.color}">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m9 18 6-6-6-6"/>
                                    </svg>
                                </div>
                                <div class="shortcut-info">
                                    <span>${shortcut.label}</span>
                                </div>
                            </a>
                        `)}
                    </div>
                </div>
            </div>
        `;
  }
}

customElements.define('view-dashboard', ViewDashboard);
