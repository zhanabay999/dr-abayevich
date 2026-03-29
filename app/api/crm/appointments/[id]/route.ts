import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { crmAppointments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// PATCH /api/crm/appointments/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if (body.status) updateData.status = body.status;
  if (body.startTime) updateData.startTime = new Date(body.startTime);
  if (body.endTime) updateData.endTime = new Date(body.endTime);
  if (body.doctorId) updateData.doctorId = body.doctorId;
  if (body.notes !== undefined) updateData.notes = body.notes;
  if (body.cancelReason !== undefined) updateData.cancelReason = body.cancelReason;

  const [updated] = await db
    .update(crmAppointments)
    .set(updateData)
    .where(eq(crmAppointments.id, parseInt(id)))
    .returning();

  return NextResponse.json(updated);
}

// DELETE /api/crm/appointments/[id] (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await db.update(crmAppointments).set({ isDeleted: true, updatedAt: new Date() }).where(eq(crmAppointments.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
