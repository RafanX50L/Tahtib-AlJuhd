export const HOST = "http://localhost:5000"; 

const AUTH_ROUTE = "/auth";

export const AUTH_ROUTES = {
    LOGIN: `${AUTH_ROUTE}/login`,
    REGISTER: `${AUTH_ROUTE}/register`,
    VERIFY_OTP: `${AUTH_ROUTE}/verify-otp`,
    RESEND_OTP: `${AUTH_ROUTE}/resend-otp`,
    FORGOT_PASSWORD: `${AUTH_ROUTE}/forgot-password`,
    RESET_PASSWORD: `${AUTH_ROUTE}/reset-password`,
    GOOGLE_SIGNUP: `${AUTH_ROUTE}/google-signup`,
    REFRESH_ACESS_TOKEN : `${AUTH_ROUTE}/refresh-Token`
};

const ADMIN_ROUTE = "/admin";

export const ADMIN_ROUTES = {
    GET_ALL_CLIENTS: `${ADMIN_ROUTE}/clients`,
    GET_PENDING_TRAINERS: `${ADMIN_ROUTE}/pending-trainers`,
    GET_ALL_TRAINERS: `${ADMIN_ROUTE}/trainers`,
    UPDATE_CLIENT_STATUS: `${ADMIN_ROUTE}/clients/updateStatus`,
    UPDATE_TRAINER_STATUS:`${ADMIN_ROUTE}/trainers/updateStatus`
}

const CLIENT_ROUTE = "/client";

export const CLIENT_ROUTES = {
    GENERATE_FITNESS_PLAN: `${CLIENT_ROUTE}/generate-fitness-plan`,
    GET_BASIC_FITNESS_DETAILS: `${CLIENT_ROUTE}/get-basic-fitness-details`,
    GET_CLIENT_WORKOUTS: `${CLIENT_ROUTE}/get-workouts`,
    GET_WEEK_COMPLETION_STATUS: `${CLIENT_ROUTE}/get-week-completion-status`,
    UPDATE_DAY_COMPLETION_STATUS: `${CLIENT_ROUTE}/update-day-completion-status`,
    GET_WORKOUT_REPORT: `${CLIENT_ROUTE}/get-workout-report`,
    GET_WEEKLY_CHALLENGES: `${CLIENT_ROUTE}/get-weekly-challenges`,
    JOIN_WEEKLY_CHALLENGE: `${CLIENT_ROUTE}/join-weekly-challenge`,
    UPDATE_DAY_COMPLETION_OF_WEEKLY_CHALLENGE_STATUS: `${CLIENT_ROUTE}/update-day-completion-of-weekly-challenge-status`
};

const TRAINER_ROUTE = "/trainer";
export const TRAINER_ROUTES = {
    SUBMIT_TRAINER_APPLICATION: `${TRAINER_ROUTE}/submit-application`,
}