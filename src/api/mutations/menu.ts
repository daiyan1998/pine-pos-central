import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuService } from "../services/menuService";

export const useUpdateMenuItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (menuItemData: any) => {
            const { data } = await menuService.updateMenuItem(menuItemData);
            return data;
        }
        ,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu-items'] });
        }
    })
};