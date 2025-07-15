import { apiClient } from "../client";

export const tableService = {
    getTables: async () => await apiClient.get('/tables'),
    getTable: async (id: number) => await apiClient.get(`/tables/${id}`),
    createTable: async (tableData: any) => await apiClient.post('/tables', tableData),
    updateTable: async (id: number, tableData: any) => await apiClient.put(`/tables/${id}`, tableData),
    deleteTable: async (id: number) => await apiClient.delete(`/tables/${id}`),
}