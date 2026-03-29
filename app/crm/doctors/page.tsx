import { db } from '@/lib/db';
import { doctors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function CrmDoctorsPage() {
  const allDoctors = await db
    .select()
    .from(doctors)
    .where(eq(doctors.isActive, true))
    .orderBy(doctors.order);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Врачи</h1>
        <Link
          href="/crm/doctors/new"
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          + Добавить врача
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{ backgroundColor: doctor.color || '#3B82F6' }}
              >
                {doctor.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{doctor.name}</h3>
                <p className="text-sm text-gray-500">{doctor.specialization}</p>
                <p className="text-xs text-gray-400 mt-1">Стаж: {doctor.experience} лет</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <Link
                href={`/crm/doctors/${doctor.id}`}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium"
              >
                Профиль
              </Link>
              <span className="text-gray-200">|</span>
              <Link
                href={`/crm/schedule?doctor=${doctor.id}`}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Расписание
              </Link>
              {doctor.workPhone && (
                <>
                  <span className="text-gray-200">|</span>
                  <span className="text-xs text-gray-400">{doctor.workPhone}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {allDoctors.length === 0 && (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center text-gray-400">
          Нет врачей. Добавьте первого врача.
        </div>
      )}
    </div>
  );
}
