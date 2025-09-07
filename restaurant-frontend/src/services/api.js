import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Menu Item APIs
export const getAllMenuItems = () => {
    return axios.get(`${API_BASE_URL}/menu`);
};

export const getMenuItemById = (id) => {
    return axios.get(`${API_BASE_URL}/menu/${id}`);
};

export const createMenuItem = (menuItem) => {
    return axios.post(`${API_BASE_URL}/menu`, menuItem);
};

export const updateMenuItem = (id, menuItem) => {
    return axios.put(`${API_BASE_URL}/menu/${id}`, menuItem);
};

export const deleteMenuItem = (id) => {
    return axios.delete(`${API_BASE_URL}/menu/${id}`);
};

// Table APIs
export const getAllTables = () => {
    return axios.get(`${API_BASE_URL}/tables`);
};

export const getAvailableTables = () => {
    return axios.get(`${API_BASE_URL}/tables/available`);
};

export const createTable = (table) => {
    return axios.post(`${API_BASE_URL}/tables`, table);
};

export const updateTable = (id, table) => {
    return axios.put(`${API_BASE_URL}/tables/${id}`, table);
};

export const deleteTable = (id) => {
    return axios.delete(`${API_BASE_URL}/tables/${id}`);
};

// Order APIs
export const getAllOrders = () => {
    return axios.get(`${API_BASE_URL}/orders`);
};

export const getOrderById = (id) => {
    return axios.get(`${API_BASE_URL}/orders/${id}`);
};

export const createOrder = (tableId, orderItems) => {
    return axios.post(`${API_BASE_URL}/orders/table/${tableId}`, orderItems);
};

export const updateOrderStatus = (id, status) => {
    return axios.put(`${API_BASE_URL}/orders/${id}/status`, { status });
};
