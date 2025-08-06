import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard";

export const useGetDashboard = () => {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const { data } = await dashboardService.getDashboard();
            return data;
        },
    })
};