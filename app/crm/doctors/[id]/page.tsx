'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
const dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

interface Doctor {
  id: number; name: string; specialization: string; experience: number;
  education: string | null; bio: string | null; workPhone: string | null;
  personalPhone: string | null; color: string | null; slotDuration: number | null;
}

interface ScheduleItem {
  dayOfWeek: number; startTime: string; endTime: string; isActive: boolean;
}

export default function DoctorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tab, setTab] = useState<'info' | 'schedule'>('info');
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [schedSaving, setSchedSaving] = useState(false);

  const fetchData = useCallback(async () => {
    const [docRes, schedRes] = await Promise.all([
      fetch(`/api/crm/doctors/${id}`),
      fetch(`/api/crm/doctors/${id}/schedule`),
    ]);
    const docData = await docRes.json();
    const schedData = await schedRes.json();
    setDoctor(docData.doctor);
    setForm({
      name: docData.doctor?.name || '', specialization: docData.doctor?.specialization || '',
      experience: docData.doctor?.experience?.toString() || '0', education: docData.doctor?.education || '',
      bio: docData.doctor?.bio || '', workPhone: docData.doctor?.workPhone || '',
      personalPhone: docData.doctor?.personalPhone || '', color: docData.doctor?.color || '#3B82F6',
      slotDuration: docData.doctor?.slotDuration?.toString() || '30',
    });

    // Initialize schedule for all 7 days
    const existingSchedule = schedData.schedules || [];
    const fullSchedule = Array.from({ length: 7 }, (_, i) => {
      const existing = existingSchedule.find((s: ScheduleItem) => s.dayOfWeek === i);
      return existing || { dayOfWeek: i, startTime: '09:00', endTime: '18:00', isActive: false };
    });
    setSchedule(fullSchedule);
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/crm/doctors/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, experience: parseInt(form.experience) || 0, slotDuration: parseInt(form.slotDuration) || 30 }),
    });
    if (res.ok) { const updated = await res.json(); setDoctor(updated); setEditing(false); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Архивировать врача?')) return;
    await fetch(`/api/crm/doctors/${id}`, { method: 'DELETE' });
    router.push('/crm/doctors');
  };

  const handleScheduleSave = async () => {
    setSchedSaving(true);
    await fetch(`/api/crm/doctors/${id}/schedule`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedules: schedule }),
    });
    setSchedSaving(false);
  };

  const updateScheduleDay = (dayOfWeek: number, field: string, value: string | boolean) => {
    setSchedule(schedule.map(s => s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Загрузка...</div>;
  if (!doctor) return <div className="p-8 text-center text-red-500">Врач не найден</div>;

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/crm/doctors" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: doctor.color || '#3B82F6' }}>{doctor.name[0]}</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
            <p className="text-sm text-gray-500">{doctor.specialization}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {tab === 'info' && !editing && (
            <>
              <button onClick={() => setEditing(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">Редактировать</button>
              <button onClick={handleDelete} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition">Архивировать</button>
            </>
          )}
          {tab === 'info' && editing && (
            <>
              <button onClick={handleSave} disabled={saving} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">{saving ? '...' : 'Сохранить'}</button>
              <button onClick={() => setEditing(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">Отмена</button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button onClick={() => setTab('info')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'info' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Профиль</button>
        <button onClick={() => setTab('schedule')} className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === 'schedule' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Расписание</button>
      </div>

      {/* Tab: Info */}
      {tab === 'info' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-500 mb-1">ФИО</label><input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Специализация</label><input name="specialization" value={form.specialization} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Стаж (лет)</label><input name="experience" type="number" value={form.experience} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Слот (мин)</label>
                  <select name="slotDuration" value={form.slotDuration} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm">
                    <option value="15">15</option><option value="30">30</option><option value="45">45</option><option value="60">60</option>
                  </select></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Образование</label><input name="education" value={form.education} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Раб. телефон</label><input name="workPhone" value={form.workPhone} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Личный телефон</label><input name="personalPhone" value={form.personalPhone} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">Цвет</label><div className="flex gap-2">{colors.map(c => (<button key={c} type="button" onClick={() => setForm({...form, color: c})} className={`w-8 h-8 rounded-full border-2 ${form.color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`} style={{backgroundColor: c}} />))}</div></div>
              <div><label className="block text-xs font-medium text-gray-500 mb-1">О враче</label><textarea name="bio" rows={3} value={form.bio} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" /></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {[['Специализация', doctor.specialization], ['Стаж', `${doctor.experience} лет`], ['Образование', doctor.education], ['Раб. телефон', doctor.workPhone], ['Личный телефон', doctor.personalPhone], ['Слот', `${doctor.slotDuration || 30} мин`], ['О враче', doctor.bio]].map(([l, v]) => (
                <div key={l as string}><p className="text-xs font-medium text-gray-500">{l}</p><p className="text-sm text-gray-900">{v || '-'}</p></div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Schedule */}
      {tab === 'schedule' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Рабочие часы</h2>
            <button onClick={handleScheduleSave} disabled={schedSaving} className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              {schedSaving ? 'Сохранение...' : 'Сохранить расписание'}
            </button>
          </div>
          <div className="space-y-3">
            {schedule.map((day) => (
              <div key={day.dayOfWeek} className={`flex items-center gap-4 p-3 rounded-lg border transition ${day.isActive ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                <label className="flex items-center gap-2 w-36 shrink-0">
                  <input type="checkbox" checked={day.isActive} onChange={(e) => updateScheduleDay(day.dayOfWeek, 'isActive', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
                  <span className={`text-sm font-medium ${day.isActive ? 'text-gray-900' : 'text-gray-400'}`}>{dayNames[day.dayOfWeek]}</span>
                </label>
                {day.isActive && (
                  <div className="flex items-center gap-2">
                    <input type="time" value={day.startTime} onChange={(e) => updateScheduleDay(day.dayOfWeek, 'startTime', e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" />
                    <span className="text-gray-400">—</span>
                    <input type="time" value={day.endTime} onChange={(e) => updateScheduleDay(day.dayOfWeek, 'endTime', e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" />
                  </div>
                )}
                {!day.isActive && <span className="text-xs text-gray-400">Выходной</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
