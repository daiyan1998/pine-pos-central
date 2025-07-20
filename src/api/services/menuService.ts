import { apiClient } from "../client";

export const menuService = {
    getMenuItems: () => apiClient.get('/menu-items'),
    updateMenuItem: (menuItemData : { id: number, isActive: boolean }) => apiClient.put(`/menu-items/${menuItemData.id}`, { isActive: menuItemData.isActive }),
}