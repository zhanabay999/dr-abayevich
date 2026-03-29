import { NextRequest, NextResponse } from 'next/server';
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

// POST /api/crm/doctors
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  if (!body.name || !body.specialization) {
    return NextResponse.json({ error: 'Имя и специализация обязательны' }, { status: 400 });
  }

  const [newDoctor] = await db
    .insert(doctors)
    .values({
      name: body.name,
      specialization: body.specialization,
      experience: body.experience || 0,
      education: body.education || null,
      bio: body.bio || null,
      workPhone: body.workPhone || null,
      personalPhone: body.personalPhone || null,
      color: body.color || '#3B82F6',
      slotDuration: body.slotDuration || 30,
    })
    .returning();

  return NextResponse.json(newDoctor, { status: 201 });
}
