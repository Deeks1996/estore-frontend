'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/nextjs';
import { useCart } from '../app/context/CartContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User';

  return (
    <header className="fixed w-full bg-black  shadow-md z-50">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3 relative">
        {/* Logo */}
        <div className="flex-shrink-0 text-white text-2xl font-bold">
          <Link href="/">EStore</Link>
        </div>

        {/* Hamburger menu for mobile */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Nav links (desktop) */}
        <ul className="absolute left-1/2 transform -translate-x-1/2 lg:flex hidden space-x-8 text-white font-medium">
          <li className="hover:text-blue-300"><Link href="/">Home</Link></li>
          <li className="hover:text-blue-300"><Link href="/products">Products</Link></li>
          <li className="hover:text-blue-300"><Link href="/orders">Orders</Link></li>
          <li className="hover:text-blue-300"><Link href="/contact">Contact</Link></li>
        </ul>

        {/* Right side (desktop) */}
        <div className="hidden lg:flex items-center space-x-4">
          <button onClick={handleCartClick} className="relative">
            <ShoppingCart className="w-6 h-6 text-white hover:text-blue-300" />
            <SignedIn>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </SignedIn>
          </button>

          <SignedIn>
            <span className="text-white mr-2">Welcome, {fullName}</span>
            <SignOutButton>
              <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition">
                Sign Out
              </button>
            </SignOutButton>
          </SignedIn>

          <SignedOut>
            <button
              onClick={handleSignIn}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-400 transition"
            >
              Sign In
            </button>
          </SignedOut>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-black text-white px-4 pb-4">
          <ul className="flex flex-col space-y-2 font-medium mb-4">
            <li><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link href="/products" onClick={() => setMenuOpen(false)}>Products</Link></li>
            <li><Link href="/orders" onClick={() => setMenuOpen(false)}>Orders</Link></li>
            <li><Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          </ul>

          <div className="flex items-center justify-between">
            <button onClick={handleCartClick} className="relative">
              <ShoppingCart className="w-6 h-6 text-white hover:text-blue-300" />
              <SignedIn>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </SignedIn>
            </button>

            <SignedIn>
              <SignOutButton>
                <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition">
                  Sign Out
                </button>
              </SignOutButton>
            </SignedIn>

            <SignedOut>
              <button
                onClick={handleSignIn}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
}
