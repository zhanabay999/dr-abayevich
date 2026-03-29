import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { patients, crmAppointments } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/crm/patients/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const [patient] = await db.select().from(patients).where(eq(patients.id, parseInt(id))).limit(1);

  if (!patient) return NextResponse.json({ error: 'Пациент не найден' }, { status: 404 });

  // Get patient appointments
  const appointments = await db
    .select()
    .from(crmAppointments)
    .where(and(eq(crmAppointments.patientId, parseInt(id)), eq(crmAppointments.isDeleted, false)))
    .orderBy(sql`${crmAppointments.startTime} DESC`);

  return NextResponse.json({ patient, appointments });
}

// PATCH /api/crm/patients/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const [updated] = await db
    .update(patients)
    .set({
      firstName: body.firstName,
      lastName: body.lastName,
      middleName: body.middleName || null,
      phone: body.phone,
      email: body.email || null,
      iin: body.iin || null,
      dateOfBirth: body.dateOfBirth || null,
      gender: body.gender || null,
      address: body.address || null,
      insuranceNumber: body.insuranceNumber || null,
      insuranceCompany: body.insuranceCompany || null,
      notes: body.notes || null,
      source: body.source || null,
      updatedAt: new Date(),
    })
    .where(eq(patients.id, parseInt(id)))
    .returning();

  return NextResponse.json(updated);
}

// DELETE /api/crm/patients/[id] (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await db.update(patients).set({ isDeleted: true, updatedAt: new Date() }).where(eq(patients.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
