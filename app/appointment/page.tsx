'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function AppointmentPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          service: '',
          preferredDate: '',
          preferredTime: '',
          message: '',
        });
      } else {
        setSubmitMessage('Произошла ошибка. Пожалуйста, попробуйте позже или позвоните нам.');
      }
    } catch (error) {
      setSubmitMessage('Произошла ошибка. Пожалуйста, попробуйте позже или позвоните нам.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Header />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">Запись на прием</h1>
              <p className="text-xl text-gray-700">
                Заполните форму, и мы свяжемся с вами для подтверждения записи
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Form */}
              <div className="bg-white border-2 border-yellow-600 rounded-3xl p-8 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-600 focus:outline-none transition"
                      placeholder="Введите ваше имя"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-600 focus:outline-none transition"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-600 focus:outline-none transition"
                      placeholder="example@mail.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
                      Услуга
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-600 focus:outline-none transition"
                    >
                      <option value="">Выберите услугу</option>
                      <option value="consultation">Консультация</option>
                      <option value="implantation">Имплантация</option>
                      <option value="esthetic">Эстетическая стоматология</option>
                      <option value="treatment">Лечение зубов</option>
                      <option value="surgery">Хирургия</option>
                      <option value="prosthetics">Протезирование</option>
                      <option value="kids">Детская стоматология</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="preferredDate" className="block text-sm font-semibold text-gray-700 mb-2">
                        Желаемая дата
                      </label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-600 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="preferredTime" className="block text-sm font-semibold text-gray-700 mb-2">
                        Время
                      </label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-600 focus:outline-none transition"
                      >
                        <option value="">Выберите время</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                        <option value="17:00">17:00</option>
                        <option value="18:00">18:00</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Комментарий
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-600 focus:outline-none transition resize-none"
                      placeholder="Дополнительная информация..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-300 text-white font-semibold py-4 rounded-xl transition"
                  >
                    {isSubmitting ? 'Отправка...' : 'Записаться на прием'}
                  </button>

                  {submitMessage && (
                    <div className={`p-4 rounded-xl ${submitMessage.includes('Спасибо') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {submitMessage}
                    </div>
                  )}
                </form>
              </div>

              {/* Info */}
              <div className="space-y-6">
                <div className="bg-white border-2 border-yellow-600 rounded-3xl p-8 shadow-xl">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Контакты</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">📍</span>
                      <div>
                        <div className="font-semibold">Адрес</div>
                        <div className="text-gray-600">Астана, Казахстан</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">📞</span>
                      <div>
                        <div className="font-semibold">Телефон</div>
                        <a href="tel:+77006472376" className="text-yellow-600 hover:text-yellow-700">
                          +7 700 647 23 76
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">💬</span>
                      <div>
                        <div className="font-semibold">WhatsApp</div>
                        <a href="https://wa.me/77006472376" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">
                          +7 700 647 23 76
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">✉️</span>
                      <div>
                        <div className="font-semibold">Email</div>
                        <a href="mailto:info@dr-abayevich.kz" className="text-yellow-600 hover:text-yellow-700">
                          info@dr-abayevich.kz
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">🕐</span>
                      <div>
                        <div className="font-semibold">Часы работы</div>
                        <div className="text-gray-600">Пн-Пт: 9:00 - 20:00</div>
                        <div className="text-gray-600">Сб: 10:00 - 18:00</div>
                        <div className="text-gray-600">Вс: Выходной</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl p-8 shadow-xl text-white">
                  <h3 className="text-2xl font-bold mb-4">Экстренный случай?</h3>
                  <p className="mb-6">Свяжитесь с нами прямо сейчас для срочной консультации</p>
                  <div className="space-y-3">
                    <a
                      href="tel:+77006472376"
                      className="block w-full bg-white text-yellow-600 hover:bg-gray-100 text-center font-semibold py-4 rounded-xl transition"
                    >
                      Позвонить: +7 700 647 23 76
                    </a>
                    <a
                      href="https://wa.me/77006472376"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-green-500 hover:bg-green-600 text-white text-center font-semibold py-4 rounded-xl transition gap-2"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
