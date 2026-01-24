import { NextRequest, NextResponse } from 'next/server';
import { and, eq, ilike } from 'drizzle-orm';
import { db } from '@/index';
import { vehicle } from '@/db/schema/vehicle';
import { normalizeVehicleNumber } from '@/lib/normalize';
import { apartment } from '@/db/schema';

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
        vehicleNumber: vehicle.vehicleNumber,
      })
      .from(vehicle)
      .where(ilike(vehicle.vehicleNumber, `%${query}%`))
      .limit(10);

    return NextResponse.json({ suggestions: result.map((r) => r.vehicleNumber) }, { status: 200 });
  }
  if (rawNumber) {
    const vehicleNumber = normalizeVehicleNumber(rawNumber);

    const result = await getVehicleWithApartment(vehicleNumber);

    if (!result) {
      return NextResponse.json({ found: false }, { status: 404 });
    }

    return NextResponse.json({ found: true, data: result }, { status: 200 });
  }
}

export async function getVehicleWithApartment(vehicleNumber: string) {
  const result = await db
    .select({
      vehicleNumber: vehicle.vehicleNumber,
      ownerName: vehicle.name,
      ownerMobile: vehicle.mobile,
      blockNumber: vehicle.blockNumber,
      floor: vehicle.floor,

      apartmentName: apartment.apartmentName,
      pramukhName: apartment.pramukhName,
      pramukhMobile: apartment.pramukhMobile,
      bahadurName: apartment.bahadurName,
      bahadurMobile: apartment.bahadurMobile,
    })
    .from(vehicle)
    .innerJoin(apartment, eq(vehicle.apartmentId, apartment.id))
    .where(
      and(
        eq(vehicle.vehicleNumber, vehicleNumber),
        eq(vehicle.isDeleted, false),
        eq(apartment.isDeleted, false)
      )
    )
    .limit(1);

  return result[0] ?? null;
}
