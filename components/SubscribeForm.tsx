'use client';

import { useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Спасибо за подписку!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Произошла ошибка');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Произошла ошибка. Попробуйте позже.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш email"
            required
            disabled={status === 'loading'}
            className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-200"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 px-8 py-3 rounded-full font-semibold transition"
          >
            {status === 'loading' ? '...' : 'Подписаться'}
          </button>
        </div>
      </form>
      {message && (
        <p
          className={`text-center mt-4 ${
            status === 'success' ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
