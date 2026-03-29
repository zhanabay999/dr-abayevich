import { db } from '@/lib/db';
import { appointments, doctors, services } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import Link from 'next/link';

export default async function InboxPage() {
  const inboxItems = await db
    .select()
    .from(appointments)
    .orderBy(sql`${appointments.createdAt} DESC`);

  const allDoctors = await db.select().from(doctors).where(eq(doctors.isActive, true));
  const allServices = await db.select().from(services).where(eq(services.isActive, true));

  const doctorMap = Object.fromEntries(allDoctors.map((d) => [d.id, d.name]));
  const serviceMap = Object.fromEntries(allServices.map((s) => [s.id, s.title]));

  const statusColors: Record<string, string> = {
    new: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
  };

  const statusLabels: Record<string, string> = {
    new: 'Новая',
    confirmed: 'Подтверждена',
    cancelled: 'Отменена',
    completed: 'Завершена',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Входящие заявки</h1>
          <p className="text-sm text-gray-500 mt-1">Заявки с сайта на запись к врачу</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {inboxItems.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Нет заявок</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Пациент</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Телефон</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Услуга</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Врач</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Дата/Время</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Статус</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Создана</th>
                </tr>
              </thead>
              <tbody>
                {inboxItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-amber-50/30 transition">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      {item.email && <p className="text-xs text-gray-400">{item.email}</p>}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.phone}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {item.serviceId ? serviceMap[item.serviceId] || '-' : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {item.doctorId ? doctorMap[item.doctorId] || '-' : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {item.preferredDate || '-'} {item.preferredTime || ''}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[item.status] || 'bg-gray-100 text-gray-600'}`}>
                        {statusLabels[item.status] || item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString('ru')}
                    </td>
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
