import { NextResponse } from 'next/server';
import { vehical } from '@/db/schema/vehical';
import { eq } from 'drizzle-orm';
import { db } from '@/index';
import { normalizeVehicleNumber } from '@/lib/normalize';

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  await db
    .update(vehical)
    .set({
      isDeleted: true,
      updatedAt: new Date(),
    })
    .where(eq(vehical.id, id));

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  const params = await context.params;
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const { vehicleNumber, ownerName, flatNumber, contactNumber } = await req.json();

  if (!vehicleNumber || !ownerName || !flatNumber || !contactNumber) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const vn = normalizeVehicleNumber(vehicleNumber);

  await db
    .update(vehical)
    .set({
      vehicleNumber: vn,
      ownerName: ownerName.trim(),
      flatNumber: flatNumber.trim(),
      contactNumber: contactNumber.trim(),
      updatedAt: new Date(),
    })
    .where(eq(vehical.id, id));

  return NextResponse.json({ success: true });
}
