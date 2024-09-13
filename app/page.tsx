'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/signup');
    router.push('/login');
  }, [router]);

  return null; // or you could return a loading indicator here
}
