import { env } from "@/config/env";

export const HOST = env.PUBLIC_DOMAIN; 

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
    GET_APPROVED_TRAINERS: `${ADMIN_ROUTE}/approved-trainers`,
    BLOCK_OR_UNBLOCK: `${ADMIN_ROUTE}/block-or-unblock`,
    GET_ALL_TRAINERS: `${ADMIN_ROUTE}/trainers`,
    UPDATE_CLIENT_STATUS: `${ADMIN_ROUTE}/clients/updateStatus`,
    UPDATE_TRAINER_STATUS:`${ADMIN_ROUTE}/trainers/updateStatus`,
    SCHEDULE_INTERVIEW: `${ADMIN_ROUTE}/trainers/schedule-interview`,
    SUBMIT_INTERVIEW_FEEDBACK: `${ADMIN_ROUTE}/trainers/submit-interview-feedback`,
    APPROVE_TRAINER: `${ADMIN_ROUTE}/trainers/approve`,
    REJECT_TRAINER: `${ADMIN_ROUTE}/trainers/reject`,
}

const CLIENT_ROUTE = "/client";

export const CLIENT_ROUTES = {
    GET_CLIENT_PROFILE: `${CLIENT_ROUTE}/get-clinet-profile`,
    UPDATE_CLIENT_PROFILE: `${CLIENT_ROUTE}/update-profile`,
    GENERATE_FITNESS_PLAN: `${CLIENT_ROUTE}/generate-fitness-plan`,
    GET_BASIC_FITNESS_DETAILS: `${CLIENT_ROUTE}/get-basic-fitness-details`,
    GET_CLIENT_WORKOUTS: `${CLIENT_ROUTE}/get-workouts`,
    GET_WEEK_COMPLETION_STATUS: `${CLIENT_ROUTE}/get-week-completion-status`,
    UPDATE_DAY_COMPLETION_STATUS: `${CLIENT_ROUTE}/update-day-completion-status`,
    GET_WORKOUT_REPORT: `${CLIENT_ROUTE}/get-workout-report`,
    GET_WEEKLY_CHALLENGES: `${CLIENT_ROUTE}/get-weekly-challenges`,
    JOIN_WEEKLY_CHALLENGE: `${CLIENT_ROUTE}/join-weekly-challenge`,
    UPDATE_DAY_COMPLETION_OF_WEEKLY_CHALLENGE_STATUS: `${CLIENT_ROUTE}/update-day-completion-of-weekly-challenge-status`,
    UPDATE_CLIENT_PROFILE_PHOTO: `${CLIENT_ROUTE}/update-client-profile-photo`
};

const TRAINER_ROUTE = "/trainer";
export const TRAINER_ROUTES = {
    GET_PENDING_TRAINER_APPLICATION:`${TRAINER_ROUTE}/application-data`,
    SUBMIT_TRAINER_APPLICATION: `${TRAINER_ROUTE}/submit-application`,
    GET_PROFILE_DATA: `${TRAINER_ROUTE}/profile-data`,
    UPDATE_TRAINER_PROFILE_PHOTO:`${TRAINER_ROUTE}/update-trainer-profile-photo`,
    UPDATE_TRAINER_PROFILE: `${TRAINER_ROUTE}/update-profile`,
}