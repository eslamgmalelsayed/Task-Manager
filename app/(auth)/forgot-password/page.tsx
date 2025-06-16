"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, X, Mail, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/types/auth";
import AuthGuard from "@/components/AuthGuard";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback?type=recovery&next=/reset-password`;
      console.log("Sending reset email with redirectTo:", redirectUrl);

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        setMessage({
          type: "error",
          text: error.message,
        });
      } else {
        setMessage({
          type: "success",
          text: "Password reset instructions have been sent to your email.",
        });
        setEmailSent(true);
      }
    } catch {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <Link href="/" className="flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">TaskFlow</span>
            </div>
          </Link>

          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {!emailSent ? (
              <>
                {/* Message Display */}
                {message && (
                  <div
                    className={`mb-4 p-4 rounded-lg flex items-center ${
                      message.type === "success"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 mr-3" />
                    )}
                    <span
                      className={`text-sm ${
                        message.type === "success"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {message.text}
                    </span>
                  </div>
                )}

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("email")}
                        type="email"
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.email ? "border-red-300" : "border-gray-300"
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={!isValid || isLoading}
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending Reset Email...
                        </>
                      ) : (
                        "Send Reset Email"
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Check Your Email
                </h3>

                <p className="text-gray-600 mb-6">
                  We&apos;ve sent password reset instructions to your email
                  address. Please check your inbox and follow the link to reset
                  your password.
                </p>

                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Didn&apos;t receive the email? Check your spam folder or{" "}
                    <button
                      onClick={() => {
                        setEmailSent(false);
                        setMessage(null);
                      }}
                      className="text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
                    >
                      try again
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Back to Login */}
            <div className="mt-6">
              <Link
                href="/login"
                className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
