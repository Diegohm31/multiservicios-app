export class ProductsService {
  constructor() {
    this.baseUrl = 'http://proyecto-laravel.local/api/productos';
    this.token = localStorage.getItem('token');
  }

  async getAll() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    };

    try {
      const response = await fetch(this.baseUrl, requestOptions);
      if (!response.ok) throw new Error('Error fetching products');
      let response_json = await response.json();
      // console.log(response_json);
      return response_json.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getOne(id) {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    };
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, requestOptions);
      if (!response.ok) throw new Error('Error fetching product');
      let response_json = await response.json();
      console.log(response_json);
      return response_json.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async create(productData) {
    try {
      const isFormData = productData instanceof FormData;
      const body = isFormData ? productData : JSON.stringify(productData);

      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: body
      };

      const response = await fetch(this.baseUrl, requestOptions);
      if (!response.ok) throw new Error('Error creating product');
      let response_json = await response.json();
      console.log(response_json);
      return response_json.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(id, productData) {
    try {
      const isFormData = productData instanceof FormData;
      const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
      const body = isFormData ? productData : JSON.stringify(productData);

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'POST', // Nota: Algunos servidores no procesan FormData en PUT correctamente.
        headers,
        body,
      });
      if (!response.ok) throw new Error('Error updating product');
      let response_json = await response.json();
      console.log(response_json);
      return response_json.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting product');
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export const productsService = new ProductsService();
