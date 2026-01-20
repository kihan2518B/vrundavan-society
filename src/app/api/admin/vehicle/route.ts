import { NextResponse } from 'next/server';
import { vehical } from '@/db/schema/vehical';
import { normalizeVehicleNumber } from '@/lib/normalize';
import { db } from '@/index';
import { eq, and, lt, desc } from 'drizzle-orm';

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
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') ?? 20);
  const cursor = searchParams.get('cursor');

  const rows = await db
    .select({
      id: vehical.id,
      vehicleNumber: vehical.vehicleNumber,
      ownerName: vehical.ownerName,
      flatNumber: vehical.flatNumber,
      contactNumber: vehical.contactNumber,
      createdAt: vehical.createdAt,
    })
    .from(vehical)
    .where(
      and(
        eq(vehical.isDeleted, false),
        cursor ? lt(vehical.createdAt, new Date(cursor)) : undefined
      )
    )
    .orderBy(desc(vehical.createdAt))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const data = hasMore ? rows.slice(0, limit) : rows;

  return NextResponse.json({
    data,
    nextCursor: hasMore ? data[data.length - 1].createdAt : null,
  });
}
