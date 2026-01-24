import { eq, asc, sql, and } from 'drizzle-orm';
import { db } from '..';
import { vehical } from '@/db/schema/vehicle';

export async function getAllActiveVehicles() {
  return db
    .select({
      vehicleNumber: vehical.vehicleNumber,
      ownerName: vehical.ownerName,
      flatNumber: vehical.flatNumber,
      createdAt: vehical.createdAt,
    })
    .from(vehical)
    .where(eq(vehical.isDeleted, false))
    .orderBy(asc(vehical.flatNumber), asc(vehical.vehicleNumber));
}

export async function getFlatWiseCounts() {
  return db
    .select({
      flatNumber: vehical.flatNumber,
      totalvehical: sql<number>`count(*)`,
    })
    .from(vehical)
    .where(eq(vehical.isDeleted, false))
    .groupBy(vehical.flatNumber)
    .orderBy(sql`count(*) DESC`);
}

export async function getVehiclesByFlat(flat: string) {
  return db
    .select({
      vehicleNumber: vehical.vehicleNumber,
      ownerName: vehical.ownerName,
    })
    .from(vehical)
    .where(and(eq(vehical.isDeleted, false), eq(vehical.flatNumber, flat)))
    .orderBy(asc(vehical.vehicleNumber));
}

export async function getTotals() {
  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(vehical)
    .where(eq(vehical.isDeleted, false));

  return { totalVehicles: count };
}
