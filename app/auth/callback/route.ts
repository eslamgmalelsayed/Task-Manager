import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/';

  console.log('Auth callback - type:', type);
  console.log('Auth callback - next:', next);

  // For password recovery, always redirect to reset password page
  // Supabase handles the session creation automatically
  if (type === 'recovery') {
    console.log('Password recovery callback - redirecting to reset password');
    return NextResponse.redirect(`${origin}/reset-password`);
  }

  // For other auth flows, redirect to the next URL or home
  console.log('Redirecting to:', next);
  return NextResponse.redirect(`${origin}${next}`);
} 