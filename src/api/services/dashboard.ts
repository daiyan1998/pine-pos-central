import { apiClient } from "../client";

export const dashboardService = {
    getDashboard: () => apiClient.get('/dashboard')
}