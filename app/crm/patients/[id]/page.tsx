'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Patient {
  id: number;
  iin: string | null;
  firstName: string;
  lastName: string;
  middleName: string | null;
  phone: string;
  email: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  insuranceNumber: string | null;
  insuranceCompany: string | null;
  notes: string | null;
  source: string | null;
  createdAt: string;
}

interface Appointment {
  id: number;
  doctorId: number;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
}

const statusLabels: Record<string, string> = {
  scheduled: 'Запланирован', confirmed: 'Подтверждён', in_progress: 'Идёт приём',
  completed: 'Завершён', cancelled: 'Отменён', no_show: 'Не пришёл',
};

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Patient>>({});

  useEffect(() => {
    fetch(`/api/crm/patients/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPatient(data.patient);
        setAppointments(data.appointments || []);
        setForm(data.patient);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/crm/patients/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      setPatient(updated);
      setEditing(false);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Удалить пациента? Это действие можно отменить.')) return;
    await fetch(`/api/crm/patients/${id}`, { method: 'DELETE' });
    router.push('/crm/patients');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Загрузка...</div>;
  if (!patient) return <div className="p-8 text-center text-red-500">Пациент не найден</div>;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/crm/patients" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {patient.lastName} {patient.firstName} {patient.middleName || ''}
          </h1>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <button onClick={() => setEditing(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Редактировать
              </button>
              <button onClick={handleDelete} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition">
                Удалить
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSave} disabled={saving} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button onClick={() => { setEditing(false); setForm(patient); }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">
                Отмена
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient info */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Данные пациента</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Фамилия', name: 'lastName' },
              { label: 'Имя', name: 'firstName' },
              { label: 'Отчество', name: 'middleName' },
              { label: 'Телефон', name: 'phone' },
              { label: 'Email', name: 'email' },
              { label: 'ИИН', name: 'iin' },
              { label: 'Дата рождения', name: 'dateOfBirth', type: 'date' },
              { label: 'Источник', name: 'source' },
              { label: 'Страховая компания', name: 'insuranceCompany' },
              { label: 'Номер полиса', name: 'insuranceNumber' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
                {editing ? (
                  <input
                    name={field.name}
                    type={field.type || 'text'}
                    value={(form as Record<string, string | null>)[field.name] || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{(patient as unknown as Record<string, string | null>)[field.name] || '-'}</p>
                )}
              </div>
            ))}

            {editing ? (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Пол</label>
                <select name="gender" value={form.gender || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm">
                  <option value="">Не указан</option>
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Пол</label>
                <p className="text-sm text-gray-900">{patient.gender === 'male' ? 'Мужской' : patient.gender === 'female' ? 'Женский' : '-'}</p>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Адрес</label>
            {editing ? (
              <input name="address" value={form.address || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" />
            ) : (
              <p className="text-sm text-gray-900">{patient.address || '-'}</p>
            )}
          </div>

          {/* Notes */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Заметки</label>
            {editing ? (
              <textarea name="notes" rows={3} value={form.notes || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm" />
            ) : (
              <p className="text-sm text-gray-900">{patient.notes || '-'}</p>
            )}
          </div>
        </div>

        {/* Appointments history */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">История записей</h2>
          {appointments.length === 0 ? (
            <p className="text-sm text-gray-400">Нет записей</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(apt.startTime).toLocaleDateString('ru')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(apt.startTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {new Date(apt.endTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                    apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                    apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {statusLabels[apt.status] || apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
