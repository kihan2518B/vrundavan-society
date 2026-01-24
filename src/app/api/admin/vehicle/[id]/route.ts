import { NextResponse } from 'next/server';
import { vehicle } from '@/db/schema/vehicle';
import { eq } from 'drizzle-orm';
import { db } from '@/index';
import { normalizeVehicleNumber } from '@/lib/normalize';

export async function DELETE(_: Request, context: { params: { id: string } }) {
  const params = await context.params;
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  await db
    .update(vehicle)
    .set({
      isDeleted: true,
      updatedAt: new Date(),
    })
    .where(eq(vehicle.id, id));

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  const params = await context.params;
  const id = Number(params.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const { vehicleNumber, ownerName, blockNumber, floor, contactNumber, apartmentId } =
    await req.json();

  if (!vehicleNumber || !ownerName || !blockNumber || !contactNumber || !floor || !apartmentId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const vn = normalizeVehicleNumber(vehicleNumber);

  await db
    .update(vehicle)
    .set({
      vehicleNumber: vn,
      name: ownerName.trim(),
      blockNumber: blockNumber.trim(),
      floor: floor.trim(),
      apartmentId: apartmentId,
      mobile: contactNumber.trim(),
      updatedAt: new Date(),
    })
    .where(eq(vehicle.id, id));

  return NextResponse.json({ success: true });
}
