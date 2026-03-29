import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rooms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/crm/rooms
export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await db
    .select()
    .from(rooms)
    .where(eq(rooms.isActive, true))
    .orderBy(rooms.sortOrder);

  return NextResponse.json({ rooms: data });
}
