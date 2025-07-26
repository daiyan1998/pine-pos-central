import {useMutation, useQueryClient} from '@tanstack/react-query'
import {authService} from '../services/authService'
import { useNavigate } from 'react-router-dom'

export const useLogin = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async (userData: {email: string, password: string}) => {
            const {data} = await authService.login(userData.email, userData.password)
            return data
        },
        onSuccess: (data) => {
            const token = data.data?.accessToken
            localStorage.setItem('authToken', token)
            queryClient.invalidateQueries({queryKey: ['user']})
            navigate('/')
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

export const useLogout = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async () => {
            const {data} = await authService.logout()
            return data
        },
        onSuccess: () => {
            localStorage.removeItem('authToken')
            queryClient.invalidateQueries({queryKey: ['user']})
            navigate('/login')
        }
    })
}