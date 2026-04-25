import { NextResponse } from 'next/server';
import { vehicle } from '@/db/schema/vehicle';
import { normalizeVehicleNumber } from '@/lib/normalize';
import { db } from '@/index';
import { eq, and, lt, ilike, asc } from 'drizzle-orm';
import { apartment } from '@/db/schema';

export async function POST(req: Request) {
  const { vehicleNumber, ownerName, contactNumber, blockNumber, floor, apartmentId } =
    await req.json();

  if (!vehicleNumber || !ownerName || !contactNumber || !blockNumber || !floor) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  console.log(
    'vehicleNumber, ownerName, contactNumber, blockNumber, floor, apartmentId:',
    vehicleNumber,
    ownerName,
    contactNumber,
    blockNumber,
    floor,
    apartmentId
  );

  const vn = normalizeVehicleNumber(vehicleNumber);

  try {
    await db.insert(vehicle).values({
      vehicleNumber: vn,
      name: ownerName.trim(),
      mobile: contactNumber.trim(),
      blockNumber: blockNumber,
      floor: floor,
      apartmentId: apartmentId,
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

  const apartmentIdParam = searchParams.get('apartmentId');
  const block = searchParams.get('block');
  const floorParam = searchParams.get('floor');
  const search = searchParams.get('search');

  const apartmentId = apartmentIdParam ? Number(apartmentIdParam) : null;
  const floor = floorParam ? Number(floorParam) : null;

  const rows = await db
    .select({
      id: vehicle.id,
      vehicleNumber: vehicle.vehicleNumber,
      ownerName: vehicle.name,
      contactNumber: vehicle.mobile,
      blockNumber: vehicle.blockNumber,
      floor: vehicle.floor,
      apartmentId: vehicle.apartmentId,
      apartmentName: apartment.apartmentName,
      createdAt: vehicle.createdAt,
    })
    .from(vehicle)
    .leftJoin(apartment, eq(vehicle.apartmentId, apartment.id))
    .where(
      and(
        eq(vehicle.isDeleted, false),

        apartmentId !== null ? eq(vehicle.apartmentId, apartmentId) : undefined,

        block ? ilike(vehicle.blockNumber, `%${block}%`) : undefined,

        floor !== null ? eq(vehicle.floor, floor) : undefined,

        search ? ilike(vehicle.vehicleNumber, `%${search}%`) : undefined,

        cursor ? lt(vehicle.createdAt, new Date(cursor)) : undefined
      )
    )
    .orderBy(asc(vehicle.vehicleNumber))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const data = hasMore ? rows.slice(0, limit) : rows;

  return NextResponse.json({
    data,
    nextCursor: hasMore ? data[data.length - 1].createdAt : null,
  });
}
