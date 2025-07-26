import { apiClient } from "../client";

export const categoryService = {
    getCategories: () => apiClient.get('/categories'),
    createCategory: (data: { name: string }) => apiClient.post('/categories', data),
    updateCategory: (id: string, data: { name: string }) => apiClient.put(`/categories/${id}`, data),
    deleteCategory: (id: string) => apiClient.delete(`/categories/${id}`),
}