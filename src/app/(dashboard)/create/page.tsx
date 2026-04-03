'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();

  // The create workflow now lives entirely in the CreateModal.
  // Redirect to dashboard if someone navigates here directly.
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen text-muted">
      Redirecting...
    </div>
  );
}
