/** 
 * Routes accessible publicly (no login required)
 */
export const publicRoutes: string[] = [
    "/auth/sign-in",
];

/**
 * Routes that require authentication
 */
export const protectedRoutes: string[] = [
    "/",
];

/**
 * Routes that should NOT be visited when logged in
 * (login, signup, etc.)
 */
export const authRoutes: string[] = [
    "/auth/sign-in",
];

/**
 * API routes that don't require auth
 */
export const apiAuthPrefix: string = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT = "/"
