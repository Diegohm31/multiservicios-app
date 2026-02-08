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
            // throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }
}

export const usuariosService = new UsuariosService();