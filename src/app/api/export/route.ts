import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { getAllActiveVehicles } from '@/helpers/query';

export async function GET() {
  const vehicles = await getAllActiveVehicles();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Vehicles');

  sheet.columns = [
    { header: 'Vehicle Number', key: 'vehicleNumber', width: 20 },
    { header: 'Owner Name', key: 'ownerName', width: 25 },
    { header: 'Flat Number', key: 'flatNumber', width: 15 },
    { header: 'Added On', key: 'createdAt', width: 20 },
  ];

  vehicles.forEach((v) => {
    sheet.addRow({
      vehicleNumber: v.vehicleNumber,
      ownerName: v.ownerName,
      flatNumber: v.flatNumber,
      createdAt: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : '',
    });
  });

  // Make header bold (usability)
  sheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="vehicles.xlsx"',
    },
  });
}
