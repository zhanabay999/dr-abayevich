import { db } from '@/lib/db';
import { patients, crmAppointments, appointments, doctors } from '@/lib/db/schema';
import { eq, sql, and, gte, lte } from 'drizzle-orm';
import Link from 'next/link';

export default async function CrmDashboard() {
  // Статистика
  const [patientCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(patients)
    .where(eq(patients.isDeleted, false));

  const [appointmentCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(crmAppointments)
    .where(eq(crmAppointments.isDeleted, false));

  const [newInboxCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(appointments)
    .where(eq(appointments.status, 'new'));

  const [doctorCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(doctors)
    .where(eq(doctors.isActive, true));

  // Сегодняшние записи
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = await db
    .select()
    .from(crmAppointments)
    .where(
      and(
        eq(crmAppointments.isDeleted, false),
        gte(crmAppointments.startTime, today),
        lte(crmAppointments.startTime, tomorrow)
      )
    );

  // Последние заявки с сайта
  const recentInbox = await db
    .select()
    .from(appointments)
    .where(eq(appointments.status, 'new'))
    .orderBy(sql`${appointments.createdAt} DESC`)
    .limit(5);

  const stats = [
    {
      label: 'Пациенты',
      value: patientCount.count,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/crm/patients',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: 'Записи CRM',
      value: appointmentCount.count,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      href: '/crm/schedule',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Новые заявки',
      value: newInboxCount.count,
      color: 'text-red-600',
      bg: 'bg-red-50',
      href: '/crm/inbox',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
    },
    {
      label: 'Врачи',
      value: doctorCount.count,
      color: 'text-green-600',
      bg: 'bg-green-50',
      href: '/crm/doctors',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Панель управления</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's appointments */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Сегодня</h2>
            <Link href="/crm/schedule" className="text-sm text-amber-600 hover:text-amber-700">
              Расписание &rarr;
            </Link>
          </div>
          {todayAppointments.length === 0 ? (
            <p className="text-gray-500 text-sm">Нет записей на сегодня</p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-1 h-10 rounded-full" style={{ backgroundColor: apt.color || '#F59E0B' }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(apt.startTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {new Date(apt.endTime).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-gray-500">Пациент #{apt.patientId}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                    apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {apt.status === 'scheduled' ? 'Запланирован' :
                     apt.status === 'confirmed' ? 'Подтверждён' :
                     apt.status === 'in_progress' ? 'Идёт приём' :
                     apt.status === 'completed' ? 'Завершён' :
                     apt.status === 'cancelled' ? 'Отменён' : apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent inbox */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Новые заявки с сайта</h2>
            <Link href="/crm/inbox" className="text-sm text-amber-600 hover:text-amber-700">
              Все заявки &rarr;
            </Link>
          </div>
          {recentInbox.length === 0 ? (
            <p className="text-gray-500 text-sm">Нет новых заявок</p>
          ) : (
            <div className="space-y-3">
              {recentInbox.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{item.preferredDate || '-'}</p>
                    <p className="text-xs text-gray-400">{item.preferredTime || '-'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
