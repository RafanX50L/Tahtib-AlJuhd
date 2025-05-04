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
};
