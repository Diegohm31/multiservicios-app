export class TiposServiciosService {
    constructor() {
        this.baseUrl = 'http://api-multiservicios.local';
    }

    async getTiposServicios() {
        let url = `${this.baseUrl}/api/tipos-servicios`;
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
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
            console.error('Error al obtener tipos de servicios:', error);
            return false;
        }
    }

    async getOneTipoServicio(id) {
        let url = `${this.baseUrl}/api/tipos-servicios/${id}`;
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
            console.error('Error al obtener tipo de servicio:', error);
            return false;
        }
    }

    async updateTipoServicio(id, data) {
        let url = `${this.baseUrl}/api/tipos-servicios/${id}`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: data
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const response_json = await response.json();

            return response_json.data;
        } catch (error) {
            console.error('Error al actualizar tipo de servicio:', error);
            return false;
        }
    }

    async createTipoServicio(data) {
        let url = `${this.baseUrl}/api/tipos-servicios`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: data
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const response_json = await response.json();

            return response_json.data;
        } catch (error) {
            console.error('Error al crear tipo de servicio:', error);
            return false;
        }
    }

    async deleteTipoServicio(id) {
        let url = `${this.baseUrl}/api/tipos-servicios/${id}`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'DELETE',
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
            console.error('Error al eliminar tipo de servicio:', error);
            return false;
        }
    }
}

export const tiposServiciosService = new TiposServiciosService();
