'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

const roleLabels: Record<string, string> = {
  superadmin: 'Суперадмин',
  doctor: 'Врач',
  receptionist: 'Регистратор',
  assistant: 'Ассистент',
};

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left: Breadcrumb / Title */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Dr. Abayevich CRM
        </h2>
      </div>

      {/* Right: User info */}
      <div className="flex items-center gap-4">
        {/* Link to public site */}
        <Link
          href="/"
          target="_blank"
          className="text-sm text-gray-500 hover:text-amber-600 transition"
        >
          Сайт
        </Link>

        {/* Link to admin */}
        <Link
          href="/admin/dashboard"
          className="text-sm text-gray-500 hover:text-amber-600 transition"
        >
          Админ
        </Link>

        {/* User */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {session?.user?.name || 'Пользователь'}
            </p>
            <p className="text-xs text-gray-500">
              {roleLabels[(session?.user as { role?: string })?.role || ''] || 'Пользователь'}
            </p>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {(session?.user?.name || 'U')[0].toUpperCase()}
            </span>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-gray-400 hover:text-red-500 transition"
              title="Выйти"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
