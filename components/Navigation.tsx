"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, LogOut, Loader2 } from "lucide-react";

export default function Navigation() {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string, email: string) => {
    if (name && name !== 'User') {
      return name.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitials = user ? getUserInitials(userName, user.email || '') : 'U';

  if (loading) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">TaskFlow</span>
              </Link>
            </div>
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TaskFlow</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              /* Authenticated User */
              <>
                <Link
                  href="/todos"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Todos
                </Link>
                
                                 <div className="flex items-center space-x-3">
                   <div className="flex items-center space-x-3">
                     {/* User Avatar */}
                     <div className="relative">
                       {user.user_metadata?.avatar_url ? (
                         <Image
                           src={user.user_metadata.avatar_url}
                           alt={userName}
                           width={32}
                           height={32}
                           className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                         />
                       ) : (
                         <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                           {userInitials}
                         </div>
                       )}
                     </div>
                     
                     {/* User Name */}
                     <span className="text-sm text-gray-700 font-medium">{userName}</span>
                   </div>
                  
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center space-x-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              /* Non-authenticated User */
              <>
                <Link
                  href="/todos"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Todos
                </Link>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 