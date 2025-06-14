"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ 
  children 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Define route categories
  const authPages = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];

  const isAuthPage = authPages.some(page => pathname.startsWith(page));

  useEffect(() => {
    if (loading) return;

    // Case 1: User not authenticated and not on auth pages → redirect to login
    if (!user && !isAuthPage) {
      console.log('Redirecting to login: User not authenticated');
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        router.push('/login');
      }, 100);
      return () => clearTimeout(timer);
    }

    // Case 2: User authenticated but trying to access auth pages → redirect to home
    // Exception: Allow authenticated users on reset-password page (password recovery flow)
    if (user && isAuthPage && !pathname.startsWith('/reset-password')) {
      console.log('Redirecting to home: Authenticated user on auth page');
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        router.push('/');
      }, 100);
      return () => clearTimeout(timer);
    }

    // Case 3: Reset redirecting state if no redirect needed
    setIsRedirecting(false);
  }, [user, loading, pathname, router, isAuthPage]);

  // Show loading during initial auth check
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading during redirects
  if (isRedirecting) {
    // Auto-reset redirecting state after 3 seconds to prevent getting stuck
    setTimeout(() => {
      setIsRedirecting(false);
    }, 3000);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {!user ? 'Redirecting to login...' : 'Redirecting to home...'}
          </p>
        </div>
      </div>
    );
  }

  // Block access if auth requirements not met
  if (!user && !isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to access this page.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Block authenticated users from auth pages
  // Exception: Allow authenticated users on reset-password page (password recovery flow)
  if (user && isAuthPage && !pathname.startsWith('/reset-password')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Already Logged In</h2>
          <p className="text-gray-600 mb-4">You're already authenticated.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 