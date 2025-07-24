import { useMutation, useQueryClient } from "@tanstack/react-query";
import { menuService } from "../services/menuService";


export const useCreateMenuItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (menuItemData: any) => {
            const { data } = await menuService.createMenuItem(menuItemData);
            return data;
        }
        ,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu-items'] });
        }
    })
}

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

export const useDeleteMenuItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await menuService.deleteMenuItem(id);
            return data;
        }
        ,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu-items'] });
        }
    })
}