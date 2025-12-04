import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { appointments, subscribers, services, reviews } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  // Fetch statistics
  const allAppointments = await db.select().from(appointments);
  const newAppointments = allAppointments.filter(a => a.status === 'new');
  const allSubscribers = await db.select().from(subscribers).where(eq(subscribers.isActive, true));
  const pendingReviews = await db.select().from(reviews).where(eq(reviews.isApproved, false));

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
            <p className="text-sm text-gray-600">Dr. Abayevich Dental Clinic</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Привет, {session.user?.name || 'Админ'}
            </span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Выйти
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Новые записи</p>
                <p className="text-3xl font-bold text-amber-600">{newAppointments.length}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Всего записей</p>
                <p className="text-3xl font-bold text-blue-600">{allAppointments.length}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Подписчики</p>
                <p className="text-3xl font-bold text-green-600">{allSubscribers.length}</p>
              </div>
              <div className="text-4xl">✉️</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Новые отзывы</p>
                <p className="text-3xl font-bold text-purple-600">{pendingReviews.length}</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/appointments"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Записи на прием</h3>
            <p className="text-gray-600">Управление записями пациентов</p>
          </Link>

          <Link
            href="/admin/services"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">🦷</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Услуги</h3>
            <p className="text-gray-600">Редактирование услуг клиники</p>
          </Link>

          <Link
            href="/admin/doctors"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Врачи</h3>
            <p className="text-gray-600">Управление информацией о врачах</p>
          </Link>

          <Link
            href="/admin/reviews"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Отзывы</h3>
            <p className="text-gray-600">Модерация отзывов пациентов</p>
          </Link>

          <Link
            href="/admin/subscribers"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">✉️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Подписчики</h3>
            <p className="text-gray-600">Управление email рассылками</p>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Настройки</h3>
            <p className="text-gray-600">Настройки системы</p>
          </Link>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Последние записи</h2>
          {newAppointments.length === 0 ? (
            <p className="text-gray-600">Нет новых записей</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Имя</th>
                    <th className="text-left py-3 px-4">Телефон</th>
                    <th className="text-left py-3 px-4">Дата</th>
                    <th className="text-left py-3 px-4">Время</th>
                    <th className="text-left py-3 px-4">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {newAppointments.slice(0, 5).map((appointment) => (
                    <tr key={appointment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{appointment.name}</td>
                      <td className="py-3 px-4">{appointment.phone}</td>
                      <td className="py-3 px-4">{appointment.preferredDate || '-'}</td>
                      <td className="py-3 px-4">{appointment.preferredTime || '-'}</td>
                      <td className="py-3 px-4">
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Новая
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
