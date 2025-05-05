'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Power } from 'lucide-react'
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter();

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Products', href: '/admin/dashboard/products' },
    { name: 'Categories', href: '/admin/dashboard/categories' },
    { name: 'Orders', href: '/admin/dashboard/orders' },
  ];

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      <aside className={`fixed z-30 transition-transform duration-300 bg-slate-800 shadow-lg h-full w-64 p-4 text-white
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Admin</h2>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X />
          </button>
        </div>
        <nav className="space-y-2">
          {links.map(link => (
            <Link key={link.name} href={link.href} className={`block px-4 py-2 rounded hover:bg-gray-200 hover:text-black transition
              ${pathname === link.href ? 'bg-blue-900 font-semibold text-white' : ''}`}>
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>


      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
     
      <header className="flex items-center px-4 py-3 bg-slate-800 shadow-md">
        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-white">
          <Menu />
        </button>

        <div className="flex items-center space-x-4 ml-auto">
          <span className="text-sm font-medium text-white">Welcome, Admin</span>
          <img
            src="/admin-avatar.png"
            alt="admin"
            className="w-8 h-8 rounded-full"
          />
          <button
            onClick={handleLogout}
            className="text-white hover:text-red-600 transition"
            title="Logout"
          >
            <Power className="w-5 h-5" />
          </button>
        </div>
      </header>

        <main className="p-3 animate-fade-in">    {children}
        </main>
      </div>
    </div>
  )
}
