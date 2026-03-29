'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ToothChart from '@/components/crm/dental/ToothChart';

interface Patient {
  id: number; iin: string | null; firstName: string; lastName: string; middleName: string | null;
  phone: string; email: string | null; dateOfBirth: string | null; gender: string | null;
  address: string | null; insuranceNumber: string | null; insuranceCompany: string | null;
  notes: string | null; source: string | null; createdAt: string;
}

interface Appointment {
  id: number; doctorId: number; startTime: string; endTime: string; status: string; notes: string | null;
}

interface ToothRecord {
  id?: number; toothNumber: number; status: string; notes: string | null;
}

interface TreatmentPlan {
  id: number; title: string; status: string; totalCost: number; createdAt: string;
  items: { id: number; description: string; toothNumber: number | null; cost: number; status: string }[];
}

const statusLabels: Record<string, string> = {
  scheduled: 'Запланирован', confirmed: 'Подтверждён', in_progress: 'Идёт приём',
  completed: 'Завершён', cancelled: 'Отменён', no_show: 'Не пришёл',
};

const toothStatuses = [
  { value: 'healthy', label: 'Здоров' }, { value: 'caries', label: 'Кариес' },
  { value: 'filling', label: 'Пломба' }, { value: 'crown', label: 'Коронка' },
  { value: 'missing', label: 'Отсутствует' }, { value: 'implant', label: 'Имплант' },
  { value: 'root', label: 'Корень' }, { value: 'bridge', label: 'Мост' },
  { value: 'treatment_needed', label: 'Требует лечения' },
];

const planStatusLabels: Record<string, string> = {
  draft: 'Черновик', approved: 'Утверждён', in_progress: 'Выполняется', completed: 'Завершён', cancelled: 'Отменён',
};

