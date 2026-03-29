import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { doctors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/crm/doctors
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await db
    .select()
    .from(doctors)
    .where(eq(doctors.isActive, true))
    .orderBy(doctors.order);

  return NextResponse.json({ doctors: data });
}
