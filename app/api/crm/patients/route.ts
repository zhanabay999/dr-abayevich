import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { patients } from '@/lib/db/schema';
import { eq, or, ilike, sql, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/crm/patients - список пациентов с поиском и пагинацией
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const conditions = [eq(patients.isDeleted, false)];

  if (search) {
    conditions.push(
      or(
        ilike(patients.firstName, `%${search}%`),
        ilike(patients.lastName, `%${search}%`),
        ilike(patients.phone, `%${search}%`),
        ilike(patients.iin, `%${search}%`)
      )!
    );
  }

  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(patients)
    .where(and(...conditions));

  const data = await db
    .select()
    .from(patients)
    .where(and(...conditions))
    .orderBy(sql`${patients.createdAt} DESC`)
    .limit(limit)
    .offset(offset);

  return NextResponse.json({
    patients: data,
    total: countResult.count,
    page,
    totalPages: Math.ceil(countResult.count / limit),
  });
}

// POST /api/crm/patients - создать пациента
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  if (!body.firstName || !body.lastName || !body.phone) {
    return NextResponse.json(
      { error: 'Имя, фамилия и телефон обязательны' },
      { status: 400 }
    );
  }

  const [newPatient] = await db
    .insert(patients)
    .values({
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
      createdBy: parseInt(session.user.id),
    })
    .returning();

  return NextResponse.json(newPatient, { status: 201 });
}
