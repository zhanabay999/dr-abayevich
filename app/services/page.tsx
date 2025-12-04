import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const services = [
  {
    id: 1,
    title: 'Имплантация зубов',
    slug: 'implantation',
    description: 'Современные импланты премиум-качества. Полное восстановление зубного ряда.',
    icon: '🦷',
    priceFrom: 150000,
    features: [
      'Консультация имплантолога',
      'Установка импланта премиум-класса',
      'Индивидуальная коронка',
      'Гарантия 10 лет',
    ],
  },
  {
    id: 2,
    title: 'Эстетическая стоматология',
    slug: 'esthetic',
    description: 'Виниры, отбеливание, элайнеры. Создание идеальной улыбки.',
    icon: '✨',
    priceFrom: 50000,
    features: [
      'Профессиональное отбеливание',
      'Керамические виниры',
      'Элайнеры для выравнивания',
      'Художественная реставрация',
    ],
  },
  {
    id: 3,
    title: 'Лечение зубов',
    slug: 'treatment',
    description: 'Терапевтическая стоматология. Лечение кариеса, пульпита, периодонтита.',
    icon: '🔬',
    priceFrom: 15000,
    features: [
      'Лечение кариеса',
      'Лечение каналов',
      'Художественные пломбы',
      'Профилактика заболеваний',
    ],
  },
  {
    id: 4,
    title: 'Хирургическая стоматология',
    slug: 'surgery',
    description: 'Все виды хирургических операций. Удаление, костная пластика.',
    icon: '🏥',
    priceFrom: 20000,
    features: [
      'Удаление зубов',
      'Костная пластика',
      'Синус-лифтинг',
      'Лечение десен',
    ],
  },
  {
    id: 5,
    title: 'Протезирование',
    slug: 'prosthetics',
    description: 'Коронки, мосты, съемные протезы. Восстановление функции жевания.',
    icon: '👄',
    priceFrom: 40000,
    features: [
      'Металлокерамические коронки',
      'Циркониевые коронки',
      'Мостовидные протезы',
      'Съемное протезирование',
    ],
  },
  {
    id: 6,
    title: 'Детская стоматология',
    slug: 'kids',
    description: 'Лечение и профилактика для детей. Комфортная атмосфера.',
    icon: '👶',
    priceFrom: 10000,
    features: [
      'Лечение молочных зубов',
      'Профилактика кариеса',
      'Исправление прикуса',
      'Безболезненное лечение',
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Наши услуги</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Полный спектр стоматологических услуг с применением современных технологий
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border-2 border-gray-100 rounded-3xl p-8 hover:shadow-2xl hover:border-amber-200 transition duration-300"
              >
                <div className="text-6xl mb-4">{service.icon}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="mb-6">
                  <div className="text-sm text-gray-500 mb-2">Цена от</div>
                  <div className="text-3xl font-bold text-amber-600">
                    {service.priceFrom.toLocaleString('ru-KZ')} ₸
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-600">
                      <span className="text-amber-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/${service.slug}`}
                  className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-full font-semibold transition"
                >
                  Подробнее
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Не знаете, какая услуга вам нужна?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Запишитесь на бесплатную консультацию, и наш врач подберет оптимальный план лечения
          </p>
          <Link
            href="/appointment"
            className="inline-block bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition"
          >
            Записаться на консультацию
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
