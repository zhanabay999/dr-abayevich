import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { appointments } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, service, preferredDate, preferredTime, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Имя и телефон обязательны' },
        { status: 400 }
      );
    }

    await db.insert(appointments).values({
      name,
      phone,
      email: email || null,
      serviceId: null, // Can be linked later if needed
      doctorId: null,
      preferredDate: preferredDate || null,
      preferredTime: preferredTime || null,
      message: message || null,
      status: 'new',
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании записи' },
      { status: 500 }
    );
  }
}
