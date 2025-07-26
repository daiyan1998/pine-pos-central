import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";

export const useGetCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await categoryService.getCategories();
            return data;
        },
    });
};