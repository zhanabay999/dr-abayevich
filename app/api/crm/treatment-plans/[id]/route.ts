import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { treatmentPlans, treatmentPlanItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// PATCH /api/crm/treatment-plans/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (body.title) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.status) updateData.status = body.status;
  if (body.totalCost !== undefined) updateData.totalCost = body.totalCost;

  const [updated] = await db
    .update(treatmentPlans)
    .set(updateData)
    .where(eq(treatmentPlans.id, parseInt(id)))
    .returning();

  return NextResponse.json(updated);
}

// DELETE /api/crm/treatment-plans/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  await db.delete(treatmentPlanItems).where(eq(treatmentPlanItems.planId, parseInt(id)));
  await db.delete(treatmentPlans).where(eq(treatmentPlans.id, parseInt(id)));

  return NextResponse.json({ success: true });
}
