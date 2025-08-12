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
  REFRESH_ACESS_TOKEN: `${AUTH_ROUTE}/refresh-Token`,
};

const ADMIN_ROUTE = "/admin";

export const ADMIN_ROUTES = {
  GET_ALL_CLIENTS: `${ADMIN_ROUTE}/clients`,
  GET_PENDING_TRAINERS: `${ADMIN_ROUTE}/trainers/pending`,
  // GET_APPROVED_TRAINERS: `${ADMIN_ROUTE}/approved-trainers`,
  GET_APPROVED_TRAINERS: (page:number,limit:number,search:string)=>
    `${ADMIN_ROUTE}/trainers/approved/${page}/limit/${limit}/search/${search}`,
  BLOCK_OR_UNBLOCK: `${ADMIN_ROUTE}/block-or-unblock`,
  GET_ALL_TRAINERS: `${ADMIN_ROUTE}/trainers`,
  UPDATE_CLIENT_STATUS: `${ADMIN_ROUTE}/clients/updateStatus`,
  UPDATE_TRAINER_STATUS: `${ADMIN_ROUTE}/trainers/updateStatus`,
  SCHEDULE_INTERVIEW: `${ADMIN_ROUTE}/trainers/interview/schedule`,
  SUBMIT_INTERVIEW_FEEDBACK: `${ADMIN_ROUTE}/trainers/submit-interview-feedback`,
  APPROVE_TRAINER: `${ADMIN_ROUTE}/trainers/approve`,
  REJECT_TRAINER: `${ADMIN_ROUTE}/trainers/reject`,
};

const CLIENT_ROUTE = "/client";

export const CLIENT_ROUTES = {
  GET_CLIENT_PROFILE: `${CLIENT_ROUTE}/clinet-profile`,
  UPDATE_CLIENT_PROFILE: `${CLIENT_ROUTE}/update-profile`,
  GENERATE_PERSONALIZATION: `${CLIENT_ROUTE}/generate-personalization`,
  GET_BASIC_WORKOUT_DETAILS: `${CLIENT_ROUTE}/workout-details`,
  GET_CLIENT_WORKOUTS: `${CLIENT_ROUTE}/workouts`,
  GET_WEEK_COMPLETION_STATUS: `${CLIENT_ROUTE}/week-completion-status`,
  COMPLETE_DAILY_WORKOUT: `${CLIENT_ROUTE}/workouts/complete-daily`,
  GET_WORKOUT_REPORT: `${CLIENT_ROUTE}/get-workout-report`,
  GET_WEEKLY_CHALLENGES: `${CLIENT_ROUTE}/weekly-challenges`,
  JOIN_WEEKLY_CHALLENGE: `${CLIENT_ROUTE}/join-weekly-challenge`,
  MARK_CHALLENGE_DAY_COMPLETE: (challengeId: string, day: number) =>
  `${CLIENT_ROUTE}/challenges/${challengeId}/days/${day}/complete`,
  UPDATE_CLIENT_PROFILE_PHOTO: `${CLIENT_ROUTE}/update-profile-photo`,
  GET_AVAILABLE_TRAINERS: `${CLIENT_ROUTE}/trainers`,
  GET_DIET_PLAN: `${CLIENT_ROUTE}/diet-plan`,
  CHAT_BOT_INTERACTION:(sessionId: string)=> `${CLIENT_ROUTE}/chatBot/sessions/${sessionId}/interactions`,
  CHAT_BOT_SESSIONS:`${CLIENT_ROUTE}/chatBot/sessions`,
};

const TRAINER_ROUTE = "/trainer";
export const TRAINER_ROUTES = {
  GET_PENDING_TRAINER_APPLICATION: `${TRAINER_ROUTE}/application-data`,
  SUBMIT_TRAINER_APPLICATION: `${TRAINER_ROUTE}/submit-application`,
  GET_PROFILE_DATA: `${TRAINER_ROUTE}/profile-data`,
  UPDATE_TRAINER_PROFILE_PHOTO: `${TRAINER_ROUTE}/update-profile-photo`,
  UPDATE_TRAINER_PROFILE: `${TRAINER_ROUTE}/update-profile`,
  PLAN: `${TRAINER_ROUTE}/plan`,
  AVAILABILITY: `${TRAINER_ROUTE}/availability`
};
