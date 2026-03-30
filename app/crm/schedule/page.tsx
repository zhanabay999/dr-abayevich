'use client';

import { useState, useEffect, useCallback } from 'react';

interface Appointment {
  id: number; patientId: number; doctorId: number; roomId: number | null;
  startTime: string; endTime: string; status: string; color: string | null; notes: string | null;
}
interface Doctor { id: number; name: string; color: string | null; specialization: string; }
interface Room { id: number; name: string; color: string | null; }
interface Patient { id: number; firstName: string; lastName: string; middleName: string | null; phone: string; }

const statusLabels: Record<string, string> = {
  scheduled: 'Запланирован', confirmed: 'Подтверждён', in_progress: 'Идёт приём',
  completed: 'Завершён', cancelled: 'Отменён', no_show: 'Не пришёл',
};

export default function SchedulePage() {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [roomsList, setRoomsList] = useState<Room[]>([]);
  const [patientMap, setPatientMap] = useState<Record<number, Patient>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalRoom, setModalRoom] = useState<number | null>(null);
  const [modalHour, setModalHour] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [aptRes, docRes, roomRes] = await Promise.all([
        fetch(`/api/crm/appointments?date=${date}`),
        fetch('/api/crm/doctors'),
        fetch('/api/crm/rooms'),
      ]);
      const aptData = await aptRes.json();
      const docData = await docRes.json();
      const roomData = await roomRes.json();
      const apts: Appointment[] = aptData.appointments || [];
      setAppointments(apts);
      setDoctors(docData.doctors || []);
      setRoomsList(roomData.rooms || []);

      const patientIds = [...new Set(apts.map(a => a.patientId))];
      const pMap: Record<number, Patient> = {};
      for (const pid of patientIds) {
        try {
          const pRes = await fetch(`/api/crm/patients/${pid}`);
          const pData = await pRes.json();
          if (pData.patient) pMap[pid] = pData.patient;
        } catch {}
      }
      setPatientMap(pMap);
    } catch (err) { console.error(err); }
    setLoading(false);
  }, [date]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const slots: string[] = [];
  for (let h = 8; h < 20; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  const slotHeight = 44;

  const changeDate = (delta: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleCellClick = (roomId: number, slotTime: string) => {
    const hour = parseInt(slotTime.split(':')[0]);
    setModalRoom(roomId);
    setModalHour(hour);
    setShowModal(true);
  };

  const getAptStyle = (apt: Appointment) => {
    const start = new Date(apt.startTime);
    const end = new Date(apt.endTime);
    const startMin = start.getHours() * 60 + start.getMinutes();
    const endMin = end.getHours() * 60 + end.getMinutes();
    const top = ((startMin - 480) / 30) * slotHeight;
    const height = Math.max(((endMin - startMin) / 30) * slotHeight - 2, slotHeight - 2);
    return { top: `${top}px`, height: `${height}px` };
  };

  const getPatientName = (pid: number) => {
    const p = patientMap[pid];
    return p ? `${p.lastName} ${p.firstName}` : `#${pid}`;
  };

  const getDoctorName = (did: number) => doctors.find(d => d.id === did)?.name || '';
  const getDoctorColor = (did: number) => doctors.find(d => d.id === did)?.color || '#3B82F6';

  const upcomingApts = [...appointments]
    .filter(a => a.status !== 'cancelled' && a.status !== 'completed')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const selectedDate = new Date(date);
  const dayOfWeek = selectedDate.toLocaleDateString('ru', { weekday: 'long' });
  const dayNum = selectedDate.getDate();
  const monthName = selectedDate.toLocaleDateString('ru', { month: 'long' });
  const calYear = selectedDate.getFullYear();
  const calMonth = selectedDate.getMonth();
  const firstDay = new Date(calYear, calMonth, 1);
  const lastDay = new Date(calYear, calMonth + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();
  const calWeeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) { calWeeks.push(week); week = []; }
  }
  if (week.length > 0) { while (week.length < 7) week.push(null); calWeeks.push(week); }

  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)] overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-56 shrink-0 flex-col gap-3 overflow-y-auto hidden lg:flex">
        {/* Mini calendar */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => { const d = new Date(calYear, calMonth - 1, 1); setDate(d.toISOString().split('T')[0]); }} className="text-gray-400 hover:text-gray-600 text-xs">&laquo;</button>
            <span className="text-sm font-semibold text-gray-900 capitalize">{selectedDate.toLocaleDateString('ru', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => { const d = new Date(calYear, calMonth + 1, 1); setDate(d.toISOString().split('T')[0]); }} className="text-gray-400 hover:text-gray-600 text-xs">&raquo;</button>
          </div>
          <table className="w-full">
            <thead><tr>{['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => (<th key={d} className="text-[10px] text-gray-400 font-normal py-1">{d}</th>))}</tr></thead>
            <tbody>
              {calWeeks.map((w, wi) => (
                <tr key={wi}>{w.map((d, di) => (
                  <td key={di} className="text-center">
                    {d ? (
                      <button onClick={() => setDate(`${calYear}-${(calMonth+1).toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`)}
                        className={`w-7 h-7 rounded-full text-xs transition ${d === selectedDate.getDate() ? 'bg-amber-500 text-white font-bold' : d === new Date().getDate() && calMonth === new Date().getMonth() && calYear === new Date().getFullYear() ? 'bg-amber-100 text-amber-700' : 'text-gray-700 hover:bg-gray-100'}`}>{d}</button>
                    ) : <span className="w-7 h-7 block" />}
                  </td>
                ))}</tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setDate(new Date().toISOString().split('T')[0])} className="w-full mt-2 text-xs text-amber-600 hover:text-amber-700">Сегодня</button>
        </div>

        {/* Date display */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-4xl font-bold text-gray-900">{dayNum}</p>
          <p className="text-sm text-gray-500 capitalize">{dayOfWeek}</p>
          <p className="text-xs text-gray-400 capitalize">{monthName} {calYear}</p>
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex-1 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Записи на день</h3>
          {upcomingApts.length === 0 ? (
            <p className="text-xs text-gray-400">Нет записей</p>
          ) : (
            <div className="space-y-2">
              {upcomingApts.map(apt => (
                <div key={apt.id} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                  <div className="w-1 h-8 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: getDoctorColor(apt.doctorId) }} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{getPatientName(apt.patientId)}</p>
                    <p className="text-[10px] text-gray-500">Врач: {getDoctorName(apt.doctorId)}</p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(apt.startTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                      {' — '}
                      {new Date(apt.endTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CENTER: SCHEDULE GRID */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => changeDate(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-sm font-medium text-gray-700 capitalize">{dayOfWeek}, {dayNum} {monthName}</span>
            <button onClick={() => changeDate(1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition">+ Записать</button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">Загрузка...</div>
        ) : roomsList.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Нет кабинетов</div>
        ) : (
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex w-full">
              {/* Time column */}
              <div className="w-14 shrink-0 border-r border-gray-200 bg-gray-50/50">
                <div className="h-10 border-b border-gray-200" />
                {slots.map(slot => (
                  <div key={slot} className="border-b border-gray-100 flex items-start justify-end pr-2" style={{ height: `${slotHeight}px` }}>
                    {slot.endsWith(':00') && <span className="text-[10px] text-gray-400 font-mono -mt-1.5">{slot}</span>}
                  </div>
                ))}
              </div>

              {/* Room columns */}
              {roomsList.map(room => {
                const roomApts = appointments.filter(a => a.roomId === room.id && a.status !== 'cancelled');
                return (
                  <div key={room.id} className="flex-1 min-w-0 border-r border-gray-100 last:border-r-0">
                    <div className="h-10 border-b border-gray-200 flex items-center justify-center gap-1.5 px-2 bg-gray-50/80">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: room.color || '#3B82F6' }} />
                      <span className="text-xs font-semibold text-gray-700">{room.name}</span>
                    </div>
                    <div className="relative">
                      {slots.map(slot => (
                        <div key={slot}
                          className={`border-b cursor-pointer hover:bg-amber-50/30 transition ${slot.endsWith(':00') ? 'border-gray-200' : 'border-gray-50'}`}
                          style={{ height: `${slotHeight}px` }}
                          onClick={() => handleCellClick(room.id, slot)}
                        />
                      ))}
                      {roomApts.map(apt => {
                        const style = getAptStyle(apt);
                        const bgColor = getDoctorColor(apt.doctorId);
                        return (
                          <div key={apt.id}
                            className="absolute left-1 right-1 rounded-md px-2 py-1 text-white overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                            style={{ ...style, backgroundColor: bgColor }}
                            onClick={e => e.stopPropagation()}>
                            <p className="text-[11px] font-semibold truncate">{getPatientName(apt.patientId)}</p>
                            <p className="text-[10px] opacity-80">{getDoctorName(apt.doctorId)}</p>
                            <p className="text-[10px] opacity-70">
                              {new Date(apt.startTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                              {' — '}
                              {new Date(apt.endTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {parseInt(style.height) > 60 && (
                              <p className="text-[9px] opacity-50 mt-0.5">{statusLabels[apt.status] || apt.status}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <AppointmentModal date={date} roomId={modalRoom} hour={modalHour} doctors={doctors} rooms={roomsList}
          onClose={() => { setShowModal(false); setModalRoom(null); setModalHour(null); }}
          onCreated={() => { setShowModal(false); setModalRoom(null); setModalHour(null); fetchData(); }} />
      )}
    </div>
  );
}

function AppointmentModal({ date, roomId, hour, doctors, rooms, onClose, onCreated }: {
  date: string; roomId: number | null; hour: number | null; doctors: Doctor[]; rooms: Room[];
  onClose: () => void; onCreated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [form, setForm] = useState({
    patientId: '', doctorId: '', roomId: roomId?.toString() || '',
    startTime: `${hour?.toString().padStart(2, '0') || '09'}:00`,
    endTime: `${((hour || 9) + 1).toString().padStart(2, '0')}:00`,
    status: 'scheduled', notes: '',
  });

  useEffect(() => {
    if (patientSearch.length < 2) { setPatients([]); return; }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try { const res = await fetch(`/api/crm/patients?search=${encodeURIComponent(patientSearch)}&limit=10`); const d = await res.json(); setPatients(d.patients || []); }
      catch { setPatients([]); }
      setSearchLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [patientSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!form.patientId) { setError('Выберите пациента'); return; }
    if (!form.doctorId) { setError('Выберите врача'); return; }
    if (!form.roomId) { setError('Выберите кабинет'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/crm/appointments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: parseInt(form.patientId), doctorId: parseInt(form.doctorId),
          roomId: parseInt(form.roomId),
          startTime: new Date(`${date}T${form.startTime}:00`).toISOString(),
          endTime: new Date(`${date}T${form.endTime}:00`).toISOString(),
          status: form.status, notes: form.notes || null,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Ошибка'); }
      onCreated();
    } catch (err) { setError(err instanceof Error ? err.message : 'Ошибка'); }
    finally { setLoading(false); }
  };

  const selectedPatient = patients.find(p => p.id.toString() === form.patientId);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Новая запись</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Patient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пациент *</label>
            {selectedPatient ? (
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedPatient.lastName} {selectedPatient.firstName}</p>
                  <p className="text-xs text-gray-500">{selectedPatient.phone}</p>
                </div>
                <button type="button" onClick={() => { setForm({...form, patientId: ''}); setPatientSearch(''); }} className="text-xs text-gray-400 hover:text-red-500">Изменить</button>
              </div>
            ) : (
              <div>
                <input type="text" placeholder="Поиск по ФИО или телефону..." value={patientSearch} onChange={e => setPatientSearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" />
                {searchLoading && <p className="text-xs text-gray-400 mt-1">Поиск...</p>}
                {patients.length > 0 && (
                  <div className="mt-1 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                    {patients.map(p => (
                      <button key={p.id} type="button" onClick={() => { setForm({...form, patientId: p.id.toString()}); setPatientSearch(''); }}
                        className="w-full text-left px-3 py-2 hover:bg-amber-50 text-sm border-b border-gray-50 last:border-b-0">
                        <span className="font-medium">{p.lastName} {p.firstName}</span>
                        <span className="text-gray-400 ml-2">{p.phone}</span>
                      </button>
                    ))}
                  </div>
                )}
                {patientSearch.length >= 2 && patients.length === 0 && !searchLoading && (
                  <p className="text-xs text-gray-400 mt-1">Не найдено. <a href="/crm/patients/new" target="_blank" className="text-amber-600">Создать</a></p>
                )}
              </div>
            )}
          </div>
          {/* Doctor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Врач *</label>
            <select value={form.doctorId} onChange={e => setForm({...form, doctorId: e.target.value})} required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900">
              <option value="">Выберите врача</option>
              {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
            </select>
          </div>
          {/* Room */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Кабинет *</label>
            <select value={form.roomId} onChange={e => setForm({...form, roomId: e.target.value})} required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900">
              <option value="">Выберите кабинет</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Начало *</label>
              <input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Конец *</label>
              <input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} required
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" /></div>
          </div>
          {/* Status */}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900">
              <option value="scheduled">Запланирован</option><option value="confirmed">Подтверждён</option>
              <option value="in_progress">Идёт приём</option><option value="completed">Завершён</option>
              <option value="cancelled">Отменён</option>
            </select></div>
          {/* Notes */}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Заметки</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} placeholder="Комментарий..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900" /></div>
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white py-2.5 rounded-lg text-sm font-medium transition">
              {loading ? 'Сохранение...' : 'Записать'}</button>
            <button type="button" onClick={onClose} className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium transition">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}
