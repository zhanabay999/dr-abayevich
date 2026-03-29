import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { doctorSchedules } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/crm/doctors/[id]/schedule
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  const schedules = await db
    .select()
    .from(doctorSchedules)
    .where(eq(doctorSchedules.doctorId, parseInt(id)))
    .orderBy(doctorSchedules.dayOfWeek);

  return NextResponse.json({ schedules });
}

// POST /api/crm/doctors/[id]/schedule — set weekly schedule
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  // body.schedules = [{ dayOfWeek, startTime, endTime, isActive }]
  if (!body.schedules || !Array.isArray(body.schedules)) {
    return NextResponse.json({ error: 'schedules array required' }, { status: 400 });
  }

  const doctorId = parseInt(id);

  // Delete existing
  await db.delete(doctorSchedules).where(eq(doctorSchedules.doctorId, doctorId));

  // Insert new
  for (const s of body.schedules) {
    if (s.isActive && s.startTime && s.endTime) {
      await db.insert(doctorSchedules).values({
        doctorId,
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        slotDuration: s.slotDuration || 30,
        isActive: true,
      });
    }
  }

  const result = await db
    .select()
    .from(doctorSchedules)
    .where(eq(doctorSchedules.doctorId, doctorId))
    .orderBy(doctorSchedules.dayOfWeek);

  return NextResponse.json({ schedules: result });
}
