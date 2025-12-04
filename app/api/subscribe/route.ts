import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subscribers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Некорректный email' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].isActive) {
        return NextResponse.json(
          { error: 'Этот email уже подписан на рассылку' },
          { status: 400 }
        );
      } else {
        // Reactivate subscription
        await db
          .update(subscribers)
          .set({ isActive: true })
          .where(eq(subscribers.email, email));

        return NextResponse.json({ success: true }, { status: 200 });
      }
    }

    // Add new subscriber
    await db.insert(subscribers).values({
      email,
      isActive: true,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json(
      { error: 'Ошибка при подписке' },
      { status: 500 }
    );
  }
}
