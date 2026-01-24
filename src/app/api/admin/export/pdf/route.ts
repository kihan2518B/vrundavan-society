import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { eq, asc } from 'drizzle-orm';
import { db } from '@/index';
import { vehicle } from '@/db/schema/vehicle';

export async function GET() {
  const rows = await db
    .select({
      vehicleNumber: vehicle.vehicleNumber,
      ownerName: vehicle.name,
      blockNumber: vehicle.blockNumber,
      mobile: vehicle.mobile,
      floor: vehicle.floor,
    })
    .from(vehicle)
    .where(eq(vehicle.isDeleted, false))
    .orderBy(asc(vehicle.blockNumber));

  const pdfDoc = await PDFDocument.create();

  // Use built-in font (SAFE, no filesystem access)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  let y = height - 40;

  const drawText = (text: string, x: number, size = 10) => {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  };

  // Title
  page.drawText('Vehicle Records', {
    x: width / 2 - 60,
    y,
    size: 16,
    font,
  });

  y -= 30;

  // Headers
  drawText('Vehicle', 40);
  drawText('Owner', 160);
  drawText('Flat', 320);
  drawText('Contact', 380);

  y -= 15;

  for (const v of rows) {
    if (y < 40) {
      page = pdfDoc.addPage([595, 842]);
      y = height - 40;
    }

    drawText(v.vehicleNumber, 40);
    drawText(v.ownerName, 160);
    drawText(v.blockNumber, 320);
    drawText(v.mobile, 380);

    y -= 15;
  }

  const pdfBytes = await pdfDoc.save();
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="vehicles.pdf"',
    },
  });
}
