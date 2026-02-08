export class EquiposService {
    constructor() {
        this.baseUrl = 'http://api-multiservicios.local';
    }

    async getEquipos() {
        let url = `${this.baseUrl}/api/equipos`;
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
            console.error('Error al obtener equipos:', error);
            // throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }

    async getOneEquipo(id_equipo) {
        let url = `${this.baseUrl}/api/equipos/${id_equipo}`;
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
            console.error('Error al obtener equipo:', error);
            // throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }

    async createEquipo(data) {
        let url = `${this.baseUrl}/api/equipos`;
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
            console.error('Error al crear equipo:', error);
            // throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }

    async updateEquipo(id_equipo, data) {
        let url = `${this.baseUrl}/api/equipos/${id_equipo}`;
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
            console.error('Error al actualizar equipo:', error);
            // throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }

    async deleteEquipo(id_equipo) {
        let url = `${this.baseUrl}/api/equipos/${id_equipo}`;
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
            console.error('Error al eliminar equipo:', error);
            // throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }
}

export const equiposService = new EquiposService();