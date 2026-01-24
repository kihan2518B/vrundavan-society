import { NextResponse } from 'next/server';
import { apartment } from '@/db/schema/apartment';
import { db } from '@/index';
import { eq, and, desc } from 'drizzle-orm';

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
export async function GET() {
  try {
    const data = await db
      .select({
        id: apartment.id,
        apartmentName: apartment.apartmentName,
      })
      .from(apartment)
      .where(and(eq(apartment.isDeleted, false)))
      .orderBy(desc(apartment.createdAt));

    return NextResponse.json(
      {
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching apartments @/api/admin/apartment: ', error);
    return NextResponse.json({ message: 'Error fetching apartments' }, { status: 500 });
  }
}
