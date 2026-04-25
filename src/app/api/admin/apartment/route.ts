import { NextResponse } from 'next/server';
import { apartment } from '@/db/schema/apartment';
import { db } from '@/index';
import { eq, and, lt, asc } from 'drizzle-orm';

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
  try {
    const { searchParams } = new URL(req.url);
    const onlyNames = searchParams.get('onlyNames');

    if (onlyNames === 'true') {
      const data = await db
        .select({
          id: apartment.id,
          apartmentName: apartment.apartmentName,
        })
        .from(apartment)
        .where(and(eq(apartment.isDeleted, false)))
        .orderBy(asc(apartment.apartmentName));

      return NextResponse.json(
        {
          data,
        },
        { status: 200 }
      );
    } else {
      const limit = Number(searchParams.get('limit') ?? 20);
      const cursor = searchParams.get('cursor');

      const rows = await db
        .select({
          id: apartment.id,
          bahadurMobile: apartment.bahadurMobile,
          bahadurName: apartment.bahadurName,
          pramukhMobile: apartment.pramukhMobile,
          pramukhName: apartment.pramukhName,
          apartmentName: apartment.apartmentName,
          createdAt: apartment.createdAt,
        })
        .from(apartment)
        .where(
          and(
            eq(apartment.isDeleted, false),
            cursor ? lt(apartment.createdAt, new Date(cursor)) : undefined
          )
        )
        .orderBy(asc(apartment.apartmentName))
        .limit(limit + 1);

      const hasMore = rows.length > limit;
      const data = hasMore ? rows.slice(0, limit) : rows;

      return NextResponse.json({
        data,
        nextCursor: hasMore ? data[data.length - 1].createdAt : null,
      });
    }
  } catch (error) {
    console.error('Error fetching apartments @/api/admin/apartment: ', error);
    return NextResponse.json({ message: 'Error fetching apartments' }, { status: 500 });
  }
}
