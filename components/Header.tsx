'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-white shadow-md flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Dr. Abayevich Dental Clinic"
                width={80}
                height={80}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-gray-900 font-bold text-lg leading-tight">Dr. Abayevich</div>
              <div className="text-yellow-600 text-xs font-semibold">dental clinic</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-yellow-600 transition font-medium">
              Главная
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-yellow-600 transition font-medium">
              Услуги и цены
            </Link>
            <Link href="/doctors" className="text-gray-700 hover:text-yellow-600 transition font-medium">
              Врачи
            </Link>
            <Link href="/reviews" className="text-gray-700 hover:text-yellow-600 transition font-medium">
              Отзывы
            </Link>
            <Link href="/contacts" className="text-gray-700 hover:text-yellow-600 transition font-medium">
              Контакты
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="text-right mr-4">
              <a href="tel:+77006472376" className="block font-bold text-lg text-gray-900 hover:text-yellow-600 transition">
                +7 (700) 647-23-76
              </a>
              <p className="text-xs text-gray-500">Ежедневно 9:00 - 20:00</p>
            </div>
            <Link
              href="/appointment"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
            >
              Записаться на приём
            </Link>
            <a
              href="https://wa.me/77006472376"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-lg font-semibold transition shadow-md hover:shadow-lg"
              title="WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
            <Link
              href="/"
              className="block text-gray-700 hover:text-yellow-600 transition font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Главная
            </Link>
            <Link
              href="/services"
              className="block text-gray-700 hover:text-yellow-600 transition font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Услуги и цены
            </Link>
            <Link
              href="/doctors"
              className="block text-gray-700 hover:text-yellow-600 transition font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Врачи
            </Link>
            <Link
              href="/reviews"
              className="block text-gray-700 hover:text-yellow-600 transition font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Отзывы
            </Link>
            <Link
              href="/contacts"
              className="block text-gray-700 hover:text-yellow-600 transition font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Контакты
            </Link>
            <div className="pt-4 space-y-3 border-t border-gray-200">
              <a href="tel:+77006472376" className="block text-center font-bold text-lg text-gray-900">
                +7 (700) 647-23-76
              </a>
              <Link
                href="/appointment"
                className="block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Записаться на приём
              </Link>
              <a
                href="https://wa.me/77006472376"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
