'use client';

import { useState, useEffect, useCallback } from 'react';
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
  createdAt: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ search, page: page.toString(), limit: '20' });
    const res = await fetch(`/api/crm/patients?${params}`);
    const data = await res.json();
    setPatients(data.patients);
    setTotalPages(data.totalPages);
    setTotal(data.total);
    setLoading(false);
  }, [search, page]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Пациенты</h1>
          <p className="text-sm text-gray-500 mt-1">Всего: {total}</p>
        </div>
        <Link
          href="/crm/patients/new"
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          + Добавить пациента
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <input
          type="text"
          placeholder="Поиск по ФИО, телефону, ИИН..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Загрузка...</div>
        ) : patients.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            {search ? 'Ничего не найдено' : 'Нет пациентов'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">ФИО</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Телефон</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">ИИН</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Дата рождения</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Пол</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Добавлен</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-50 hover:bg-amber-50/30 transition">
                    <td className="py-3 px-4">
                      <Link
                        href={`/crm/patients/${patient.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-amber-600"
                      >
                        {patient.lastName} {patient.firstName} {patient.middleName || ''}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{patient.phone}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{patient.iin || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {patient.dateOfBirth
                        ? new Date(patient.dateOfBirth).toLocaleDateString('ru')
                        : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {patient.gender === 'male' ? 'М' : patient.gender === 'female' ? 'Ж' : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {new Date(patient.createdAt).toLocaleDateString('ru')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm text-gray-600 hover:text-amber-600 disabled:text-gray-300"
            >
              &larr; Назад
            </button>
            <span className="text-sm text-gray-500">
              Стр. {page} из {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-sm text-gray-600 hover:text-amber-600 disabled:text-gray-300"
            >
              Вперёд &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
