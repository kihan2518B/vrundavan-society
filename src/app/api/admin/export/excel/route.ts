import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { eq, asc } from 'drizzle-orm';
import { db } from '@/index';
import { vehical } from '@/db/schema/vehical';

export async function GET() {
  const rows = await db
    .select({
      vehicleNumber: vehical.vehicleNumber,
      ownerName: vehical.ownerName,
      flatNumber: vehical.flatNumber,
      contactNumber: vehical.contactNumber,
      createdAt: vehical.createdAt,
    })
    .from(vehical)
    .where(eq(vehical.isDeleted, false))
    .orderBy(asc(vehical.flatNumber));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Vehicles');

  sheet.columns = [
    { header: 'Vehicle Number', key: 'vehicleNumber', width: 20 },
    { header: 'Owner Name', key: 'ownerName', width: 25 },
    { header: 'Flat Number', key: 'flatNumber', width: 15 },
    { header: 'Contact Number', key: 'contactNumber', width: 18 },
    { header: 'Added On', key: 'createdAt', width: 18 },
  ];

  rows.forEach((v) => {
    sheet.addRow({
      vehicleNumber: v.vehicleNumber,
      ownerName: v.ownerName,
      flatNumber: v.flatNumber,
      contactNumber: v.contactNumber,
      createdAt: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : '',
    });
  });

  sheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="vehicles.xlsx"',
    },
  });
}
