import * as z from "zod";

// OAuth Provider types
export type OAuthProvider = "google" | "github";

// Password strength levels
export enum PasswordStrength {
    VERY_WEAK = 0,
    WEAK = 1,
    FAIR = 2,
    GOOD = 3,
    STRONG = 4,
}

export const PASSWORD_STRENGTH_LABELS: Record<PasswordStrength, string> = {
    [PasswordStrength.VERY_WEAK]: "Very Weak",
    [PasswordStrength.WEAK]: "Weak",
    [PasswordStrength.FAIR]: "Fair",
    [PasswordStrength.GOOD]: "Good",
    [PasswordStrength.STRONG]: "Strong",
};

export const PASSWORD_STRENGTH_COLORS: Record<PasswordStrength, string> = {
    [PasswordStrength.VERY_WEAK]: "bg-red-500",
    [PasswordStrength.WEAK]: "bg-orange-500",
    [PasswordStrength.FAIR]: "bg-yellow-500",
    [PasswordStrength.GOOD]: "bg-blue-500",
    [PasswordStrength.STRONG]: "bg-green-500",
};

// Form validation schemas
export const registerSchema = z
    .object({
        fullName: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(
                /[^A-Za-z0-9]/,
                "Password must contain at least one special character"
            ),
        confirmPassword: z.string(),
        acceptTerms: z.boolean().refine(val => val === true, {
            message: "You must accept the terms and conditions",
        }),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(
                /[^A-Za-z0-9]/,
                "Password must contain at least one special character"
            ),
        confirmPassword: z.string(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

// Inferred types from schemas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Auth state types
export interface AuthState {
    isAuthenticated: boolean;
    user: {
        id: string;
        email: string;
        fullName?: string;
        avatarUrl?: string;
    } | null;
    isLoading: boolean;
}

// Auth error types
export interface AuthError {
    message: string;
    code?: string;
    details?: string;
}

// Helper functions for password strength
export const calculatePasswordStrength = (password: string): PasswordStrength => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength as PasswordStrength;
}; 