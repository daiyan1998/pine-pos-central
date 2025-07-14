import { apiClient } from "../client";

export const menuService = {
    getMenuItems: () => apiClient.get('/menu-items'),
}