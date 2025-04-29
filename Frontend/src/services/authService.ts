
import api from './api'
import { AUTH_ROUTES } from "../utils/constant";
import axios from 'axios';

export const registerUser = async (formData: any) => {
  try {
    const response = await api.post(AUTH_ROUTES.REGISTER, formData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.response?.data.message || 'error.message');
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw "An unknown error occurred";
    }
  }
};
