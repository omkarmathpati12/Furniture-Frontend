import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use(
    (config) => {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const user = JSON.parse(userJson);
            if (user && user.username) {
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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error)
    }
)

export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => {
        localStorage.removeItem('user');
        return api.post('/auth/logout');
    },
    me: (username) => api.get('/auth/me', { params: { username } }),
}

export const productAPI = {
    getAll: (params) => api.get('/products', { params }),
    getFeatured: () => api.get('/products/featured'),
    getById: (id) => api.get(`/products/${id}`),
}

export const cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (productId, quantity = 1) =>
        api.post('/cart/add', null, { params: { productId, quantity } }),
    updateItem: (itemId, quantity) =>
        api.put(`/cart/item/${itemId}`, null, { params: { quantity } }),
    removeItem: (itemId) => api.delete(`/cart/item/${itemId}`),
    clearCart: () => api.delete('/cart/clear'),
}

export const orderAPI = {
    placeOrder: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders'),
    getOrderById: (id) => api.get(`/orders/${id}`),
}

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
