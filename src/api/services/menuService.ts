import { apiClient } from "../client";

export const menuService = {
    getMenuItems: () => apiClient.get('/menu-items'),
    createMenuItem: (menuItemData: any) => apiClient.post('/menu-items', menuItemData),
    updateMenuItem: (menuItemData : { id: number, isActive: boolean }) => apiClient.put(`/menu-items/${menuItemData.id}`, { isActive: menuItemData.isActive }),
    deleteMenuItem: (id: string) => apiClient.delete(`/menu-items/${id}`),
}