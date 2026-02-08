export class MovimientosService {
    constructor() {
        this.url = 'http://api-multiservicios.local';
    }

    async getMovimientos() {
        let url = `${this.url}/api/movimientos-materiales`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const response_json = await response.json();

            return response_json.data;
        } catch (error) {
            console.error('Error al obtener movimientos:', error);
            // throw error; // para que el error se propague a quien lo llama
            return [];
        }
    }

    async createMovimientos(data) {
        let url = `${this.url}/api/movimientos-materiales`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        };
        try {
            const response = await fetch(url, requestOptions);
            const response_json = await response.json();
            if (!response.ok) {
                throw new Error(response_json.message || `HTTP error! status: ${response.status}`);
            }
            return response_json.data;
        } catch (error) {
            console.error('Error al crear movimientos:', error);
            return false;
        }
    }
}

export const movimientosService = new MovimientosService();
