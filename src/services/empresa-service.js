import { authService } from './auth-service.js';

export class EmpresaService {
    constructor() {
        this.baseUrl = authService.baseUrl;
    }

    // --- Empresa Methods ---
    async getEmpresas() {
        let url = `${this.baseUrl}/api/empresas`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) throw new Error('Error al obtener empresas');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async storeEmpresa(empresa) {
        let url = `${this.baseUrl}/api/empresas`;
        let token = localStorage.getItem('token');
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // If it's not FormData, we need to set Content-Type and stringify
        const isFormData = empresa instanceof FormData;
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: isFormData ? empresa : JSON.stringify(empresa)
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) throw new Error('Error al crear empresa');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateEmpresa(id, empresa) {
        let url = `${this.baseUrl}/api/empresas/${id}`;
        let token = localStorage.getItem('token');
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const isFormData = empresa instanceof FormData;
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        const requestOptions = {
            // Using POST with _method=PUT (in FormData) for multipart support in some backends
            method: isFormData ? 'POST' : 'PUT',
            headers: headers,
            body: isFormData ? empresa : JSON.stringify(empresa)
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) throw new Error('Error al actualizar empresa');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // --- Cuentas Bancarias Methods ---
    async getCuentasBancarias() {
        let url = `${this.baseUrl}/api/cuentas-bancarias`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) throw new Error('Error al obtener cuentas bancarias');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async storeCuentaBancaria(cuenta) {
        let url = `${this.baseUrl}/api/cuentas-bancarias`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cuenta)
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) throw new Error('Error al crear cuenta bancaria');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateCuentaBancaria(id, cuenta) {
        let url = `${this.baseUrl}/api/cuentas-bancarias/${id}`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cuenta)
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) throw new Error('Error al actualizar cuenta bancaria');
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteCuentaBancaria(id) {
        let url = `${this.baseUrl}/api/cuentas-bancarias/${id}`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) throw new Error('Error al eliminar cuenta bancaria');
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

export const empresaService = new EmpresaService();
