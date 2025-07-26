"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    
    const isProtectedRoute = pathname.startsWith('/dashboard');
    const isLoginRoute = pathname === '/auth/login';

    if (!authToken && isProtectedRoute) {
      router.replace('/auth/login');
    } else if (authToken && isLoginRoute) {
      router.replace('/dashboard');
    }
    
    setIsLoading(false);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}