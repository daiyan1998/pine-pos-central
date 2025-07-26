import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";
import { menuService } from "../services/menuService";

export const useGetMenuItems = () => {
  return useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const { data } = await menuService.getMenuItems();
      return data;
    },
  });
};
