import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { treatmentPlans, treatmentPlanItems } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/crm/treatment-plans?patientId=X
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const patientId = request.nextUrl.searchParams.get('patientId');

  const conditions = patientId ? eq(treatmentPlans.patientId, parseInt(patientId)) : undefined;

  const plans = await db
    .select()
    .from(treatmentPlans)
    .where(conditions)
    .orderBy(sql`${treatmentPlans.createdAt} DESC`);

  // Get items for each plan
  const plansWithItems = await Promise.all(
    plans.map(async (plan) => {
      const items = await db
        .select()
        .from(treatmentPlanItems)
        .where(eq(treatmentPlanItems.planId, plan.id))
        .orderBy(treatmentPlanItems.sortOrder);
      return { ...plan, items };
    })
  );

  return NextResponse.json({ plans: plansWithItems });
}

// POST /api/crm/treatment-plans
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  if (!body.patientId || !body.doctorId || !body.title) {
    return NextResponse.json({ error: 'patientId, doctorId, title required' }, { status: 400 });
  }

  const [plan] = await db
    .insert(treatmentPlans)
    .values({
      patientId: body.patientId,
      doctorId: body.doctorId,
      title: body.title,
      description: body.description || null,
      status: body.status || 'draft',
      totalCost: body.totalCost || 0,
    })
    .returning();

  // Add items if provided
  if (body.items && Array.isArray(body.items)) {
    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i];
      await db.insert(treatmentPlanItems).values({
        planId: plan.id,
        toothNumber: item.toothNumber || null,
        serviceId: item.serviceId || null,
        description: item.description,
        cost: item.cost || 0,
        sortOrder: i,
      });
    }
  }

  return NextResponse.json(plan, { status: 201 });
}
