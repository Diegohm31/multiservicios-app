export class MaterialesService {
    constructor() {
        this.baseUrl = 'http://api-multiservicios.local';
    }

    async getMateriales() {
        let url = `${this.baseUrl}/api/materiales`;
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
            console.error('Error al obtener materiales:', error);
            // throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }

    async getOneMaterial(id_material) {
        let url = `${this.baseUrl}/api/materiales/${id_material}`;
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
            console.error('Error al obtener material:', error);
            // throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }

    async createMaterial(data) {
        let url = `${this.baseUrl}/api/materiales`;
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
            console.error('Error al crear material:', error);
            throw error; // para que el error se propague a quien lo llama
            //return false;
        }
    }

    async updateMaterial(id_material, data) {
        let url = `${this.baseUrl}/api/materiales/${id_material}`;
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
            console.error('Error al actualizar material:', error);
            // throw error; // para que el error se propague a quien lo llama
            return false;
        }
    }
}

export const materialesService = new MaterialesService();
