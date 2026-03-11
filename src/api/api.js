/**
 * API Service Layer
 * 
 * We use a centralized Axios instance to handle all outgoing HTTP requests.
 * In this beginner version, we removed complex security.
 * Instead, we simply pass the 'username' from localStorage in the query params.
 */
import axios from 'axios'

const api = axios.create({
    baseURL: '/api', // Proxied to http://localhost:8080/api via vite.config.js
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * Request Interceptor:
 * Before every request, we check if a user is "logged in" (stored in localStorage).
 * If they are, we append their username to the request parameters.
 * This is a simple way for beginners to handle "who is logged in".
 */
api.interceptors.request.use(
    (config) => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const user = JSON.parse(userJson);
            if (user && user.username) {
                // Initialize params if they don't exist
                config.params = {
                    ...config.params,
                    username: user.username
                };
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor:
 * Simple error handling. If we get an error, we can log it here.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error)
    }
)

/**
 * Authentication API Endpoints
 */
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => {
        localStorage.removeItem('user'); // Just clear local storage
        return api.post('/auth/logout');
    },
    me: (username) => api.get('/auth/me', { params: { username } }),
}

/**
 * Product API Endpoints
 */
export const productAPI = {
    getAll: (params) => api.get('/products', { params }),
    getFeatured: () => api.get('/products/featured'),
    getById: (id) => api.get(`/products/${id}`),
}

/**
 * Shopping Cart API Endpoints
 * (Username is automatically added by the interceptor)
 */
export const cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (productId, quantity = 1) =>
        api.post('/cart/add', null, { params: { productId, quantity } }),
    updateItem: (itemId, quantity) =>
        api.put(`/cart/item/${itemId}`, null, { params: { quantity } }),
    removeItem: (itemId) => api.delete(`/cart/item/${itemId}`),
    clearCart: () => api.delete('/cart/clear'),
}

/**
 * Order API Endpoints
 * (Username is automatically added by the interceptor)
 */
export const orderAPI = {
    placeOrder: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders'),
    getOrderById: (id) => api.get(`/orders/${id}`),
}

/**
 * Admin API Endpoints
 */
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getProducts: () => api.get('/admin/products'),
    createProduct: (data) => api.post('/admin/products', data),
    updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/admin/products/${id}`),
    getAllOrders: () => api.get('/admin/orders'),
    updateOrderStatus: (id, status) =>
        api.patch(`/admin/orders/${id}/status`, null, { params: { status } }),
}

export default api
