"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Mail, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AuthGuard from "@/components/AuthGuard";

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage(null);

    try {
      // Get the email from URL params or localStorage if available
      const urlParams = new URLSearchParams(window.location.search);
      const email =
        urlParams.get("email") || localStorage.getItem("registrationEmail");

      if (!email) {
        setResendMessage({
          type: "error",
          text: "Email address not found. Please try registering again.",
        });
        return;
      }

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        setResendMessage({
          type: "error",
          text: error.message,
        });
      } else {
        setResendMessage({
          type: "success",
          text: "Verification email sent successfully! Please check your inbox.",
        });
      }
    } catch {
      setResendMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsResending(false);
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
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h2>

            <p className="text-gray-600 mb-6">
              We&apos;ve sent a verification link to your email address. Please
              check your inbox and click the link to verify your account.
            </p>

            {/* Message Display */}
            {resendMessage && (
              <div
                className={`mb-4 p-4 rounded-lg flex items-center ${
                  resendMessage.type === "success"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {resendMessage.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                )}
                <span
                  className={`text-sm ${
                    resendMessage.type === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {resendMessage.text}
                </span>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Didn&apos;t receive the email? Check your spam folder or{" "}
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="text-blue-600 hover:text-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    "resend verification email"
                  )}
                </button>
              </p>

              <Link
                href="/login"
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
