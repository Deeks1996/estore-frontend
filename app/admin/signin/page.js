'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {toast, Toaster} from 'react-hot-toast';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      toast.success('Login Successful');
        setTimeout(()=>{
          router.push('/admin/dashboard');
        },2000);
    } catch (err) {
      console.error(err);
      setError('An error occurred during login');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/signin-banner.jpg')",
      }}
    >
      {/* Overlay blur */}
      <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>

      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-3xl hover:bg-opacity-70 transition-all">
        <ArrowLeft size={18} /> Back
      </Link>

      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: mounted ? 30 : 0 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Admin Sign In
          </h2>

          {/* Displaying error message */}
          {error && (
            <div className="text-red-500 font-semibold text-lg text-center py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full mb-3 px-4 py-2 border rounded"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-2 rounded-md"
            >
              Sign In
            </button>
          </form>

          <p className="text-lg text-center text-semibold mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/admin/signup" className="text-blue-900 hover:text-green-500 transition">
              Sign Up
            </Link>
          </p>
        </motion.div>
      )}
      <Toaster/>
    </div>
  )
}
