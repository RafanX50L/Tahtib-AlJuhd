"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionDto = void 0;
class SessionDto {
    static async mapToISessionData(raw) {
        return raw.map((session) => ({
            id: session.id.toString(),
            trainerId: session.trainerId.toString(),
            clientId: session.clientId.toString(),
            startTime: session.startTime.toDateString(),
            endTime: session.endTime.toDateString(),
            status: session.status,
            meetingLink: session.meetingLink ?? null,
            createdAt: session.createdAt.toDateString(),
            updatedAt: session.createdAt.toDateString(),
        }));
    }
}
exports.SessionDto = SessionDto;
//# sourceMappingURL=SessionDTO.js.map