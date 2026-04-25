// import { NextResponse } from 'next/server';
// import ExcelJS from 'exceljs';
// import { eq, asc } from 'drizzle-orm';
// import { db } from '@/index';
// import { vehicle } from '@/db/schema/vehicle';

// export async function GET() {
//   const rows = await db
//     .select({
//       vehicleNumber: vehicle.vehicleNumber,
//       name: vehicle.name,
//       blockNumber: vehicle.blockNumber,
//       mobile: vehicle.mobile,
//       floor: vehicle.floor,
//       createdAt: vehicle.createdAt,
//     })
//     .from(vehicle)
//     .where(eq(vehicle.isDeleted, false))
//     .orderBy(asc(vehicle.blockNumber));

//   const workbook = new ExcelJS.Workbook();
//   const sheet = workbook.addWorksheet('Vehicles');

//   sheet.columns = [
//     { header: 'Vehicle Number', key: 'vehicleNumber', width: 20 },
//     { header: 'Owner Name', key: 'name', width: 25 },
//     { header: 'Flat Number', key: 'blockNumber', width: 15 },
//     { header: 'Floor', key: 'floor', width: 10 },
//     { header: 'Contact Number', key: 'mobile', width: 18 },
//     { header: 'Added On', key: 'createdAt', width: 18 },
//   ];

//   rows.forEach((v) => {
//     sheet.addRow({
//       vehicleNumber: v.vehicleNumber,
//       name: v.name,
//       floor: v.floor,
//       blockNumber: v.blockNumber,
//       mobile: v.mobile,
//       createdAt: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : '',
//     });
//   });

//   sheet.getRow(1).font = { bold: true };

//   const buffer = await workbook.xlsx.writeBuffer();

//   return new NextResponse(buffer, {
//     headers: {
//       'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       'Content-Disposition': 'attachment; filename="vehicles.xlsx"',
//     },
//   });
// }

// app/api/admin/export/excel/route.ts
import { getVehicles } from '@/helpers/query';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const filters = {
    apartmentId: searchParams.get('apartmentId'),
    block: searchParams.get('block'),
    floor: searchParams.get('floor'),
    search: searchParams.get('search'),
  };

  const vehicles = await getVehicles({
    filters,
    sort: { by: 'hierarchy', order: 'asc' },
  });

  const rows = vehicles.map((v) => ({
    Apartment: v.apartmentName ?? '',
    Vehicle: v.vehicleNumber,
    Owner: v.ownerName,
    Mobile: v.contactNumber,
    Block: v.blockNumber,
    Floor: v.floor,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehicles');

  const buffer = XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx',
  });

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="vehicles.xlsx"',
    },
  });
}
