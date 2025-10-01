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
  GET_APPROVED_TRAINERS: `${ADMIN_ROUTE}/trainers/approved/`,
  BLOCK_OR_UNBLOCK: `${ADMIN_ROUTE}/block-or-unblock`,
  GET_ALL_TRAINERS: `${ADMIN_ROUTE}/trainers`,
  UPDATE_CLIENT_STATUS: `${ADMIN_ROUTE}/clients/updateStatus`,
  UPDATE_TRAINER_STATUS: `${ADMIN_ROUTE}/trainers/updateStatus`,
  SCHEDULE_INTERVIEW: `${ADMIN_ROUTE}/trainers/interview/schedule`,
  SUBMIT_INTERVIEW_FEEDBACK: `${ADMIN_ROUTE}/trainers/submit-interview-feedback`,
  APPROVE_TRAINER: `${ADMIN_ROUTE}/trainers/approve`,
  REJECT_TRAINER: `${ADMIN_ROUTE}/trainers/reject`,
  DASHBOARD_STATS: `${ADMIN_ROUTE}/dashboard/stats`,
  DASHBOARD_REVENUE: `${ADMIN_ROUTE}/dashboard/revenue`,
  DASHBOARD_TOP_TRAINERS: `${ADMIN_ROUTE}/dashboard/top-trainers`,
  DASHBOARD_RECENT_PAYMENTS: `${ADMIN_ROUTE}/dashboard/recent-payments`,
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
  TRAINER: `${CLIENT_ROUTE}/trainer`,
  GET_DIET_PLAN: `${CLIENT_ROUTE}/diet-plan`,
  CHAT_BOT_INTERACTION:(sessionId: string)=> `${CLIENT_ROUTE}/chatBot/sessions/${sessionId}/interactions`,
  CHAT_BOT_SESSIONS:`${CLIENT_ROUTE}/chatBot/sessions`,
  PURCHASE_PLAN: `${CLIENT_ROUTE}/purchase-plan`,
  CURRENT_TRAINER: `${CLIENT_ROUTE}/current-trainer`,
  CURRENT_TRAINER_CONTRACT: `${CLIENT_ROUTE}/current-trainer/contract`,
  CURRENT_TRAINER_MESSAGES: `${CLIENT_ROUTE}/current-trainer/messages`,
  AVAILABILITY: `${CLIENT_ROUTE}/availability`,
  NOTIFICATIONS: `${CLIENT_ROUTE}/notifications`,
  // Progress
  PROGRESS: `${CLIENT_ROUTE}/progress`,
  PROGRESS_CURRENT: `${CLIENT_ROUTE}/progress/current`,
  PROGRESS_GRAPH: `${CLIENT_ROUTE}/progress/graph`,
  PROGRESS_PREVIEW: `${CLIENT_ROUTE}/progress/preview`,
};

const TRAINER_ROUTE = "/trainer";
export const TRAINER_ROUTES = {
  GET_PENDING_TRAINER_APPLICATION: `${TRAINER_ROUTE}/application-data`,
  SUBMIT_TRAINER_APPLICATION: `${TRAINER_ROUTE}/submit-application`,
  GET_PROFILE_DATA: `${TRAINER_ROUTE}/profile-data`,
  UPDATE_TRAINER_PROFILE_PHOTO: `${TRAINER_ROUTE}/update-profile-photo`,
  UPDATE_TRAINER_PROFILE: `${TRAINER_ROUTE}/update-profile`,
  PLAN: `${TRAINER_ROUTE}/plan`,
  AVAILABILITY: `${TRAINER_ROUTE}/availability`,
  SALARY: `${TRAINER_ROUTE}/salary`,
  CLIENTS: `${TRAINER_ROUTE}/clients`,
  CHAT: `${TRAINER_ROUTE}/chat`,
  DASHBOARD_STATS: `${TRAINER_ROUTE}/dashboard/stats`,
  DASHBOARD_TRENDS: `${TRAINER_ROUTE}/dashboard/trends`,
  DASHBOARD_PAYMENTS: `${TRAINER_ROUTE}/dashboard/payments`,
};


export const COMMUNITY_ROUTES = {
  FEED: `/community/feed`,

  // Posts
  POSTS: `/community/posts`,
  POST: (postId: string) => `/community/posts/${postId}`,
  POST_COMMENTS: (postId: string) => `/community/posts/${postId}/comments`,
  TOGGLE_LIKE: (postId: string) => `/community/posts/${postId}/like`,

  // Users
  USER_POSTS: (userId: string) => `/community/user/${userId}/posts`,
  USER_PROFILE: (userId: string) => `/community/user/${userId}/profile`,

  // Follow / Unfollow
  FOLLOW: (targetUserId: string) => `/community/follow/${targetUserId}`,
  UNFOLLOW: (targetUserId: string) => `/community/follow/${targetUserId}`,

  // Search
  SEARCH: `/community/search`,
};


export const NOTIFICATION_ROUTES = {
  BASE: `/notifications`,

  LAST_FIVE: `/notifications/last-five`,
  BASE_DETAILS: `/notifications/base-details`,

  GET_NOTIFICATIONS: `/notifications`,

  MARK_AS_READ: (notificationId: string) =>
    `/notifications/${notificationId}/read`,

  MARK_ALL_AS_READ: `/notifications/mark-all-read`,

  DELETE: (notificationId: string) => `/notifications/${notificationId}`,
};


export const SCHEDULING_ROUTES = {
  TRAINER_AVAILABILITY: (trainerId: string) =>
    `/scheduling/trainers/${trainerId}/availability`,

  BOOKINGS: `/scheduling/bookings`,

  BOOKING: (bookingId: string) => `/scheduling/bookings/${bookingId}`,
  CANCEL_BOOKING: (bookingId: string) =>
    `/scheduling/bookings/${bookingId}/cancel`,
  COMPLETE_BOOKING: (bookingId: string) =>
    `/scheduling/bookings/${bookingId}/complete`,
};
