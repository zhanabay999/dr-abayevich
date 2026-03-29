import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { toothRecords } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/crm/teeth?patientId=X
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const patientId = request.nextUrl.searchParams.get('patientId');
  if (!patientId) return NextResponse.json({ error: 'patientId required' }, { status: 400 });

  const data = await db
    .select()
    .from(toothRecords)
    .where(eq(toothRecords.patientId, parseInt(patientId)));

  return NextResponse.json({ teeth: data });
}

// POST /api/crm/teeth — create or update tooth record
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  if (!body.patientId || !body.toothNumber || !body.status) {
    return NextResponse.json({ error: 'patientId, toothNumber, status required' }, { status: 400 });
  }

  // Check if record exists
  const existing = await db
    .select()
    .from(toothRecords)
    .where(and(eq(toothRecords.patientId, body.patientId), eq(toothRecords.toothNumber, body.toothNumber)))
    .limit(1);

  if (existing.length > 0) {
    // Update
    const [updated] = await db
      .update(toothRecords)
      .set({
        status: body.status,
        notes: body.notes || null,
        updatedAt: new Date(),
        updatedBy: parseInt(session.user.id),
      })
      .where(eq(toothRecords.id, existing[0].id))
      .returning();
    return NextResponse.json(updated);
  }

  // Create
  const [created] = await db
    .insert(toothRecords)
    .values({
      patientId: body.patientId,
      toothNumber: body.toothNumber,
      status: body.status,
      notes: body.notes || null,
      updatedBy: parseInt(session.user.id),
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