export default function PatientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tab, setTab] = useState<'info' | 'teeth' | 'plans' | 'history'>('info');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [teeth, setTeeth] = useState<ToothRecord[]>([]);
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [toothModal, setToothModal] = useState<{ num: number; status: string } | null>(null);
  const [toothNotes, setToothNotes] = useState('');

  const fetchData = useCallback(async () => {
    const [patientRes, teethRes, plansRes] = await Promise.all([
      fetch(`/api/crm/patients/${id}`),
      fetch(`/api/crm/teeth?patientId=${id}`),
      fetch(`/api/crm/treatment-plans?patientId=${id}`),
    ]);
    const patientData = await patientRes.json();
    const teethData = await teethRes.json();
    const plansData = await plansRes.json();

    setPatient(patientData.patient);
    setAppointments(patientData.appointments || []);
    setTeeth(teethData.teeth || []);
    setPlans(plansData.plans || []);
    setForm(Object.fromEntries(
      Object.entries(patientData.patient || {}).map(([k, v]) => [k, v?.toString() || ''])
    ));
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/crm/patients/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    if (res.ok) { const updated = await res.json(); setPatient(updated); setEditing(false); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Удалить пациента?')) return;
    await fetch(`/api/crm/patients/${id}`, { method: 'DELETE' });
    router.push('/crm/patients');
  };

  const handleToothClick = (num: number, currentStatus: string) => {
    const record = teeth.find(t => t.toothNumber === num);
    setToothModal({ num, status: currentStatus });
    setToothNotes(record?.notes || '');
  };

  const saveToothStatus = async (status: string) => {
    if (!toothModal) return;
    await fetch('/api/crm/teeth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId: parseInt(id as string), toothNumber: toothModal.num, status, notes: toothNotes }),
    });
    setToothModal(null);
    // Refresh teeth
    const res = await fetch(`/api/crm/teeth?patientId=${id}`);
    const data = await res.json();
    setTeeth(data.teeth || []);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Загрузка...</div>;
  if (!patient) return <div className="p-8 text-center text-red-500">Пациент не найден</div>;

  const tabs = [
    { key: 'info', label: 'Данные' },
    { key: 'teeth', label: 'Зубная формула' },
    { key: 'plans', label: 'Планы лечения' },
    { key: 'history', label: 'История записей' },
  ];

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/crm/patients" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{patient.lastName} {patient.firstName} {patient.middleName || ''}</h1>
        </div>
        <div className="flex gap-2">
          {tab === 'info' && !editing && (
            <>
              <button onClick={() => setEditing(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">Редактировать</button>
              <button onClick={handleDelete} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition">Удалить</button>
            </>
          )}
          {tab === 'info' && editing && (
            <>
              <button onClick={handleSave} disabled={saving} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">{saving ? 'Сохранение...' : 'Сохранить'}</button>
              <button onClick={() => setEditing(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">Отмена</button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Info */}
      {tab === 'info' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Фамилия', name: 'lastName' }, { label: 'Имя', name: 'firstName' },
              { label: 'Отчество', name: 'middleName' }, { label: 'Телефон', name: 'phone' },
              { label: 'Email', name: 'email' }, { label: 'ИИН', name: 'iin' },
              { label: 'Дата рождения', name: 'dateOfBirth', type: 'date' },
              { label: 'Источник', name: 'source' },
              { label: 'Страховая', name: 'insuranceCompany' }, { label: 'Полис', name: 'insuranceNumber' },
            ].map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                {editing ? (
                  <input name={f.name} type={f.type || 'text'} value={form[f.name] || ''} onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" />
                ) : (
                  <p className="text-sm text-gray-900">{(patient as unknown as Record<string, string>)[f.name] || '-'}</p>
                )}
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Пол</label>
              {editing ? (
                <select name="gender" value={form.gender || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900">
                  <option value="">—</option><option value="male">М</option><option value="female">Ж</option>
                </select>
              ) : (
                <p className="text-sm text-gray-900">{patient.gender === 'male' ? 'Мужской' : patient.gender === 'female' ? 'Женский' : '-'}</p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Адрес</label>
            {editing ? <input name="address" value={form.address || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" />
              : <p className="text-sm text-gray-900">{patient.address || '-'}</p>}
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Заметки</label>
            {editing ? <textarea name="notes" rows={3} value={form.notes || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" />
              : <p className="text-sm text-gray-900">{patient.notes || '-'}</p>}
          </div>
        </div>
      )}

      {/* Tab: Teeth */}
      {tab === 'teeth' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Зубная формула</h2>
          <p className="text-xs text-gray-400 mb-3">Нажмите на зуб, чтобы изменить его статус</p>
          <ToothChart teeth={teeth} onToothClick={handleToothClick} />

          {/* Tooth status modal */}
          {toothModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setToothModal(null)}>
              <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="font-bold text-gray-900 mb-3">Зуб #{toothModal.num}</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {toothStatuses.map((s) => (
                    <button key={s.value} onClick={() => saveToothStatus(s.value)}
                      className={`px-2 py-2 rounded-lg text-xs font-medium border transition ${toothModal.status === s.value ? 'bg-amber-500 text-white border-amber-500' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
                <textarea placeholder="Заметка к зубу..." value={toothNotes} onChange={(e) => setToothNotes(e.target.value)} rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm mb-3" />
                <button onClick={() => setToothModal(null)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm transition">Закрыть</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Treatment Plans */}
      {tab === 'plans' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Планы лечения</h2>
          </div>
          {plans.length === 0 ? (
            <p className="text-sm text-gray-400">Нет планов лечения</p>
          ) : (
            <div className="space-y-4">
              {plans.map((plan) => (
                <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{plan.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      plan.status === 'completed' ? 'bg-green-100 text-green-700' :
                      plan.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      plan.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{planStatusLabels[plan.status] || plan.status}</span>
                  </div>
                  <p className="text-sm text-amber-600 font-medium mb-2">{(plan.totalCost || 0).toLocaleString()} тг</p>
                  {plan.items && plan.items.length > 0 && (
                    <div className="space-y-1">
                      {plan.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm py-1 border-t border-gray-50">
                          <span className="text-gray-700">
                            {item.toothNumber ? `#${item.toothNumber} — ` : ''}{item.description}
                          </span>
                          <span className="text-gray-500">{(item.cost || 0).toLocaleString()} тг</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: History */}
      {tab === 'history' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">История записей</h2>
          {appointments.length === 0 ? (
            <p className="text-sm text-gray-400">Нет записей</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{new Date(apt.startTime).toLocaleDateString('ru')}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(apt.startTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {new Date(apt.endTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                    apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{statusLabels[apt.status] || apt.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
