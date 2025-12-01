'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, LogOut, User } from 'lucide-react'

interface NavbarProps {
  userRole?: 'user' | 'admin' | 'owner'
  userName?: string
}

export default function Navbar({ userRole, userName }: NavbarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Rakna</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {userRole === 'admin' && (
              <Link
                href="/dashboard/admin"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/admin')
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Admin Dashboard
              </Link>
            )}
            {userRole === 'owner' && (
              <Link
                href="/dashboard/owner"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/owner')
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Owner Dashboard
              </Link>
            )}
            {userRole === 'user' && (
              <Link
                href="/dashboard/user"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard/user')
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                User Dashboard
              </Link>
            )}
            {userName && (
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">{userName}</span>
              </div>
            )}
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

