import { NextResponse } from 'next/server';
import { DocumentProps, renderToBuffer } from '@react-pdf/renderer';
import { VehiclePdfDocument } from '@/pdf/VehiclePdfDocument';
import { getVehicles } from '@/helpers/query';
import { createElement } from 'react';

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
    sort: { by: 'vehicle_number', order: 'asc' },
  });

  const rows = vehicles.map((v) => ({
    vehicleNumber: v.vehicleNumber,
    ownerName: v.ownerName,
    ownerMobile: v.contactNumber,
    block: v.blockNumber,
    floor: v.floor,
    apartmentName: v.apartmentName,
  }));

  const buffer = await renderToBuffer(
    createElement(VehiclePdfDocument, { rows }) as React.ReactElement<DocumentProps>
  );
  const uint8Array = new Uint8Array(buffer);

  return new NextResponse(uint8Array, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="vehicles.pdf"',
      'Content-Length': uint8Array.byteLength.toString(),
    },
  });
}
