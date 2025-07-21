import { Order } from '@/types/order.type'
import {apiClient} from '../client'

export const orderService = {
    getOrders: () => apiClient.get('/orders'),
    createOrder: (orderData: Order) => apiClient.post('/orders', orderData),
    updateOrderStatus: (orderData:{orderId: string, status: string}) => { 
       return apiClient.put(`/orders/${orderData.orderId}/status`, { status: orderData.status }) 
    },
}