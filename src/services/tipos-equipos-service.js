export class TiposEquiposService {
    constructor() {
        this.baseUrl = 'http://api-multiservicios.local';
    }

    async getTiposEquipos() {
        let url = `${this.baseUrl}/api/tipos-equipos`;
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
            console.error('Error al obtener tipos de equipos:', error);
            return false;
        }
    }

    async getOneTipoEquipo(id) {
        let url = `${this.baseUrl}/api/tipos-equipos/${id}`;
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
            console.error('Error al obtener tipo de equipo:', error);
            return false;
        }
    }

    async updateTipoEquipo(id, data) {
        let url = `${this.baseUrl}/api/tipos-equipos/${id}`;
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
            console.error('Error al actualizar tipo de equipo:', error);
            return false;
        }
    }

    async createTipoEquipo(data) {
        let url = `${this.baseUrl}/api/tipos-equipos`;
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
            console.error('Error al crear tipo de equipo:', error);
            return false;
        }
    }

    async deleteTipoEquipo(id_tipo_equipo) {
        let url = `${this.baseUrl}/api/tipos-equipos/${id_tipo_equipo}`;
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
            console.error('Error al eliminar tipo de equipo:', error);
            return false;
        }
    }
}

export const tiposEquiposService = new TiposEquiposService();
