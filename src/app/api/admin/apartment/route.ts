import { NextResponse } from 'next/server';
import { apartment } from '@/db/schema/apartment';
import { db } from '@/index';
import { eq, and, lt, desc } from 'drizzle-orm';

export async function POST(req: Request) {
  const { apartmentName, pramukhName, pramukhMobile, bahadurName, bahadurMobile } =
    await req.json();

  if (!apartmentName || !pramukhName || !pramukhMobile || !bahadurName || !bahadurMobile) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    await db.insert(apartment).values({
      apartmentName: apartmentName.trim(),
      pramukhName: pramukhName.trim(),
      pramukhMobile: pramukhMobile.trim(),
      bahadurName: bahadurName.trim(),
      bahadurMobile: bahadurMobile.trim(),
    });

    return NextResponse.json({ success: true, message: 'Apartment added' }, { status: 201 });
  } catch (e) {
    console.log('Error adding apartment @/api/admin/apartment: ', e);
    return NextResponse.json({ message: 'Apartment already exists' }, { status: 500 });
  }
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? 20);
  const cursor = searchParams.get('cursor');

  const rows = await db
    .select({
      id: apartment.id,
      apartmentName: apartment.apartmentName,
      pramukhName: apartment.pramukhName,
      pramukhMobile: apartment.pramukhMobile,
      bahadurName: apartment.bahadurName,
      bahadurMobile: apartment.bahadurMobile,
      createdAt: apartment.createdAt,
    })
    .from(apartment)
    .where(
      and(
        eq(apartment.isDeleted, false),
        cursor ? lt(apartment.createdAt, new Date(cursor)) : undefined
      )
    )
    .orderBy(desc(apartment.createdAt))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const data = hasMore ? rows.slice(0, limit) : rows;

  return NextResponse.json({
    data,
    nextCursor: hasMore ? data[data.length - 1].createdAt : null,
  });
}
