import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, createHttpError } from "../utils";
import { HttpResponse } from "../constants/response-message.constant";
import { HttpStatus } from "../constants/status.constant";
import { UserModel } from "../models/user.model";

export interface AddedRequest extends Request {
  user?: {
    id: string;
    role: "client" | "admin" | "trainer";
    tokenVersion: number;
  };
}

export default function verifyToken(userLevel: "client" | "admin" | "trainer") {
  return async (
    req: AddedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
 
    const authHeader = req.headers.authorization;

    console.log("Authorization header:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No or invalid Authorization header");
      return next(
        createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN)
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("No token provided");
      return next(
        createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN)
      );
    }

    try {
      const payload = verifyAccessToken(token);
      if (!payload || typeof payload !== "object") {
        console.log("Invalid or missing payload");
        return next(
          createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED)
        );
      }

      const { id, role, tokenVersion } = payload as {
        id?: string;
        role?: string;
        tokenVersion?: number;
      };

      if (
        !id ||
        !role ||
        !["client", "admin", "trainer"].includes(role) ||
        tokenVersion === undefined
      ) {
        console.log("Invalid payload structure:", { id, role, tokenVersion });
        return next(
          createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED)
        );
      }

      if (role !== userLevel) {
        console.log(`Role mismatch: required ${userLevel}, got ${role}`);
        return next(
          createHttpError(HttpStatus.FORBIDDEN, HttpResponse.UNAUTHORIZED)
        );
      }

      // Validate X-Token-Version header
      const headerTokenVersion = req.headers["x-token-version"];
      console.log("Header token version:", headerTokenVersion);
      if (headerTokenVersion && Number(headerTokenVersion) !== tokenVersion) {
        console.log(
          `Header token version mismatch: header ${headerTokenVersion}, token ${tokenVersion}`
        );
        return next(
          createHttpError(
            HttpStatus.UNAUTHORIZED,
            "Invalid token version in header"
          )
        );
      }

      // Verify user and tokenVersion in database
      const user = await UserModel.findById(id);
      if (!user) {
        console.log(`User not found for ID: ${id}`);
        return next(createHttpError(HttpStatus.NOT_FOUND, "User not found"));
      }

      if (user.isBlocked) {
        console.log(`User is blocked: ${id}`);
        return next(
          createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.USER_IS_BLOKED)
        );
      }

      if (user.tokenVersion !== tokenVersion) {
        console.log(
          `Token version mismatch: expected ${user.tokenVersion}, got ${tokenVersion}`
        );
        return next(
          createHttpError(HttpStatus.UNAUTHORIZED, "Invalid token version")
        );
      }

      req.user = {
        id: id,
        role: role as "client" | "admin" | "trainer",
        tokenVersion,
      };
      console.log(
        `Token verified successfully for user: ${id}, role: ${role}, tokenVersion: ${tokenVersion}`
      );

      next();
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "name" in error && "message" in error) {
        const err = error as { name: string; message: string };
        console.error("Token verification error:", err.name, err.message);

        if (err.name === "TokenExpiredError") {
          return next(
            createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED)
          );
        }
        if (err.name === "JsonWebTokenError") {
          return next(createHttpError(HttpStatus.UNAUTHORIZED, "Invalid token"));
        }
      } else {
        console.error("Token verification error:", error);
      }
      return next(
        createHttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Token verification failed"
        )
      );
    }
  };
}
