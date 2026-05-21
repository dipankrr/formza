import { TRPCError } from "@trpc/server";
import type { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";

export class ApiError extends TRPCError {
  constructor(
    code: TRPC_ERROR_CODE_KEY,
    message: string,
    cause?: unknown
  ) {
    super({
      code,
      message,
      cause,
    });
  }
}

/* =========================
   Auth errors
========================= */

export class UserAlreadyExistsError extends ApiError {
  constructor(
    message = "User already exists",
    cause?: unknown
  ) {
    super("CONFLICT", message, cause);
  }
}

export class InvalidCredentialsError extends ApiError {
  constructor(
    message = "Invalid email or password",
    cause?: unknown
  ) {
    super("UNAUTHORIZED", message, cause);
  }
}

export class EmailNotVerifiedError extends ApiError {
  constructor(
    message = "Email not verified",
    cause?: unknown
  ) {
    super("FORBIDDEN", message, cause);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(
    message = "Authentication required",
    cause?: unknown
  ) {
    super("UNAUTHORIZED", message, cause);
  }
}

export class ForbiddenError extends ApiError {
  constructor(
    message = "Permission denied",
    cause?: unknown
  ) {
    super("FORBIDDEN", message, cause);
  }
}

/* =========================
   Resource errors
========================= */

export class UserNotFoundError extends ApiError {
  constructor(
    message = "User not found",
    cause?: unknown
  ) {
    super("NOT_FOUND", message, cause);
  }
}

export class ResourceNotFoundError extends ApiError {
  constructor(
    message = "Resource not found",
    cause?: unknown
  ) {
    super("NOT_FOUND", message, cause);
  }
}

/* =========================
   Validation errors
========================= */

export class ValidationError extends ApiError {
  constructor(
    message = "Invalid input",
    cause?: unknown
  ) {
    super("BAD_REQUEST", message, cause);
  }
}

export class ConflictError extends ApiError {
  constructor(
    message = "Conflict occurred",
    cause?: unknown
  ) {
    super("CONFLICT", message, cause);
  }
}

/* =========================
   Rate limiting
========================= */

export class RateLimitExceededError extends ApiError {
  constructor(
    message = "Too many requests",
    cause?: unknown
  ) {
    super("TOO_MANY_REQUESTS", message, cause);
  }
}

/* =========================
   Server errors
========================= */

export class InternalServerError extends ApiError {
  constructor(
    message = "Something went wrong",
    cause?: unknown
  ) {
    super("INTERNAL_SERVER_ERROR", message, cause);
  }
}