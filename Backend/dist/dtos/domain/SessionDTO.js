var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class SessionDto {
    static mapToISessionData(raw) {
        return __awaiter(this, void 0, void 0, function* () {
            return raw.map((session) => {
                var _a;
                return ({
                    id: session.id.toString(),
                    trainerId: session.trainerId.toString(),
                    clientId: session.clientId.toString(),
                    startTime: session.startTime.toDateString(),
                    endTime: session.endTime.toDateString(),
                    status: session.status,
                    meetingLink: (_a = session.meetingLink) !== null && _a !== void 0 ? _a : null,
                    createdAt: session.createdAt.toDateString(),
                    updatedAt: session.createdAt.toDateString(),
                });
            });
        });
    }
}
//# sourceMappingURL=SessionDTO.js.map