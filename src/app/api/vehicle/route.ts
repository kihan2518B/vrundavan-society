import { NextRequest, NextResponse } from 'next/server';
import { and, eq, ilike } from 'drizzle-orm';
import { db } from '@/index';
import { vehicle } from '@/db/schema/vehicle';
import { normalizeVehicleNumber } from '@/lib/normalize';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawNumber = searchParams.get('number');
  const query = searchParams.get('query');

  if (!rawNumber && !query) {
    return NextResponse.json({ error: 'Vehicle number or query required' }, { status: 400 });
  }

  if (query) {
    const result = await db
      .select({
        ownerName: vehicle.name,
        flatNumber: vehicle.blockNumber,
        contactNumber: vehicle.mobile,
        vehicleNumber: vehicle.vehicleNumber,
      })
      .from(vehicle)
      .where(ilike(vehicle.vehicleNumber, `%${query}%`))
      .limit(10);

    return NextResponse.json({ suggestions: result.map((r) => r.vehicleNumber) }, { status: 200 });
  }
  if (rawNumber) {
    const vehicleNumber = normalizeVehicleNumber(rawNumber);
    console.log('vehicleNumber: ', vehicleNumber);

    const result = await db
      .select({
        ownerName: vehicle.name,
        flatNumber: vehicle.blockNumber,
        contactNumber: vehicle.mobile,
      })
      .from(vehicle)
      .where(and(eq(vehicle.vehicleNumber, vehicleNumber), eq(vehicle.isDeleted, false)))
      .limit(1);
    console.log('result:', result);

    if (result.length === 0) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    return NextResponse.json({ found: true, data: result[0] }, { status: 200 });
  }
}
