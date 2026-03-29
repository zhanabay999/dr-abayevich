import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { doctors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/crm/doctors/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const [doctor] = await db.select().from(doctors).where(eq(doctors.id, parseInt(id))).limit(1);

  if (!doctor) return NextResponse.json({ error: 'Врач не найден' }, { status: 404 });

  return NextResponse.json({ doctor });
}

// PATCH /api/crm/doctors/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const [updated] = await db
    .update(doctors)
    .set({
      name: body.name,
      specialization: body.specialization,
      experience: body.experience,
      education: body.education || null,
      bio: body.bio || null,
      workPhone: body.workPhone || null,
      personalPhone: body.personalPhone || null,
      color: body.color || '#3B82F6',
      slotDuration: body.slotDuration || 30,
      updatedAt: new Date(),
    })
    .where(eq(doctors.id, parseInt(id)))
    .returning();

  return NextResponse.json(updated);
}

// DELETE /api/crm/doctors/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await db.update(doctors).set({ isActive: false, updatedAt: new Date() }).where(eq(doctors.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
