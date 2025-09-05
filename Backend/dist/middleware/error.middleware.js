import { HttpError } from "../utils/http-error.util";
import { HttpStatus } from "../constants/status.constant";
import { HttpResponse } from "../constants/response-message.constant";
import logger from "../utils/logger.utils";
export const errorHandler = (err, _req, res) => {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = HttpResponse.SERVER_ERROR;
    console.log('err', err.message);
    if (err instanceof HttpError) {
        logger.error("Errors:", err);
        statusCode = err.statusCode;
        message = err.message;
    }
    else {
        logger.error("unhandled error:", err);
    }
    res.status(statusCode).json({ error: message });
};
//# sourceMappingURL=error.middleware.js.map