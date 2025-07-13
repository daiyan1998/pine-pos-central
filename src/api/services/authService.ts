import { apiClient } from "../client";

interface User {
    name: string;
    email: string;
    password: string;
}

export const authService = {
    login: (email: string, password: string) => apiClient.post('/users/login', {email,password}),
    register: (user: User) => apiClient.post('/users/register', user),
    logout: () => apiClient.post('/users/logout'),
    getCurrentUser: () => apiClient.get('/users/me'),
    updateUser: (user: User) => apiClient.put('/users/me', user),
    deleteUser: () => apiClient.delete('/users/me'),
}