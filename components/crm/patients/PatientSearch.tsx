'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PatientSearch({ initialSearch }: { initialSearch: string }) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/crm/patients?search=${encodeURIComponent(search)}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по ФИО, телефону, ИИН..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:outline-none text-sm text-gray-900"
        />
        <button
          type="submit"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition"
        >
          Найти
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              router.push('/crm/patients');
            }}
            className="text-gray-400 hover:text-gray-600 px-2 text-sm"
          >
            Сбросить
          </button>
        )}
      </div>
    </form>
  );
}
