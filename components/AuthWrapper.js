
'use client';

import { useUser } from '@clerk/nextjs';

export default function AuthWrapper({ children }) {
  const { user, isLoaded } = useUser();

  
  if (!isLoaded) return null; 

  return <>{children}</>;
}
