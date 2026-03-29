'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

export default function NewDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    specialization: '',
    experience: '',
    education: '',
    bio: '',
    workPhone: '',
    personalPhone: '',
    color: '#3B82F6',
    slotDuration: '30',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/crm/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, experience: parseInt(form.experience) || 0, slotDuration: parseInt(form.slotDuration) || 30 }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка');
      }
      router.push('/crm/doctors');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/crm/doctors" className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Новый врач</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ФИО *</label>
          <input name="name" required value={form.name} onChange={handleChange} placeholder="Абаев Арман Сериков" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Специализация *</label>
            <input name="specialization" required value={form.specialization} onChange={handleChange} placeholder="Ортодонт" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Стаж (лет)</label>
            <input name="experience" type="number" min="0" value={form.experience} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Образование</label>
          <input name="education" value={form.education} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Рабочий телефон</label>
            <input name="workPhone" value={form.workPhone} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Личный телефон</label>
            <input name="personalPhone" value={form.personalPhone} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Цвет в расписании</label>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button key={c} type="button" onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-full border-2 transition ${form.color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Длительность слота (мин)</label>
          <select name="slotDuration" value={form.slotDuration} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900">
            <option value="15">15 минут</option>
            <option value="30">30 минут</option>
            <option value="45">45 минут</option>
            <option value="60">60 минут</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">О враче</label>
          <textarea name="bio" rows={3} value={form.bio} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" />
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition">
            {loading ? 'Сохранение...' : 'Добавить врача'}
          </button>
          <Link href="/crm/doctors" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium transition">
            Отмена
          </Link>
        </div>
      </form>
    </div>
  );
}
