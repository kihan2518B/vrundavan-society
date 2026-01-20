import { NextResponse } from 'next/server';
import { vehical } from '@/db/schema/vehical';
import { normalizeVehicleNumber } from '@/lib/normalize';
import { db } from '@/index';
import { eq, asc } from 'drizzle-orm';

export async function POST(req: Request) {
  const { vehicleNumber, ownerName, flatNumber, contactNumber } = await req.json();

  if (!vehicleNumber || !ownerName || !flatNumber || !contactNumber) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const vn = normalizeVehicleNumber(vehicleNumber);

  try {
    await db.insert(vehical).values({
      vehicleNumber: vn,
      ownerName: ownerName.trim(),
      flatNumber: flatNumber.trim(),
      contactNumber: contactNumber.trim(),
    });

    return NextResponse.json({ success: true, message: 'Vehicle added' }, { status: 201 });
  } catch (e) {
    console.log('Error adding vehicle @/api/admin/vehical: ', e);
    return NextResponse.json({ message: 'Vehicle already exists' }, { status: 500 });
  }
}

export async function GET() {
  const data = await db
    .select({
      id: vehical.id,
      vehicleNumber: vehical.vehicleNumber,
      ownerName: vehical.ownerName,
      flatNumber: vehical.flatNumber,
      contactNumber: vehical.contactNumber,
      createdAt: vehical.createdAt,
    })
    .from(vehical)
    .where(eq(vehical.isDeleted, false))
    .orderBy(asc(vehical.flatNumber));

  return NextResponse.json({ data });
}
