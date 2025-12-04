import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubscribeForm from '@/components/SubscribeForm';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="inline-block bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Стоматология премиум-класса
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Ваша улыбка - <br />наша <span className="text-yellow-600">забота</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Современные технологии, опытные врачи и индивидуальный подход к каждому пациенту в центре Астаны.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/appointment"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition text-center shadow-lg hover:shadow-xl"
                >
                  Записаться на приём
                </Link>
                <a
                  href="tel:+77006472376"
                  className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-lg font-semibold text-lg transition text-center"
                >
                  +7 (700) 647-23-76
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-96 h-96 bg-white border-4 border-yellow-600 rounded-full flex items-center justify-center shadow-2xl p-12">
                  <Image
                    src="/logo.png"
                    alt="Dr. Abayevich Dental Clinic"
                    width={320}
                    height={320}
                    className="w-full h-auto"
                    priority
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-yellow-100 rounded-full -z-10"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-50 rounded-full -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Наши услуги</h2>
            <p className="text-xl text-gray-600">Полный спектр стоматологических услуг для всей семьи</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Имплантация', desc: 'Восстановление зубов под ключ', price: 'от 150 000 ₸' },
              { title: 'Эстетика', desc: 'Виниры, отбеливание, элайнеры', price: 'от 50 000 ₸' },
              { title: 'Лечение', desc: 'Терапия и профилактика', price: 'от 15 000 ₸' },
              { title: 'Хирургия', desc: 'Все виды операций', price: 'от 25 000 ₸' },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 p-6 rounded-xl hover:border-yellow-600 hover:shadow-lg transition group"
              >
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                <p className="text-yellow-600 font-semibold">{service.price}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-md hover:shadow-lg"
            >
              Все услуги и цены
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Почему выбирают нас</h2>
            <p className="text-xl text-gray-600">Профессионализм и забота о каждом пациенте</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '10+ лет опыта', desc: 'Проверенные специалисты с международными сертификатами' },
              { title: 'Новейшее оборудование', desc: 'Технологии и материалы мирового уровня' },
              { title: 'Премиум качество', desc: 'Индивидуальный подход к каждому пациенту' },
              { title: 'Опытные врачи', desc: 'Высокая квалификация и постоянное обучение' },
              { title: 'Гарантия результата', desc: 'Качество работы подтверждено тысячами клиентов' },
              { title: 'Для всей семьи', desc: 'Взрослая и детская стоматология в одном месте' },
            ].map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200 p-6 rounded-xl hover:border-yellow-600 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-yellow-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl p-12 text-white text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Запишитесь на консультацию</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Первичный осмотр и консультация врача. Составим план лечения и ответим на все ваши вопросы.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/appointment"
                className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg"
              >
                Записаться онлайн
              </Link>
              <a
                href="tel:+77006472376"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-yellow-600 px-8 py-4 rounded-lg font-semibold text-lg transition"
              >
                +7 (700) 647-23-76
              </a>
              <a
                href="https://wa.me/77006472376"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 border-2 border-green-500 px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2 shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Как нас найти</h2>
            <p className="text-xl text-gray-600">Мы находимся в центре Астаны</p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://2gis.kz/astana/firm/70000001090485967/tab/reviews?m=71.430347%2C51.091084%2F16"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="mt-8 text-center">
              <a
                href="https://2gis.kz/astana/firm/70000001090485967"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-md hover:shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Открыть в 2GIS
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Подпишитесь на рассылку</h3>
          <p className="text-gray-400 mb-6">Получайте советы по уходу за зубами и информацию об акциях</p>
          <SubscribeForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
