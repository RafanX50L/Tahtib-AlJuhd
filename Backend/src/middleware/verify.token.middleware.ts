import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { UserModel } from "@/models/user.model";
import { createHttpError, verifyAccessToken } from "@/utils";
import { NextFunction, Request, Response } from "express";

export interface AddedRequest extends Request {
  user?: {
    id: string;
    role: "client" | "admin" | "trainer";
    tokenVersion: number;
  };
}
// ✅ Base verification: any user
export function verifyAnyToken() {
  return verifyTokenInternal(); // same logic, but no role check
}

// ✅ Role-specific verification
export function verifyToken(requiredRole: "client" | "admin" | "trainer") {
  return verifyTokenInternal(requiredRole);
}

// Internal reusable logic
function verifyTokenInternal(requiredRole?: "client" | "admin" | "trainer") {
  return async (req: AddedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(
        createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN)
      );
    }

    const token = authHeader.split(" ")[1];
    try {
      const payload = verifyAccessToken(token);
      if (!payload || typeof payload !== "object") {
        return next(
          createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED)
        );
      }

      const { id, role, tokenVersion } = payload as {
        id?: string;
        role?: string;
        tokenVersion?: number;
      };

      if (!id || !role || !["client", "admin", "trainer"].includes(role)) {
        return next(
          createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED)
        );
      }

      // ✅ If a role was required, enforce it
      if (requiredRole && role !== requiredRole) {
        return next(
          createHttpError(HttpStatus.FORBIDDEN, HttpResponse.UNAUTHORIZED)
        );
      }

      // validate user in DB
      const user = await UserModel.findById(id);
      if (!user)
        return next(createHttpError(HttpStatus.NOT_FOUND, "User not found"));
      if (user.isBlocked) {
        return next(
          createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.USER_IS_BLOKED)
        );
      }
      if (user.tokenVersion !== tokenVersion) {
        return next(
          createHttpError(HttpStatus.UNAUTHORIZED, "Invalid token version")
        );
      }

      req.user = {
        id,
        role: role as "client" | "admin" | "trainer",
        tokenVersion,
      };

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(
          createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED)
        );
      }
      return next(createHttpError(HttpStatus.UNAUTHORIZED, "Invalid token"));
    }
  };
}

export const restrictTo = (...roles: string[]) => {
  return (req: AddedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};
