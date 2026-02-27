import { LitElement, html, css } from 'lit';

export class CommonPopup extends LitElement {
    static properties = {
        title: { type: String },
        message: { type: String },
        type: { type: String }, // success, warning, info
        visible: { type: Boolean }
    };

    static styles = css`
    :host {
      --success: #10b981;
      --warning: #ef4444;
      --info: #f59e0b;
      --text: #1e293b;
      --text-light: #64748b;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
      animation: fadeIn 0.3s ease;
    }

    .popup {
      background: white;
      padding: 2.5rem;
      border-radius: 24px;
      width: 90%;
      max-width: 450px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      text-align: center;
      position: relative;
      overflow: hidden;
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .popup::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6px;
    }

    .popup.success::before { background: var(--success); }
    .popup.warning::before { background: var(--warning); }
    .popup.info::before { background: var(--info); }

    .icon-wrapper {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto 1.5rem;
      font-size: 2.5rem;
    }

    .success .icon-wrapper { background: #ecfdf5; color: var(--success); }
    .warning .icon-wrapper { background: #fef2f2; color: var(--warning); }
    .info .icon-wrapper { background: #fffbeb; color: var(--info); }

    h2 {
      margin: 0 0 0.75rem;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.025em;
    }

    p {
      margin: 0 0 2rem;
      color: var(--text-light);
      line-height: 1.6;
      font-size: 1.1rem;
    }

    .btn {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-success { background: var(--success); color: white; }
    .btn-success:hover { background: #059669; transform: translateY(-2px); }

    .btn-warning { background: var(--warning); color: white; }
    .btn-warning:hover { background: #dc2626; transform: translateY(-2px); }

    .btn-info { background: var(--info); color: white; }
    .btn-info:hover { background: #d97706; transform: translateY(-2px); }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(40px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;

    constructor() {
        super();
        this.visible = false;
        this.title = '';
        this.message = '';
        this.type = 'info';
    }

    connectedCallback() {
        super.connectedCallback();
        this._handler = (e) => {
            this.title = e.detail.title;
            this.message = e.detail.message;
            this.type = e.detail.type;
            this.visible = true;
        };
        window.addEventListener('show-popup', this._handler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('show-popup', this._handler);
    }

    close() {
        this.visible = false;
    }

    render() {
        if (!this.visible) return html``;

        const icons = {
            success: html`<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
            warning: html`<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
            info: html`<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line><circle cx="12" cy="12" r="10"></circle></svg>`
        };

        return html`
      <div class="overlay" @click=${this.close}>
        <div class="popup ${this.type}" @click=${(e) => e.stopPropagation()}>
          <div class="icon-wrapper">
            ${icons[this.type]}
          </div>
          <h2>${this.title}</h2>
          <p>${this.message}</p>
          <button class="btn btn-${this.type}" @click=${this.close}>
            Entendido
          </button>
        </div>
      </div>
    `;
    }
}

customElements.define('common-popup', CommonPopup);
