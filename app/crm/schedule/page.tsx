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
  patientName?: string;
  doctorName?: string;
}

interface Doctor {
  id: number;
  name: string;
  color: string | null;
  specialization: string;
}

export default function SchedulePage() {
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

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

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 08:00 - 19:00

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
            onClick={() => changeDate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm"
            />
            <p className="text-xs text-gray-400 mt-1 capitalize">{dayOfWeek}, {formattedDate}</p>
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => setDate(new Date().toISOString().split('T')[0])}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition"
          >
            Сегодня
          </button>
        </div>
      </div>

      {/* Schedule grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Загрузка...</div>
        ) : doctors.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Нет врачей. Добавьте врачей для отображения расписания.</div>
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
                      className="border-r border-b border-gray-200 py-3 px-3 text-xs font-semibold text-gray-700 min-w-[150px]"
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <div
                          className="w-3 h-3 rounded-full"
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
                  <tr key={hour} className="hover:bg-amber-50/20">
                    <td className="border-r border-b border-gray-100 py-3 px-3 text-sm text-gray-500 text-center font-mono">
                      {hour.toString().padStart(2, '0')}:00
                    </td>
                    {doctors.map((doc) => {
                      const apts = getAppointmentsForDoctorHour(doc.id, hour);
                      return (
                        <td
                          key={doc.id}
                          className="border-r border-b border-gray-100 py-1 px-2 align-top min-h-[60px]"
                        >
                          {apts.map((apt) => (
                            <div
                              key={apt.id}
                              className="rounded-lg px-2 py-1.5 mb-1 text-xs text-white cursor-pointer"
                              style={{ backgroundColor: apt.color || doc.color || '#3B82F6' }}
                            >
                              <p className="font-medium">
                                {new Date(apt.startTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                                {' - '}
                                {new Date(apt.endTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <p className="opacity-80">Пациент #{apt.patientId}</p>
                            </div>
                          ))}
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
    </div>
  );
}
