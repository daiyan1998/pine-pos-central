import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../client"
import { tableService } from "../services/tableService"

export const useGetTables = () => {
    return useQuery({
        queryKey: ['tables'],
        queryFn: async () => {
            const {data} = await tableService.getTables()
            return data
        } 
     })
}