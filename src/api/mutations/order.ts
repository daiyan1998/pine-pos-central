import {useMutation, useQueryClient} from '@tanstack/react-query'
import { orderService } from '../services/orderService'

export const useCreateOrder = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (orderData: any) => {
            const {data} = await orderService.createOrder(orderData)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['orders']})
            queryClient.invalidateQueries({queryKey: ['tables']})
        }
    })
}

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (orderData: {orderId: string, status: string}) => {
            const {data} = await orderService.updateOrderStatus(orderData)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['orders']})
        }
    })
}