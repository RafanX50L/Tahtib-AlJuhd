import { AxiosError, get } from 'axios'
import api from './api';
import { CLIENT_ROUTES } from '../../utils/constant'

export const ClientService = {

    // service for cleint fitness plan generation

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
    },

    // Services for workouts pages

    getBasicFitnessDetails: async () =>{
        try {
            const response = await api.get(CLIENT_ROUTES.GET_BASIC_FITNESS_DETAILS);
            console.log('basic finess response: ', response.data);
            return {data: response.data}
        } catch (error:unknown) {
            const err = error as AxiosError<{error: string}>;
            const errorMessage = err.response?.data.error || "Failed to fetch basic fitness details";
            console.log('Error fetching basic fitness details: ',errorMessage );
            throw new Error(errorMessage);
        }
    },

    getWorkouts: async (week:number)=>{
        try {
            const response = await api.get(`${CLIENT_ROUTES.GET_CLIENT_WORKOUTS}/${week}`);
            console.log('workouts response: ', response.data);
            return {data: response.data}
        } catch (error:unknown) {
            const err = error as AxiosError<{error: string}>;
            const errorMessage = err.response?.data.error || "Failed to fetch workouts";
            console.log('Error fetching workouts: ',errorMessage );
            throw new Error(errorMessage);
        }
    },
    
    getWeekCompletionStatus: async () => {
        try {
            const response = await api.get(CLIENT_ROUTES.GET_WEEK_COMPLETION_STATUS);
            console.log('week completion status response: ', response.data);
            return {data: response.data}
        } catch (error:unknown) {
            const err = error as AxiosError<{error: string}>;
            const errorMessage = err.response?.data.error || "Failed to fetch week completion status";
            console.log('Error fetching week completion status: ',errorMessage );
            throw new Error(errorMessage);
        }
    },

    updateDayCompletionAndGetWorkoutReport: async(workout:any, currentDay:string, currentWeek:string) => {
        console.log('Updating day completion for workout:', workout, 'currentDay:', currentDay, 'currentWeek:', currentWeek);
        try {
            const response = await api.patch(`${CLIENT_ROUTES.UPDATE_DAY_COMPLETION_STATUS}`, { workout, day:currentDay, week:currentWeek });
            console.log('Updated workout response: ', response.data);
            return { data: response.data }
        } catch (error: unknown) {
            const err = error as AxiosError<{ error: string }>;
            const errorMessage = err.response?.data.error || "Failed to update day completion";
            console.log('Error updating day completion: ', errorMessage);
            throw new Error(errorMessage);
        }
    },

    getWorkoutReport: async (week:string,day:string) => {
        try {
            console.log('Fetching workout report for week:', week, 'day:', day);
            const response = await api.get(`${CLIENT_ROUTES.GET_WORKOUT_REPORT}?week=${week}&day=${day}`);
            console.log('Workout report response: ', response.data);
            return {data: response.data}
        } catch (error:unknown) {
            const err = error as AxiosError<{error: string}>;
            const errorMessage = err.response?.data.error || "Failed to fetch workout report";
            console.log('Error fetching workout report: ',errorMessage );
            throw new Error(errorMessage);
        }
    }

}