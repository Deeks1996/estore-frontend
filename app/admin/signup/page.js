'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import {toast, Toaster} from 'react-hot-toast';

export default function AdminSignUp() {
  const router = useRouter()

  const [mounted, setMounted] = useState(false)
  const [username, setUsername] = useState("");
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Function to handle password strength
  const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
    const mediumRegex = /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)).{6,}$/

    if (strongRegex.test(password)) return 'strong'
    if (mediumRegex.test(password)) return 'medium'
    return 'weak'
  }

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password))
  }, [password])

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong':
        return 'bg-green-500'
      case 'medium':
        return 'bg-yellow-400'
      case 'weak':
        return 'bg-red-500'
      default:
        return ''
    }
  }

  // Function to handle sign-up form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    const usernameRegex = /^[A-Za-z0-9_]{5,15}$/; 
    if (!usernameRegex.test(username)) {
      setError("Username must be 5-15 characters long and can only contain letters, numbers, and underscores.");
      return;
    }
    
    // Name validation: only alphabetic characters
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setError("Name should only contain alphabets");
      return;
    }

    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength === 'weak') {
      setError("Your password is too weak. Please use a stronger password.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password,username, role:"admin" }),
      });

      if (res.ok) {
        toast.success("Signup successful");
       setTimeout(()=>{
        router.push("/admin/dashboard");
       },2000);
      } 
      else 
      {
        const data = await res.json();
        setError(data?.error || "Error occurred while registering. Please try again.");
      }
    } catch (err) {
      setError("Error occurred while registering. Please try again.");
      console.error("Error Details: ", err); 
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: "url('/signin-banner.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>

      <Link href="/signin" className="absolute top-6 left-6 flex items-center gap-2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-3xl hover:bg-opacity-70 transition-all">
        <ArrowLeft size={18} /> Back
      </Link>

      {mounted && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="relative z-10 w-full max-w-md bg-gray-300 bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-2xl px-8 py-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Admin Sign Up</h2>

          {error && <p className="text-red-600 text-center text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">

              <input
                type="text"
                id="username"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              />

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

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

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-1">
                <div className="h-2 w-full bg-gray-200 rounded">
                  <div className={`h-2 rounded ${getStrengthColor()}`} style={{ width: passwordStrength === 'strong' ? '100%' : passwordStrength === 'medium' ? '66%' : '33%' }}></div>
                </div>
                <p className={`text-sm mt-1 ${passwordStrength === 'strong' ? 'text-green-600' : passwordStrength === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {passwordStrength === 'strong' && 'Strong Password'}
                  {passwordStrength === 'medium' && 'Medium Strength'}
                  {passwordStrength === 'weak' && 'Weak Password'}
                </p>
              </div>
            )}

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Real-Time Match Check */}
            {confirmPassword && (
              <div className="flex items-center gap-2 text-sm">
                {password === confirmPassword ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> Passwords match
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <XCircle size={16} /> Passwords don&apos;t match
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>

            <p className="text-center text-lg mt-4">
              Already have an account?{' '}
              <Link href="/admin/signin" className="text-blue-900 hover:text-green-500 transition">
                Sign In
              </Link>
            </p>
          </form>
        </motion.div>
      )}
      <Toaster/>
    </div>
  )
}
