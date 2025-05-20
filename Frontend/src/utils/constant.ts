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
    GET_ALL_TRAINERS: `${ADMIN_ROUTE}/trainers`,
    UPDATE_CLIENT_STATUS: `${ADMIN_ROUTE}/clients/updateStatus`,
    UPDATE_TRAINER_STATUS:`${ADMIN_ROUTE}/trainers/updateStatus`
}