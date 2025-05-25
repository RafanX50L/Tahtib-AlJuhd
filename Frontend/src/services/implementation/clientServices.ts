import { AxiosError } from 'axios'
import api from './api';
import { CLIENT_ROUTES } from '../../utils/constant'

export const ClientService = {
    generateFitnessPlan: async (userData) => {
        try {
            const response = await api.post(CLIENT_ROUTES.GENERATE_FITNESS_PLAN,userData);
            return {data: response.data}
        } catch (error:unknown) {
            const err = error as AxiosError<{error: string}>;
            const errorMessage = err.response?.data.error || "Failed to generate fitness plan";
            console.log('Error creating fitness Plan: ',errorMessage );
            throw new Error(errorMessage);
        }
    }
}