export class ServiciosService {
    constructor() {
        this.baseUrl = 'http://api-multiservicios.local';
    }

    async getServicios() {
        let url = `${this.baseUrl}/api/servicios`;
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
            console.error('Error al obtener servicios:', error);
            return false;
        }
    }

    async getOneServicio(id) {
        let url = `${this.baseUrl}/api/servicios/${id}`;
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
            console.error('Error al obtener servicio:', error);
            return false;
        }
    }

    async updateServicio(id, data) {
        let url = `${this.baseUrl}/api/servicios/${id}`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const response_json = await response.json();

            return response_json.data;
        } catch (error) {
            console.error('Error al actualizar servicio:', error);
            return false;
        }
    }

    async createServicio(data) {
        let url = `${this.baseUrl}/api/servicios`;
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
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const response_json = await response.json();

            return response_json.data;
        } catch (error) {
            console.error('Error al crear servicio:', error);
            return false;
        }
    }

    async deleteServicio(id_servicio) {
        let url = `${this.baseUrl}/api/servicios/${id_servicio}`;
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
            console.error('Error al eliminar servicio:', error);
            return false;
        }
    }

    async getCatalogoServicios() {
        let url = `${this.baseUrl}/api/catalogo-servicios`;
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
            console.error('Error al obtener catálogo de servicios:', error);
            return false;
        }
    }

    async createOrden(data) {
        let url = `${this.baseUrl}/api/ordenes`;
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
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const response_json = await response.json();
            return response_json.data;
        } catch (error) {
            console.error('Error al crear orden:', error);
            throw error;
        }
    }
}

export const serviciosService = new ServiciosService();
