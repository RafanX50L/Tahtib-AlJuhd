import api from "./api";
import { TRAINER_ROUTES } from "../../utils/constant";
import type { AxiosError } from 'axios';

export const TrainerService = {
    // Service for submitting trainer application
    submitTrainerApplication: async (applicationData: FormData) => {
        try {
            console.log('applicationData: ', applicationData);
            const response = await api.post(
                TRAINER_ROUTES.SUBMIT_TRAINER_APPLICATION,
                applicationData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return { data: response.data, ok: true };
        } catch (error: unknown) {
            const err = error as AxiosError<{ error?: string; message?: string }>;
            const errorMessage =
                err.response?.data.error ||
                err.response?.data.message ||
                "Failed to submit trainer application";
            console.log("Error submitting trainer application: ", errorMessage);
            throw new Error(errorMessage);
        }
    },
};