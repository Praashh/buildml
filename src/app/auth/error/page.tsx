
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
      <p className="mt-2 text-gray-600">
        {error === 'CredentialsSignin'
          ? 'Invalid email or password.'
          : 'An unexpected error occurred during authentication.'}
      </p>
      <Link href="/signin" className="mt-4 text-blue-500 underline">
        Back to Sign In
      </Link>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}
