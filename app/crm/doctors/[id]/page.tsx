'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  education: string | null;
  bio: string | null;
  workPhone: string | null;
  personalPhone: string | null;
  color: string | null;
  slotDuration: number | null;
}

export default function DoctorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/crm/doctors/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setDoctor(data.doctor);
        setForm({
          name: data.doctor.name || '',
          specialization: data.doctor.specialization || '',
          experience: data.doctor.experience?.toString() || '0',
          education: data.doctor.education || '',
          bio: data.doctor.bio || '',
          workPhone: data.doctor.workPhone || '',
          personalPhone: data.doctor.personalPhone || '',
          color: data.doctor.color || '#3B82F6',
          slotDuration: data.doctor.slotDuration?.toString() || '30',
        });
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/crm/doctors/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, experience: parseInt(form.experience) || 0, slotDuration: parseInt(form.slotDuration) || 30 }),
    });
    if (res.ok) {
      const updated = await res.json();
      setDoctor(updated);
      setEditing(false);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Архивировать врача?')) return;
    await fetch(`/api/crm/doctors/${id}`, { method: 'DELETE' });
    router.push('/crm/doctors');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Загрузка...</div>;
  if (!doctor) return <div className="p-8 text-center text-red-500">Врач не найден</div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/crm/doctors" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: doctor.color || '#3B82F6' }}>
              {doctor.name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-sm text-gray-500">{doctor.specialization}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <button onClick={() => setEditing(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">Редактировать</button>
              <button onClick={handleDelete} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition">Архивировать</button>
            </>
          ) : (
            <>
              <button onClick={handleSave} disabled={saving} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">{saving ? 'Сохранение...' : 'Сохранить'}</button>
              <button onClick={() => setEditing(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">Отмена</button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
        {editing ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">ФИО</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Специализация</label>
                <input name="specialization" value={form.specialization} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Стаж (лет)</label>
                <input name="experience" type="number" value={form.experience} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Длительность слота</label>
                <select name="slotDuration" value={form.slotDuration} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm">
                  <option value="15">15 мин</option><option value="30">30 мин</option><option value="45">45 мин</option><option value="60">60 мин</option>
                </select>
              </div>
            </div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">Образование</label><input name="education" value={form.education} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Рабочий телефон</label><input name="workPhone" value={form.workPhone} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" /></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Личный телефон</label><input name="personalPhone" value={form.personalPhone} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" /></div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Цвет</label>
              <div className="flex gap-2">{colors.map((c) => (<button key={c} type="button" onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-full border-2 ${form.color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />))}</div>
            </div>
            <div><label className="block text-xs font-medium text-gray-500 mb-1">О враче</label><textarea name="bio" rows={3} value={form.bio} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" /></div>
          </>
        ) : (
          <div className="space-y-3">
            {[
              ['Специализация', doctor.specialization],
              ['Стаж', `${doctor.experience} лет`],
              ['Образование', doctor.education],
              ['Рабочий телефон', doctor.workPhone],
              ['Личный телефон', doctor.personalPhone],
              ['Длительность слота', `${doctor.slotDuration || 30} мин`],
              ['О враче', doctor.bio],
            ].map(([label, value]) => (
              <div key={label as string}>
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className="text-sm text-gray-900">{value || '-'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
