import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY!, // Fallback to anon key if service role not available
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists with this email
    // Try admin API first, fallback to regular auth if service role not available
    let userExists = false;
    
    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.warn('Admin API not available, using fallback method:', error.message);
        // Fallback: try to sign in with the email (this will fail but give us info)
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: 'dummy-password-for-check'
        });
        
        // If the error is about invalid credentials, the user exists
        // If the error is about user not found, the user doesn't exist
        userExists = Boolean(signInError?.message.toLowerCase().includes('invalid') || 
                    signInError?.message.toLowerCase().includes('wrong') ||
                    signInError?.message.toLowerCase().includes('incorrect'));
      } else {
        userExists = data.users.some(user => user.email === email);
      }
    } catch (fallbackError) {
      console.error('Both admin and fallback methods failed:', fallbackError);
      // If we can't check, assume email is available to avoid blocking legitimate users
      userExists = false;
    }

    return NextResponse.json({
      exists: userExists,
      message: userExists 
        ? 'An account with this email address already exists' 
        : 'Email is available'
    });

  } catch (error) {
    console.error('Error in check-email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 