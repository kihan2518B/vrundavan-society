import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
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
    })
    .from(vehical)
    .where(eq(vehical.isDeleted, false))
    .orderBy(asc(vehical.flatNumber));

  const doc = new PDFDocument({ size: 'A4', margin: 40 });

  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => {});

  doc.fontSize(16).text('Vehicle Records', { align: 'center' });
  doc.moveDown();

  doc.fontSize(10);

  const tableTop = doc.y;
  const colX = {
    vehicle: 40,
    owner: 130,
    flat: 260,
    contact: 320,
  };

  doc.text('Vehicle', colX.vehicle, tableTop);
  doc.text('Owner', colX.owner, tableTop);
  doc.text('Flat', colX.flat, tableTop);
  doc.text('Contact', colX.contact, tableTop);

  doc.moveDown(0.5);
  doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();

  let y = doc.y + 5;

  rows.forEach((v) => {
    if (y > 750) {
      doc.addPage();
      y = 40;
    }

    doc.text(v.vehicleNumber, colX.vehicle, y);
    doc.text(v.ownerName, colX.owner, y);
    doc.text(v.flatNumber, colX.flat, y);
    doc.text(v.contactNumber, colX.contact, y);

    y += 18;
  });

  doc.end();

  const pdfBuffer = Buffer.concat(chunks);

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="vehicles.pdf"',
    },
  });
}
