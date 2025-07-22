import { apiClient } from "../client";

export const categoryService = {
    getCategories: () => apiClient.get('/categories'),
    createCategory: (data: { name: string }) => apiClient.post('/categories', data),
    updateCategory: (id: number, data: { name: string }) => apiClient.put(`/categories/${id}`, data),
    deleteCategory: (id: number) => apiClient.delete(`/categories/${id}`),
}