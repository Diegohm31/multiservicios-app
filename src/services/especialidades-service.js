export class EspecialidadesService {
    constructor() {
        this.baseUrl = 'http://api-multiservicios.local';
    }
    async getEspecialidades() {
        let url = `${this.baseUrl}/api/especialidades`;
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
            console.error('Error al obtener especialidades:', error);
            // throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }

    async getOneEspecialidad(id) {
        let url = `${this.baseUrl}/api/especialidades/${id}`;
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
            console.error('Error al obtener especialidad:', error);
            // throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }

    async updateEspecialidad(id, data) {
        let url = `${this.baseUrl}/api/especialidades/${id}`;
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
            console.error('Error al actualizar especialidad:', error);
            // throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }

    async createEspecialidad(data) {
        let url = `${this.baseUrl}/api/especialidades`;
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
            //throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }

    async deleteEspecialidad(id_especialidad) {
        let url = `${this.baseUrl}/api/especialidades/${id_especialidad}`;
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
            console.error('Error al eliminar especialidad:', error);
            // throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }
}

export const especialidadesService = new EspecialidadesService();