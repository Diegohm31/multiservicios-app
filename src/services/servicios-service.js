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
        const isFormData = data instanceof FormData;

        // Si es FormData, agregar _method para simular PUT
        if (isFormData) {
            data.append('_method', 'PUT');
        }

        const requestOptions = {
            method: isFormData ? 'POST' : 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...(isFormData ? {} : { 'Content-Type': 'application/json' })
            },
            body: isFormData ? data : JSON.stringify(data)
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
        const isFormData = data instanceof FormData;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...(isFormData ? {} : { 'Content-Type': 'application/json' })
            },
            body: isFormData ? data : JSON.stringify(data)
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

    async getOrdenes() {
        let url = `${this.baseUrl}/api/ordenes`;
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
            console.error('Error al obtener ordenes:', error);
            return false;
        }
    }

    async getOneOrden(id, detalle = false) {
        let url = `${this.baseUrl}/api/ordenes/${id}`;
        if (detalle) {
            url += '?detalle=true';
        }
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
            console.error('Error al obtener la orden:', error);
            return false;
        }
    }

    async cancelarOrden(id, observaciones = null) {
        let url = `${this.baseUrl}/api/ordenes/${id}/cancelar`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ observaciones })
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const response_json = await response.json();

            return response_json.data;
        } catch (error) {
            console.error('Error al cancelar orden:', error);
            return false;
        }
    }

    async aceptarOrden(id, observaciones = null) {
        let url = `${this.baseUrl}/api/ordenes/${id}/aceptar`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ observaciones })
        };
        try {
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const response_json = await response.json();

            return response_json.data;
        } catch (error) {
            console.error('Error al aceptar orden:', error);
            return false;
        }
    }

    async createPresupuesto(data) {
        let url = `${this.baseUrl}/api/presupuestos`;
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
            console.error('Error al crear presupuesto:', error);
            throw error;
        }
    }

    async aceptarPresupuesto(id) {
        let url = `${this.baseUrl}/api/presupuestos/${id}/aceptar`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
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
            console.error('Error al aceptar presupuesto:', error);
            return false;
        }
    }

    async cancelarPresupuesto(id) {
        let url = `${this.baseUrl}/api/presupuestos/${id}/cancelar`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
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
            console.error('Error al cancelar presupuesto:', error);
            return false;
        }
    }

    async subirPeritaje(id, file) {
        let url = `${this.baseUrl}/api/ordenes/${id}/subir-peritaje`;
        let token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('pdf_peritaje', file);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: formData
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
            console.error('Error al subir peritaje:', error);
            throw error;
        }
    }

    async createReportePago(formData) {
        let url = `${this.baseUrl}/api/reportes-pagos`;
        let token = localStorage.getItem('token');

        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: formData
        };
        try {
            const response = await fetch(url, requestOptions);
            const response_json = await response.json();
            if (!response.ok) {
                throw new Error(response_json.message || `HTTP error! status: ${response.status}`);
            }
            return response_json.data;
        } catch (error) {
            console.error('Error al crear reporte de pago:', error);
            throw error;
        }
    }

    async getReportesPagos() {
        let url = `${this.baseUrl}/api/reportes-pagos`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await fetch(url, requestOptions);
            const response_json = await response.json();
            return response_json.data || [];
        } catch (error) {
            console.error('Error fetching reportes pagos:', error);
            return [];
        }
    }

    async getOneReportePago(id, detalle = false) {
        let url = `${this.baseUrl}/api/reportes-pagos/${id}`;
        if (detalle) {
            url += '?detalle=true';
        }
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await fetch(url, requestOptions);
            const response_json = await response.json();
            return response_json.data;
        } catch (error) {
            console.error('Error fetching reporte pago:', error);
            return null;
        }
    }

    async aceptarReportePago(data) {
        let url = `${this.baseUrl}/api/reportes-pagos/aceptar`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        };
        try {
            const response = await fetch(url, requestOptions);
            const response_json = await response.json();
            if (!response.ok) {
                throw new Error(response_json.message || `HTTP error! status: ${response.status}`);
            }
            return response_json.data;
        } catch (error) {
            console.error('Error accepting reporte pago:', error);
            throw error;
        }
    }

    async cancelarReportePago(data) {
        let url = `${this.baseUrl}/api/reportes-pagos/cancelar`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        };
        try {
            const response = await fetch(url, requestOptions);
            const response_json = await response.json();
            if (!response.ok) {
                throw new Error(response_json.message || `HTTP error! status: ${response.status}`);
            }
            return response_json.data;
        } catch (error) {
            console.error('Error canceling reporte pago:', error);
            throw error;
        }
    }
    async asignarPersonal(id, data) {
        let url = `${this.baseUrl}/api/ordenes/${id}/asignar-personal`;
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
            if (!response.ok) {
                throw new Error(response_json.message || `HTTP error! status: ${response.status}`);
            }
            return response_json.data;
        } catch (error) {
            console.error('Error al asignar personal:', error);
            throw error;
        }
    }
    async getOneOrdenAsignarPersonal(id) {
        let url = `${this.baseUrl}/api/ordenes/${id}/asignar-personal`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await fetch(url, requestOptions);
            const response_json = await response.json();
            return response_json.data;
        } catch (error) {
            console.error('Error fetching orden:', error);
            return null;
        }
    }

    async getAllAsignaciones() {
        let url = `${this.baseUrl}/api/get-all-asignaciones`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await fetch(url, requestOptions);
            const response_json = await response.json();
            return response_json.data;
        } catch (error) {
            console.error('Error fetching all assignments:', error);
            return { operativos: [], equipos: [] };
        }
    }

    async ponerEnEjecucion(id) {
        let url = `${this.baseUrl}/api/ordenes/${id}/poner-en-ejecucion`;
        let token = localStorage.getItem('token');
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await fetch(url, requestOptions);
            const response_json = await response.json();
            if (!response.ok) {
                throw new Error(response_json.message || `HTTP error! status: ${response.status}`);
            }
            return response_json.data;
        } catch (error) {
            console.error('Error al poner orden en ejecución:', error);
            throw error;
        }
    }
}


export const serviciosService = new ServiciosService();
