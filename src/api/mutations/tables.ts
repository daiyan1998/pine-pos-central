import { useMutation, useQueryClient } from "@tanstack/react-query"
import { tableService } from "../services/tableService"

export const useCreateTable = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (tableData: any) => {
            const {data} = await tableService.createTable(tableData)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tables']})
        }
    })
}