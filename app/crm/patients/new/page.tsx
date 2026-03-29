'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    phone: '',
    email: '',
    iin: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    insuranceNumber: '',
    insuranceCompany: '',
    notes: '',
    source: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/crm/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка создания');
      }

      router.push('/crm/patients');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/crm/patients" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Новый пациент</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {/* ФИО */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия *</label>
            <input
              name="lastName"
              required
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
            <input
              name="firstName"
              required
              value={form.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Отчество</label>
            <input
              name="middleName"
              value={form.middleName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
            />
          </div>
        </div>

        {/* Контакты */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
            <input
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="+7 (7xx) xxx-xx-xx"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
            />
          </div>
        </div>

        {/* Личные данные */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ИИН</label>
            <input
              name="iin"
              maxLength={12}
              value={form.iin}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата рождения</label>
            <input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пол</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
            >
              <option value="">Не указан</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
        </div>

        {/* Адрес */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
          />
        </div>

        {/* Страховка */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Страховая компания</label>
            <input
              name="insuranceCompany"
              value={form.insuranceCompany}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Номер полиса</label>
            <input
              name="insuranceNumber"
              value={form.insuranceNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
            />
          </div>
        </div>

        {/* Заметки */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Заметки</label>
          <textarea
            name="notes"
            rows={3}
            value={form.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
          />
        </div>

        {/* Источник */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Откуда узнал о клинике</label>
          <select
            name="source"
            value={form.source}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
          >
            <option value="">Не указан</option>
            <option value="website">Сайт</option>
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="referral">По рекомендации</option>
            <option value="walk-in">Пришёл сам</option>
            <option value="other">Другое</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <Link
            href="/crm/patients"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium transition"
          >
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}
