export class UsuariosService {
    constructor() {
        this.baseUrl = 'http://api-multiservicios.local';
    }

    async getAdmins() {
        let url = `${this.baseUrl}/api/admins`;
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
            console.error('Error al obtener administradores:', error);
            return false;
        }
    }

    async getClientes() {
        let url = `${this.baseUrl}/api/clientes`;
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
            console.error('Error al obtener clientes:', error);
            return false;
        }
    }

    async toggleStatus(id, active) {
        let url = `${this.baseUrl}/api/usuarios/${id}/cambiar-estado`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ active: active ? 1 : 0 })
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const response_json = await response.json();
            return response_json.data;
        } catch (error) {
            console.error('Error al cambiar estado del usuario:', error);
            throw error;
        }
    }
}

export const usuariosService = new UsuariosService();