export class PlanesMembresiasService {
    constructor() {
        this.baseUrl = 'http://api-multiservicios.local';
    }

    async getPlanes() {
        let url = `${this.baseUrl}/api/planes-membresias`;
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
            const response_json = await response.json();
            return response_json.data;
        } catch (error) {
            console.error('Error al obtener planes:', error);
            return [];
        }
    }

    async getOnePlan(id) {
        let url = `${this.baseUrl}/api/planes-membresias/${id}`;
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
            const response_json = await response.json();
            return response_json.data;
        } catch (error) {
            console.error('Error al obtener plan:', error);
            return null;
        }
    }

    async createPlan(data) {
        let url = `${this.baseUrl}/api/planes-membresias`;
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
            return response_json.data;
        } catch (error) {
            console.error('Error al crear plan:', error);
            throw error;
        }
    }

    async updatePlan(id, data) {
        let url = `${this.baseUrl}/api/planes-membresias/${id}`;
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
            const response_json = await response.json();
            return response_json.data;
        } catch (error) {
            console.error('Error al actualizar plan:', error);
            throw error;
        }
    }

    async deletePlan(id) {
        let url = `${this.baseUrl}/api/planes-membresias/${id}`;
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
            const response_json = await response.json();
            return response_json.data;
        } catch (error) {
            console.error('Error al eliminar plan:', error);
            return false;
        }
    }

    async createMembresia(data) {
        let url = `${this.baseUrl}/api/membresias`;
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
            if (!response.ok) throw new Error(response_json.message || 'Error al crear membresía');
            return response_json.data;
        } catch (error) {
            console.error('Error al crear membresía:', error);
            throw error;
        }
    }

    async cancelMembresia(id) {
        let url = `${this.baseUrl}/api/membresias/${id}`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ estado: 'Cancelada' })
        };
        try {
            const response = await fetch(url, requestOptions);
            const response_json = await response.json();
            if (!response.ok) throw new Error(response_json.message || 'Error al cancelar membresía');
            return response_json.data;
        } catch (error) {
            console.error('Error al cancelar membresía:', error);
            throw error;
        }
    }
}

export const planesMembresiasService = new PlanesMembresiasService();
