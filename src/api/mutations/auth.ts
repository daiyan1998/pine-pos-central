import {useMutation, useQueryClient} from '@tanstack/react-query'
import {authService} from '../services/authService'

export const useLogin = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userData: {email: string, password: string}) => {
            const {data} = await authService.login(userData.email, userData.password)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['user']})
        },
        onError: (error) => {
            console.error('Login failed:', error)
        }
    })
}

export const useRegister = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userData: {email: string, password: string, name: string}) => {
            const {data} = await authService.register(userData)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['user']})
        }
    })
}