
const API_URL = '/api';

async function fetchApi(endpoint, options = {}) {
    const token = localStorage.getItem('jwt_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('Session expirée, veuillez vous reconnecter');
        }

        if (response.status === 204) {
            return null;
        }

        const data = await response.json();

        if (!response.ok) {
            throw {
                status: response.status,
                message: data.error || data.message || 'Une erreur est survenue',
                errors: data.errors || null,
                details: data.details || null,
            };
        }

        return data;
    } catch (error) {
        if (error.status) {
            throw error;
        }
        throw {
            status: 0,
            message: 'Erreur de connexion au serveur. Vérifiez que le backend est lancé.',
        };
    }
}
export const authApi = {
    login: async (email, password) => {
        const data = await fetchApi('/login_check', {
            method: 'POST',
            body: JSON.stringify({ username: email, password }),
        });
        return data;
    },

    register: async (email, password) => {
        return fetchApi('/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    getProfile: async () => {
        return fetchApi('/me');
    },
};
export const productsApi = {
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams();
        if (params.page) queryString.set('page', params.page);
        if (params.limit) queryString.set('limit', params.limit);
        if (params.category) queryString.set('category', params.category);
        if (params.search) queryString.set('search', params.search);
        if (params.minPrice) queryString.set('minPrice', params.minPrice);
        if (params.maxPrice) queryString.set('maxPrice', params.maxPrice);

        const qs = queryString.toString();
        return fetchApi(`/products${qs ? '?' + qs : ''}`);
    },

    getById: async (id) => {
        return fetchApi(`/products/${id}`);
    },

    create: async (productData) => {
        return fetchApi('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        });
    },

    update: async (id, productData) => {
        return fetchApi(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });
    },

    delete: async (id) => {
        return fetchApi(`/products/${id}`, {
            method: 'DELETE',
        });
    },
};
export const categoriesApi = {
    getAll: async () => {
        return fetchApi('/categories');
    },

    create: async (name) => {
        return fetchApi('/categories', {
            method: 'POST',
            body: JSON.stringify({ name }),
        });
    },

    update: async (id, name) => {
        return fetchApi(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ name }),
        });
    },

    delete: async (id) => {
        return fetchApi(`/categories/${id}`, {
            method: 'DELETE',
        });
    },
};
export const ordersApi = {
    getAll: async () => {
        return fetchApi('/orders');
    },

    getById: async (id) => {
        return fetchApi(`/orders/${id}`);
    },

    create: async (items) => {
        return fetchApi('/orders', {
            method: 'POST',
            body: JSON.stringify({ items }),
        });
    },

    updateStatus: async (id, status) => {
        return fetchApi(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },
};
