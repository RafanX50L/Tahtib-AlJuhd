export const chatEnum = Object.freeze({
  error: "error",
  joinRoom : "join-room",
  joinChat: "joinChat",
  joined: "joined",
  sendMessage: "sendMessage",
  receive: "receive_message",
  sendNotification: "sendNotification",
  receiveNotification: "receiveNotification",
  joinUser: "joinUser",
  videoState : "changevidostate",
  audioState : "audiostatechange",
  signal : "signal",
  userConnected : "userConnected",
  joinmeet : "join-meet",
}as const);

export type ChatEvent = keyof typeof chatEnum;