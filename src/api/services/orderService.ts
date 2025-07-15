import { Order } from '@/types/order.type'
import {apiClient} from '../client'

export const orderService = {
    getOrders: () => apiClient.get('/orders'),
    createOrder: (orderData: Order) => apiClient.post('/orders', orderData),
}