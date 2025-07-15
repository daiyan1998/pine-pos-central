import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../client";

export const useGetMenuItems = () => {
  return useQuery({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const { data } = await apiClient.get("/menu-items");
      return data;
    },
  });
};
