import { NextResponse } from 'next/server';
import { vehicle } from '@/db/schema/vehicle';
import { normalizeVehicleNumber } from '@/lib/normalize';
import { db } from '@/index';
import { eq, and, lt, desc } from 'drizzle-orm';

export async function POST(req: Request) {
  const { vehicleNumber, ownerName, contactNumber, blockNumber, floor, apartmentId } =
    await req.json();

  if (!vehicleNumber || !ownerName || !contactNumber || !blockNumber || !floor) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const vn = normalizeVehicleNumber(vehicleNumber);

  try {
    await db.insert(vehicle).values({
      vehicleNumber: vn,
      name: ownerName.trim(),
      mobile: contactNumber.trim(),
      blockNumber: blockNumber,
      floor: floor,
      apartmentId: apartmentId,
      createdBy: 'admin',
      updatedBy: 'admin',
    });

    return NextResponse.json({ success: true, message: 'Vehicle added' }, { status: 201 });
  } catch (e) {
    console.error('Error adding vehicle @/api/admin/vehicle: ', e);
    return NextResponse.json({ message: 'Vehicle already exists' }, { status: 500 });
  }
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? 20);
  const cursor = searchParams.get('cursor');

  const rows = await db
    .select({
      id: vehicle.id,
      vehicleNumber: vehicle.vehicleNumber,
      ownerName: vehicle.name,
      blockNumber: vehicle.blockNumber,
      mobile: vehicle.mobile,
      floor: vehicle.floor,
      apartmentId: vehicle.apartmentId,
      updatedBy: vehicle.updatedBy,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    })
    .from(vehicle)
    .where(
      and(
        eq(vehicle.isDeleted, false),
        cursor ? lt(vehicle.createdAt, new Date(cursor)) : undefined
      )
    )
    .orderBy(desc(vehicle.createdAt))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const data = hasMore ? rows.slice(0, limit) : rows;

  return NextResponse.json({
    data,
    nextCursor: hasMore ? data[data.length - 1].createdAt : null,
  });
}
