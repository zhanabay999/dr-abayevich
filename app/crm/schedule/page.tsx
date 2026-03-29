'use client';

import { useState, useEffect, useCallback } from 'react';

interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  startTime: string;
  endTime: string;
  status: string;
  color: string | null;
  notes: string | null;
}

interface Doctor {
  id: number;
  name: string;
  color: string | null;
  specialization: string;
}

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  phone: string;
}

const statusLabels: Record<string, string> = {
  scheduled: 'Запланирован',
  confirmed: 'Подтверждён',
  in_progress: 'Идёт приём',
  completed: 'Завершён',
  cancelled: 'Отменён',
  no_show: 'Не пришёл',
};

const statusColors: Record<string, string> = {
  scheduled: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show: 'bg-gray-100 text-gray-700',
};

export default function SchedulePage() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalDoctor, setModalDoctor] = useState<number | null>(null);
  const [modalHour, setModalHour] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [aptRes, docRes] = await Promise.all([
        fetch(`/api/crm/appointments?date=${date}`),
        fetch('/api/crm/doctors'),
      ]);
      const aptData = await aptRes.json();
      const docData = await docRes.json();
      setAppointments(aptData.appointments || []);
      setDoctors(docData.doctors || []);
    } catch (err) {
      console.error('Error fetching schedule:', err);
    }
    setLoading(false);
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

  const changeDate = (delta: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d.toISOString().split('T')[0]);
  };

  const getAppointmentsForDoctorHour = (doctorId: number, hour: number) => {
    return appointments.filter((apt) => {
      const aptHour = new Date(apt.startTime).getHours();
      return apt.doctorId === doctorId && aptHour === hour;
    });
  };

  const handleCellClick = (doctorId: number, hour: number) => {
    setModalDoctor(doctorId);
    setModalHour(hour);
    setShowModal(true);
  };

  const handleAppointmentCreated = () => {
    setShowModal(false);
    setModalDoctor(null);
    setModalHour(null);
    fetchData();
  };

  const dayOfWeek = new Date(date).toLocaleDateString('ru', { weekday: 'long' });
  const formattedDate = new Date(date).toLocaleDateString('ru', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Расписание</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
          >
            + Добавить запись
          </button>
        </div>
      </div>

      {/* Date navigation */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 flex items-center justify-between">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
          />
          <span className="text-sm text-gray-500 capitalize">{dayOfWeek}, {formattedDate}</span>
          <button
            onClick={() => setDate(new Date().toISOString().split('T')[0])}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition"
          >
            Сегодня
          </button>
        </div>
        <button
          onClick={() => changeDate(1)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Schedule grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Загрузка...</div>
        ) : doctors.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Нет врачей. <a href="/crm/doctors" className="text-amber-600 hover:underline">Добавьте врачей</a> для отображения расписания.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-r border-b border-gray-200 py-3 px-3 text-xs font-semibold text-gray-500 w-20">
                    Время
                  </th>
                  {doctors.map((doc) => (
                    <th
                      key={doc.id}
                      className="border-r border-b border-gray-200 py-3 px-3 text-xs font-semibold text-gray-700 min-w-[180px]"
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: doc.color || '#3B82F6' }}
                        />
                        <span>{doc.name}</span>
                      </div>
                      <p className="text-gray-400 font-normal mt-0.5">{doc.specialization}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => (
                  <tr key={hour}>
                    <td className="border-r border-b border-gray-100 py-3 px-3 text-sm text-gray-500 text-center font-mono bg-gray-50/50">
                      {hour.toString().padStart(2, '0')}:00
                    </td>
                    {doctors.map((doc) => {
                      const apts = getAppointmentsForDoctorHour(doc.id, hour);
                      return (
                        <td
                          key={doc.id}
                          className="border-r border-b border-gray-100 py-1 px-2 align-top cursor-pointer hover:bg-amber-50/40 transition min-h-[60px]"
                          onClick={() => handleCellClick(doc.id, hour)}
                        >
                          {apts.length > 0 ? (
                            apts.map((apt) => (
                              <div
                                key={apt.id}
                                className="rounded-lg px-2.5 py-2 mb-1 text-xs text-white"
                                style={{ backgroundColor: apt.color || doc.color || '#3B82F6' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <p className="font-semibold">
                                  {new Date(apt.startTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                                  {' - '}
                                  {new Date(apt.endTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="opacity-80 mt-0.5">Пациент #{apt.patientId}</p>
                                <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded ${statusColors[apt.status] || ''}`}>
                                  {statusLabels[apt.status] || apt.status}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="h-10 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                              <span className="text-gray-300 text-xs">+ Записать</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AppointmentModal
          date={date}
          doctorId={modalDoctor}
          hour={modalHour}
          doctors={doctors}
          onClose={() => { setShowModal(false); setModalDoctor(null); setModalHour(null); }}
          onCreated={handleAppointmentCreated}
        />
      )}
    </div>
  );
}

// === Modal component ===
function AppointmentModal({
  date,
  doctorId,
  hour,
  doctors,
  onClose,
  onCreated,
}: {
  date: string;
  doctorId: number | null;
  hour: number | null;
  doctors: Doctor[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [form, setForm] = useState({
    patientId: '',
    doctorId: doctorId?.toString() || '',
    startTime: `${hour?.toString().padStart(2, '0') || '09'}:00`,
    endTime: `${((hour || 9) + 1).toString().padStart(2, '0')}:00`,
    status: 'scheduled',
    notes: '',
  });

  // Search patients
  useEffect(() => {
    if (patientSearch.length < 2) {
      setPatients([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/crm/patients?search=${encodeURIComponent(patientSearch)}&limit=10`);
        const data = await res.json();
        setPatients(data.patients || []);
      } catch {
        setPatients([]);
      }
      setSearchLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [patientSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.patientId) {
      setError('Выберите пациента');
      return;
    }
    if (!form.doctorId) {
      setError('Выберите врача');
      return;
    }

    setLoading(true);
    try {
      const startTime = new Date(`${date}T${form.startTime}:00`);
      const endTime = new Date(`${date}T${form.endTime}:00`);

      const res = await fetch('/api/crm/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: parseInt(form.patientId),
          doctorId: parseInt(form.doctorId),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          status: form.status,
          notes: form.notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Ошибка');
      }

      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const selectedPatient = patients.find((p) => p.id.toString() === form.patientId);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Новая запись</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Patient search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пациент *</label>
            {selectedPatient ? (
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedPatient.lastName} {selectedPatient.firstName} {selectedPatient.middleName || ''}
                  </p>
                  <p className="text-xs text-gray-500">{selectedPatient.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setForm({ ...form, patientId: '' }); setPatientSearch(''); }}
                  className="text-gray-400 hover:text-red-500 text-xs"
                >
                  Изменить
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Поиск по ФИО или телефону..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
                />
                {searchLoading && <p className="text-xs text-gray-400 mt-1">Поиск...</p>}
                {patients.length > 0 && (
                  <div className="mt-1 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                    {patients.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, patientId: p.id.toString() });
                          setPatientSearch('');
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-amber-50 text-sm border-b border-gray-50 last:border-b-0"
                      >
                        <span className="font-medium">{p.lastName} {p.firstName}</span>
                        <span className="text-gray-400 ml-2">{p.phone}</span>
                      </button>
                    ))}
                  </div>
                )}
                {patientSearch.length >= 2 && patients.length === 0 && !searchLoading && (
                  <p className="text-xs text-gray-400 mt-1">
                    Не найдено. <a href="/crm/patients/new" target="_blank" className="text-amber-600 hover:underline">Создать пациента</a>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Врач *</label>
            <select
              value={form.doctorId}
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
              required
            >
              <option value="">Выберите врача</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} — {doc.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Начало *</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Конец *</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
            >
              <option value="scheduled">Запланирован</option>
              <option value="confirmed">Подтверждён</option>
              <option value="in_progress">Идёт приём</option>
              <option value="completed">Завершён</option>
              <option value="cancelled">Отменён</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Заметки</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
              placeholder="Комментарий к записи..."
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white py-2.5 rounded-lg text-sm font-medium transition"
            >
              {loading ? 'Сохранение...' : 'Записать'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
