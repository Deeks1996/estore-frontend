'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Define routes where the Navbar should be hidden
  const hideNavbarOn = ['/signin', '/signup', '/admin/sign-in', '/admin/sign-up'];
  
  // Dynamic route hiding
  const hideNavbar = hideNavbarOn.includes(pathname) || pathname.startsWith('/admin/');
  
  const showLayout = !hideNavbar;

  return (
    <>
      {/* Free Shipping Banner (modern scroll effect using CSS) */}
      {showLayout && (
        <div className="fixed top-0 w-full z-50 bg-yellow-200 text-center py-1">
          <div className="text-sm font-medium overflow-hidden whitespace-nowrap">
            <span className="animate-marquee">🚚 Free Shipping on Orders Over 500!</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      {showLayout && (
        <div className="pt-6 fixed top-1 w-full z-40">
          <Navbar />
        </div>
      )}

      {/* Main content */}
      <main className={showLayout ? 'pt-[80px]' : ''}>{children}</main>

      {/* Footer */}
      {showLayout && (
        <footer className="bg-black  text-white text-center py-6">
          <p>&copy; {new Date().getFullYear()} E-Store. All rights reserved.</p>
        </footer>
      )}
    </>
  );
}
