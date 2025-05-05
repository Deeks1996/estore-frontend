"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState(""); 
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to check password strength
  const checkPasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    const mediumRegex = /^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)).{6,}$/;

    if (strongRegex.test(password)) return 'strong';
    if (mediumRegex.test(password)) return 'medium';
    return 'weak';
  };

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
  }, [password]);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'strong':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-400';
      case 'weak':
        return 'bg-red-500';
      default:
        return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[A-Za-z0-9_]{5,15}$/; // Username validation: alphanumeric and underscores, 5-15 characters

    if (!usernameRegex.test(username)) {
      setError("Username must be 5-15 characters long and can only contain letters, numbers, and underscores.");
      return;
    }

    if (!nameRegex.test(name)) {
      setError("Name should contain only alphabets and spaces");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending:", { username, name, email, password });

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          name,
          email,
          password,
          role:"user"
        }),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user || data));
        toast.success("Sign Up Successful");

        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err); 
      setError("An error occurred while signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: "url('/signin-banner.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>

      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-3xl hover:bg-opacity-70 transition-all">
        <ArrowLeft size={18} /> Back
      </Link>

      {mounted && (
        <motion.div initial={{ opacity: 0, y: mounted ? 30 : 0 }} animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="relative z-10 bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-2">Create Account</h1>
          <p className="text-center mb-6">Please sign up for an account</p>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                id="username"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <input
                type="text"
                id="name"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            <div>
              <input
                type="email"
                id="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
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
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white py-2 rounded-md"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-lg text-center text-semibold mt-4">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-900 hover:text-green-500 transition">
              Sign In
            </Link>
          </p>
        </motion.div>
      )}
      <Toaster />
    </div>
  );
}
