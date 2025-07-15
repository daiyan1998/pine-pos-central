import {useQuery} from "@tanstack/react-query"
import {apiClient} from '../client'
import { orderService } from "../services/orderService"

export const useGetOrders = () => useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
        const {data} = await orderService.getOrders()
        console.log('Orders:Usegetorder', data);
        return data
    }
})