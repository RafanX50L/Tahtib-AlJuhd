export class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
;
export const createHttpError = (statusCode, message) => {
    return new HttpError(statusCode, message);
};
//# sourceMappingURL=http-error.util.js.map