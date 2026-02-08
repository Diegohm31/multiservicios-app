export class AuthService {
  constructor() {
    this.baseUrl = 'http://api-multiservicios.local';
  }

  async register(user) {
    let url = `${this.baseUrl}/api/register`;

    let data = {
      name: user.name,
      email: user.email,
      password: user.password,
      cedula: user.cedula,
      telefono: user.telefono,
      direccion: user.direccion
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const response_json = await response.json();

      return true;
    } catch (error) {
      console.error('Error al iniciar sesion:', error);
      throw error; // para que el error se propague a quien lo llama
      //return false;
    }
  }

  async login(email, password) {
    let url = `${this.baseUrl}/api/login`;

    let credenciales = {
      email: email,
      password: password
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credenciales)
    };
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const response_json = await response.json();

      localStorage.setItem('token', response_json.token);

      return true;
    } catch (error) {
      console.error('Error al iniciar sesion:', error);
      // throw error; // para que el error se propague a quien lo llama
      return false;
    }
  }

  async logout() {
    let url = `${this.baseUrl}/api/logout`;
    let token = localStorage.getItem('token');
    const requestOptions = {
      method: 'POST',
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
      localStorage.removeItem('token');

      return true;
    } catch (error) {
      console.error('Error al cerrar sesion:', error);
      // throw error; // para que el error se propague a quien lo llama
      return false;
    }
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  async forgotPassword(email) {
    let url = `${this.baseUrl}/api/forgot-password`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    };
    try {
      const response = await fetch(url, requestOptions);
      const response_json = await response.json();
      if (!response.ok) {
        throw new Error(response_json.message || `HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Error al solicitar recuperación:', error);
      throw error;
    }
  }

  async verifyCode(email, codigo) {
    let url = `${this.baseUrl}/api/verify-code`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, codigo })
    };
    try {
      const response = await fetch(url, requestOptions);
      const response_json = await response.json();
      if (!response.ok) {
        throw new Error(response_json.message || `HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Error al verificar código:', error);
      throw error;
    }
  }

  async resetPassword(email, password) {
    let url = `${this.baseUrl}/api/reset-password`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    };
    try {
      const response = await fetch(url, requestOptions);
      const response_json = await response.json();
      if (!response.ok) {
        throw new Error(response_json.message || `HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      throw error;
    }
  }

  async getMenu() {
    let url = `${this.baseUrl}/api/menu`;
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
      console.error('Error al obtener menu:', error);
      // throw error; // para que el error se propague a quien lo llama
      return false;
    }
  }

  async getUser() {
    let url = `${this.baseUrl}/api/user`;
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
      console.error('Error al obtener usuario:', error);
      // throw error; // para que el error se propague a quien lo llama
      return false;
    }
  }

  async getUserByEmail(email) {
    let url = `${this.baseUrl}/api/user/${email}`;
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
      console.error('Error al obtener usuario:', error);
      // throw error; // para que el error se propague a quien lo llama
      return false;
    }
  }


  async getOpcionesHijas(id_padre) {
    let url = `${this.baseUrl}/api/menu/${id_padre}`;
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
      console.error('Error al obtener opciones hijas:', error);
      // throw error; // para que el error se propague a quien lo llama
      return false;
    }
  }
}


export const authService = new AuthService();
