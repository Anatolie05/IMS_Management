'use client';

import { useAuthStore } from '@/contexts/AuthContext';
import { useThemeStore } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                IMS System
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="border-transparent text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/ims"
                className="border-transparent text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                IMS
              </Link>
              <Link
                href="/merge"
                className="border-transparent text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Merges
              </Link>
              <Link
                href="/tags"
                className="border-transparent text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Tags
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/users"
                  className="border-transparent text-slate-600 dark:text-slate-300 hover:border-primary-500 hover:text-slate-900 dark:hover:text-slate-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                >
                  Users
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {user?.fullName} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mr-2"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-700">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className="block pl-3 pr-4 py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-l-4 border-transparent hover:border-primary-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/ims"
              className="block pl-3 pr-4 py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-l-4 border-transparent hover:border-primary-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              IMS
            </Link>
            <Link
              href="/merge"
              className="block pl-3 pr-4 py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-l-4 border-transparent hover:border-primary-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Merges
            </Link>
            <Link
              href="/tags"
              className="block pl-3 pr-4 py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-l-4 border-transparent hover:border-primary-500 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tags
            </Link>
            {user?.role === 'ADMIN' && (
              <Link
                href="/users"
                className="block pl-3 pr-4 py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-l-4 border-transparent hover:border-primary-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Users
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-500 dark:bg-primary-600">
                  <span className="text-sm font-medium leading-none text-white">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </span>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-slate-800 dark:text-slate-200">{user?.fullName}</div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{user?.role}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
