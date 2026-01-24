import { NextResponse } from 'next/server';
import { parseExcel } from '@/lib/excel';
import { normalizeText, normalizeVehicleNumber } from '@/lib/normalize';
import { db } from '@/index';
import { vehicle } from '@/db/schema/vehicle';
import { eq, sql, and } from 'drizzle-orm';

const REQUIRED_COLUMNS = [
  'apartment_name',
  'vehicle_number',
  'block_number',
  'floor',
  'name',
  'mobile',
];

type LogEntry = {
  rowNumber: number;
  apartmentName: string;
  vehicleNumber: string;
  status: 'FAILED' | 'SKIPPED' | 'RESTORED' | 'SUCCESS';
  reason?: string;
};
type ImportRow = {
  vehicle_number: string;
  block_number: string;
  name: string;
  mobile: string;
  floor: string;
  apartment_name: string;
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ message: 'Excel file is required' }, { status: 400 });
  }

  if (!file.name.endsWith('.xlsx')) {
    return NextResponse.json({ message: 'Only .xlsx files are supported' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const rows = parseExcel(buffer);

  if (!rows.length) {
    return NextResponse.json({ message: 'Excel file is empty' }, { status: 400 });
  }

  for (const col of REQUIRED_COLUMNS) {
    if (!(col in (rows[0] as Record<string, unknown>))) {
      return NextResponse.json({ message: 'Invalid vehicle template' }, { status: 400 });
    }
  }

  const logs: LogEntry[] = [];
  let success = 0;
  let skipped = 0;
  let restored = 0;
  let failed = 0;

  const adminUsername = 'system'; // replace with session value

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] as ImportRow;

    if (
      !row.apartment_name ||
      !row.vehicle_number ||
      !row.block_number ||
      row.floor === '' ||
      !row.name ||
      !row.mobile
    ) {
      failed++;
      logs.push({
        rowNumber: i + 2,
        apartmentName: row.apartment_name,
        vehicleNumber: row.vehicle_number,
        status: 'FAILED',
        reason: 'Required field missing',
      });
      continue;
    }

    const apartmentName = normalizeText(row.apartment_name);
    const vehicleNumber = normalizeVehicleNumber(row.vehicle_number);

    const apt = await db.query.apartment.findFirst({
      where: sql`lower(apartment_name) = ${apartmentName} AND is_deleted = false`,
    });

    if (!apt) {
      failed++;
      logs.push({
        rowNumber: i + 2,
        apartmentName: row.apartment_name,
        vehicleNumber,
        status: 'FAILED',
        reason: 'Apartment not found',
      });
      continue;
    }

    const existing = await db.query.vehicle.findFirst({
      where: and(eq(vehicle.apartmentId, apt.id), eq(vehicle.vehicleNumber, vehicleNumber)),
    });

    if (existing && !existing.isDeleted) {
      skipped++;
      logs.push({
        rowNumber: i + 2,
        apartmentName: row.apartment_name,
        vehicleNumber,
        status: 'SKIPPED',
        reason: 'Vehicle already exists',
      });
      continue;
    }

    if (existing && existing.isDeleted) {
      await db
        .update(vehicle)
        .set({
          isDeleted: false,
          blockNumber: row.block_number,
          floor: Number(row.floor),
          name: row.name,
          mobile: row.mobile,
          updatedBy: adminUsername,
          updatedAt: new Date(),
        })
        .where(eq(vehicle.id, existing.id));

      restored++;
      logs.push({
        rowNumber: i + 2,
        apartmentName: row.apartment_name,
        vehicleNumber,
        status: 'RESTORED',
      });
      continue;
    }

    await db.insert(vehicle).values({
      apartmentId: apt.id,
      vehicleNumber,
      blockNumber: row.block_number,
      floor: Number(row.floor),
      name: row.name,
      mobile: row.mobile,
      createdBy: adminUsername,
      updatedBy: adminUsername,
    });

    success++;
    logs.push({
      rowNumber: i + 2,
      apartmentName: row.apartment_name,
      vehicleNumber,
      status: 'SUCCESS',
    });
  }

  return NextResponse.json({
    summary: {
      total: rows.length,
      success,
      skipped,
      restored,
      failed,
    },
    logs,
  });
}
