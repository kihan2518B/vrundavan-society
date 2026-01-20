import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db } from '@/index';
import { vehical } from '@/db/schema/vehical';
import { normalizeVehicleNumber } from '@/lib/normalize';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawNumber = searchParams.get('number');

  if (!rawNumber) {
    return NextResponse.json({ error: 'Vehicle number required' }, { status: 400 });
  }

  const vehicleNumber = normalizeVehicleNumber(rawNumber);

  const result = await db
    .select({
      ownerName: vehical.ownerName,
      flatNumber: vehical.flatNumber,
      contactNumber: vehical.contactNumber,
    })
    .from(vehical)
    .where(and(eq(vehical.vehicleNumber, vehicleNumber), eq(vehical.isDeleted, false)))
    .limit(1);

  if (result.length === 0) {
    return NextResponse.json({ found: false }, { status: 404 });
  }

  return NextResponse.json({ found: true, data: result[0] }, { status: 200 });
}
