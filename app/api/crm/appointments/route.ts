import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { crmAppointments } from '@/lib/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/crm/appointments?date=YYYY-MM-DD
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');

  if (dateStr) {
    const dayStart = new Date(dateStr);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dateStr);
    dayEnd.setHours(23, 59, 59, 999);

    const data = await db
      .select()
      .from(crmAppointments)
      .where(
        and(
          eq(crmAppointments.isDeleted, false),
          gte(crmAppointments.startTime, dayStart),
          lte(crmAppointments.startTime, dayEnd)
        )
      )
      .orderBy(crmAppointments.startTime);

    return NextResponse.json({ appointments: data });
  }

  // Without date filter — return recent
  const data = await db
    .select()
    .from(crmAppointments)
    .where(eq(crmAppointments.isDeleted, false))
    .orderBy(sql`${crmAppointments.startTime} DESC`)
    .limit(50);

  return NextResponse.json({ appointments: data });
}

// POST /api/crm/appointments
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  if (!body.patientId || !body.doctorId || !body.startTime || !body.endTime) {
    return NextResponse.json(
      { error: 'patientId, doctorId, startTime, endTime обязательны' },
      { status: 400 }
    );
  }

  const [newAppointment] = await db
    .insert(crmAppointments)
    .values({
      patientId: body.patientId,
      doctorId: body.doctorId,
      roomId: body.roomId || null,
      serviceId: body.serviceId || null,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      status: body.status || 'scheduled',
      color: body.color || null,
      notes: body.notes || null,
      createdBy: parseInt(session.user.id),
    })
    .returning();

  return NextResponse.json(newAppointment, { status: 201 });
}
