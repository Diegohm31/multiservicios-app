import { LitElement, html, css } from 'lit';

export class AddressMap extends LitElement {
    static properties = {
        address: { type: String },
        lat: { type: Number },
        lng: { type: Number },
        zoom: { type: Number },
        showMap: { type: Boolean },
        isLocating: { type: Boolean }
    };

    static styles = css`
    :host {
      display: block;
      width: 100%;
      --map-primary: #3b82f6;
      --map-radius: 16px;
    }
    .map-wrapper {
      width: 100%;
      overflow: hidden;
      height: 0;
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      margin-top: 0;
      border-radius: var(--map-radius);
      position: relative;
    }
    .map-wrapper.visible {
      height: 380px;
      opacity: 1;
      margin-top: 1rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    #map {
      height: 100%;
      width: 100%;
      background: #f8fafc;
      z-index: 1;
    }
    .location-btn {
      position: absolute;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      background: white;
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      color: #3b82f6;
      transition: all 0.2s;
    }
    .location-btn:hover {
      background: #f8fafc;
      color: #2563eb;
    }
    .location-btn.loading svg {
      animation: spin 1.5s linear infinite;
    }

    .map-skeleton {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #f8fafc;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .map-skeleton.active {
      opacity: 1;
      pointer-events: all;
    }

    .pulse {
      width: 60px;
      height: 60px;
      background: rgba(59, 130, 246, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    
    .pulse::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border: 3px solid #3b82f6;
      border-radius: 50%;
      animation: pulse-ring 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
    }

    .pulse svg {
      color: #3b82f6;
    }

    @keyframes pulse-ring {
      0% { transform: scale(0.33); opacity: 0; }
      80%, 100% { transform: scale(1.5); opacity: 0; }
      50% { opacity: 0.5; }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .toggle-map-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      background: #ffffff;
      color: #64748b;
      border: 1px solid #e2e8f0;
      padding: 0.7rem 1.4rem;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 0.5rem;
    }
    .toggle-map-btn:hover {
      background: #f8fafc;
      color: var(--map-primary);
      border-color: var(--map-primary);
      transform: translateY(-1px);
    }
    .toggle-map-btn.active {
      background: var(--map-primary);
      color: white;
      border-color: var(--map-primary);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    
    .leaflet-container {
      font-family: inherit;
    }
  `;

    constructor() {
        super();
        this.address = '';
        this.lat = 10.19077; // 58Q7+W36 Lechería, Venezuela
        this.lng = -64.68658;
        this.zoom = 16;
        this.showMap = false;
        this.map = null;
        this.marker = null;
        this._resizeObserver = null;
        this._pendingLoc = null;
        this.isLocating = false;
    }

    async initLeaflet() {
        if (!window.L) {
            await this.loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
            delete window.L.Icon.Default.prototype._getIconUrl;
            window.L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
        }
    }

    loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    async toggleMap() {
        this.showMap = !this.showMap;
        if (this.showMap) {
            this.handleOpen();
        }
    }

    async getCurrentLocation(retryCount = 1) {
        if (!navigator.geolocation) return;
        this.isLocating = true;

        const options = {
            enableHighAccuracy: true,
            timeout: 10000, // Reduced from infinity to avoid hanging, but more than 5s
            maximumAge: 0   // Force a fresh request on click
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this._pendingLoc = { lat: latitude, lng: longitude };

                // Visual feedback delay
                setTimeout(() => {
                    this.isLocating = false;
                    this.applyLocation();
                }, 800);
            },
            (error) => {
                console.warn("Geolocation attempt failed:", error.message);

                // If it timed out and we have retries left, try again immediately.
                // This often fixes the "click twice" issue where the first click wakes up the hardware.
                if (error.code === error.TIMEOUT && retryCount > 0) {
                    console.log("Retrying geolocation...");
                    this.getCurrentLocation(retryCount - 1);
                } else {
                    this.isLocating = false;
                    // Fallback to alert/log
                    if (error.code === error.TIMEOUT) {
                        console.warn("Map stayed at default location due to GPS timeout.");
                    }
                }
            },
            options
        );
    }

    applyLocation() {
        if (this.map && this._pendingLoc) {
            const { lat, lng } = this._pendingLoc;
            this.lat = lat;
            this.lng = lng;

            this.map.setView([lat, lng], this.zoom);
            if (this.marker) {
                this.marker.setLatLng([lat, lng]);
            }
            this.updatePosition(lat, lng);
            this._pendingLoc = null;
        }
    }

    async handleOpen() {
        await this.initLeaflet();
        setTimeout(() => {
            if (!this.map) {
                this.renderMap();
            } else {
                this.map.invalidateSize();
                this.applyLocation();
                [100, 300, 600].forEach(delay => {
                    setTimeout(() => {
                        if (this.map) this.map.invalidateSize();
                    }, delay);
                });
            }
        }, 50);
    }

    renderMap() {
        const mapEl = this.shadowRoot.getElementById('map');
        if (!mapEl || this.map) return;

        this.map = window.L.map(mapEl, { zoomControl: false }).setView([this.lat, this.lng], this.zoom);

        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(this.map);

        window.L.control.zoom({ position: 'topright' }).addTo(this.map);

        this.marker = window.L.marker([this.lat, this.lng], { draggable: true }).addTo(this.map);

        this.map.on('click', (e) => this.updatePosition(e.latlng.lat, e.latlng.lng));
        this.marker.on('dragend', (e) => this.updatePosition(e.target.getLatLng().lat, e.target.getLatLng().lng));

        this._resizeObserver = new ResizeObserver(() => {
            if (this.map) this.map.invalidateSize();
        });
        this._resizeObserver.observe(mapEl);

        setTimeout(() => {
            this.map.invalidateSize();
            this.applyLocation();
        }, 300);
    }

    async updatePosition(lat, lng) {
        this.lat = lat;
        this.lng = lng;
        this.marker.setLatLng([lat, lng]);

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await res.json();
            if (data?.display_name) {
                this.address = data.display_name;
                this.dispatchEvent(new CustomEvent('address-changed', {
                    detail: { address: this.address, lat, lng },
                    bubbles: true,
                    composed: true
                }));
            }
        } catch (e) {
            console.error(e);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._resizeObserver) this._resizeObserver.disconnect();
    }

    render() {
        return html`
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
            
            <button type="button" class="toggle-map-btn ${this.showMap ? 'active' : ''}" @click=${this.toggleMap}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
                ${this.showMap ? 'Cerrar Mapa' : 'Seleccionar en Mapa'}
            </button>
            
            <div class="map-wrapper ${this.showMap ? 'visible' : ''}">
                <div class="map-skeleton ${this.isLocating ? 'active' : ''}">
                    <div class="pulse">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                    </div>
                    <span style="font-size: 0.9rem; font-weight: 600; color: #64748b;">Obteniendo tu ubicación...</span>
                </div>

                <div id="map"></div>
                ${this.showMap ? html`
                    <button type="button" class="location-btn ${this.isLocating ? 'loading' : ''}" 
                            @click=${() => this.getCurrentLocation()} title="Mi ubicación">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M3 12h3m12 0h3M12 3v3m0 12v3"></path>
                        </svg>
                    </button>
                ` : ''}
            </div>
        `;
    }
}

customElements.define('address-map', AddressMap);
