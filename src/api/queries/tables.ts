import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../client"

export const useGetTables = () => {
    return useQuery({
        queryKey: ['tables'],
        queryFn: async () => {
            const {data} = await apiClient.get('/tables')
            return data
        } 
     })
}