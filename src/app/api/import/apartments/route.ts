import { NextResponse } from 'next/server';
import { parseExcel } from '@/lib/excel';
import { normalizeText } from '@/lib/normalize';
import { db } from '@/index';
import { apartment } from '@/db/schema/apartment';
import { eq, sql } from 'drizzle-orm';

const REQUIRED_COLUMNS = [
  'apartment_name',
  'pramukh_name',
  'pramukh_mobile',
  'bahadur_name',
  'bahadur_mobile',
];

type LogEntry = {
  rowNumber: number;
  apartmentName: string;
  status: 'INSERTED' | 'UPDATED' | 'FAILED';
  reason?: string;
};
type ImportRow = {
  pramukh_name: string;
  pramukh_mobile: string;
  bahadur_name: string;
  bahadur_mobile: string;
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
      return NextResponse.json({ message: 'Invalid apartment template' }, { status: 400 });
    }
  }

  const logs: LogEntry[] = [];
  let inserted = 0;
  let updated = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] as ImportRow;

    const apartmentName = normalizeText(row.apartment_name || '');

    if (
      !apartmentName ||
      !row.pramukh_name ||
      !row.pramukh_mobile ||
      !row.bahadur_name ||
      !row.bahadur_mobile
    ) {
      failed++;
      logs.push({
        rowNumber: i + 2,
        apartmentName: row.apartment_name,
        status: 'FAILED',
        reason: 'Required field missing',
      });
      continue;
    }

    const existing = await db.query.apartment.findFirst({
      where: sql`lower(apartment_name) = ${apartmentName} AND is_deleted = false`,
    });

    if (existing) {
      await db
        .update(apartment)
        .set({
          pramukhName: row.pramukh_name,
          pramukhMobile: row.pramukh_mobile,
          bahadurName: row.bahadur_name,
          bahadurMobile: row.bahadur_mobile,
          updatedAt: new Date(),
        })
        .where(eq(apartment.id, existing.id));

      updated++;
      logs.push({
        rowNumber: i + 2,
        apartmentName: row.apartment_name,
        status: 'UPDATED',
      });
    } else {
      await db.insert(apartment).values({
        apartmentName: row.apartment_name,
        pramukhName: row.pramukh_name,
        pramukhMobile: row.pramukh_mobile,
        bahadurName: row.bahadur_name,
        bahadurMobile: row.bahadur_mobile,
      });

      inserted++;
      logs.push({
        rowNumber: i + 2,
        apartmentName: row.apartment_name,
        status: 'INSERTED',
      });
    }
  }

  return NextResponse.json({
    summary: {
      total: rows.length,
      inserted,
      updated,
      failed,
    },
    logs,
  });
}
