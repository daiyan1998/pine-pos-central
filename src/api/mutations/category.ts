import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";
import { toast } from "sonner";

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (categoryData: any) => {
            const { data } = await categoryService.createCategory(categoryData);
            return data;
        },
        onSuccess: () => {
            toast.success("Category created successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (categoryData: any) => {
            const { data } = await categoryService.updateCategory(
                categoryData.id,
                categoryData
            );
            return data;
        },
        onSuccess: () => {
            toast.success("Category updated successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await categoryService.deleteCategory(id);
            return data;
        },
        onSuccess: () => {
            toast.success("Category deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
        },
    });
};