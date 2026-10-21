"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionDto = void 0;
const timezone_utils_1 = require("../../utils/timezone.utils");
class SessionDto {
    static async mapToISessionData(raw, timezone = 'UTC') {
        return raw.map((session) => {
            const startLocal = (0, timezone_utils_1.utcToLocalDateTime)(session.startTime, timezone);
            const endLocal = (0, timezone_utils_1.utcToLocalDateTime)(session.endTime, timezone);
            return {
                id: session.id.toString(),
                trainerId: session.trainerId.toString(),
                clientId: session.clientId.toString(),
                startTime: session.startTime.toISOString(), // Keep UTC for API consistency
                endTime: session.endTime.toISOString(), // Keep UTC for API consistency
                startTimeLocal: startLocal.time, // Add local time for display
                endTimeLocal: endLocal.time, // Add local time for display
                startDateLocal: startLocal.date, // Add local date for display
                endDateLocal: endLocal.date, // Add local date for display
                status: session.status,
                meetingLink: session.meetingLink ?? null,
                createdAt: session.createdAt.toDateString(),
                updatedAt: session.createdAt.toDateString(),
            };
        });
    }
}
exports.SessionDto = SessionDto;
//# sourceMappingURL=SessionDTO.js.map