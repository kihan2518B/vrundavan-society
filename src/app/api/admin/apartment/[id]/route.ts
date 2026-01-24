import { NextResponse } from 'next/server';
import { apartment } from '@/db/schema/apartment';
import { eq } from 'drizzle-orm';
import { db } from '@/index';

export async function DELETE(_: Request, context: { params: { id: string } }) {
  const params = await context.params;
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  await db
    .update(apartment)
    .set({
      isDeleted: true,
      updatedAt: new Date(),
    })
    .where(eq(apartment.id, id));

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  const params = await context.params;
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const { apartmentName, pramukhName, pramukhMobile, bahadurName, bahadurMobile } =
    await req.json();

  if (!apartmentName || !pramukhName || !pramukhMobile || !bahadurName || !bahadurMobile) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  await db
    .update(apartment)
    .set({
      apartmentName: apartmentName.trim(),
      pramukhName: pramukhName.trim(),
      pramukhMobile: pramukhMobile.trim(),
      bahadurName: bahadurName.trim(),
      bahadurMobile: bahadurMobile.trim(),
      updatedAt: new Date(),
    })
    .where(eq(apartment.id, id));

  return NextResponse.json({ success: true });
}
