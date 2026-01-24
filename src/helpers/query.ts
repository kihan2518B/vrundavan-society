import { eq, asc, sql, and } from 'drizzle-orm';
import { db } from '..';
import { vehicle } from '@/db/schema/vehicle';

export async function getAllActiveVehicles() {
  return db
    .select({
      vehicleNumber: vehicle.vehicleNumber,
      name: vehicle.name,
      blockNumber: vehicle.blockNumber,
      createdAt: vehicle.createdAt,
    })
    .from(vehicle)
    .where(eq(vehicle.isDeleted, false))
    .orderBy(asc(vehicle.blockNumber), asc(vehicle.vehicleNumber));
}

export async function getFlatWiseCounts() {
  return db
    .select({
      blockNumber: vehicle.blockNumber,
      totalvehicle: sql<number>`count(*)`,
    })
    .from(vehicle)
    .where(eq(vehicle.isDeleted, false))
    .groupBy(vehicle.blockNumber)
    .orderBy(sql`count(*) DESC`);
}

export async function getVehiclesByFlat(flat: string) {
  return db
    .select({
      vehicleNumber: vehicle.vehicleNumber,
      name: vehicle.name,
    })
    .from(vehicle)
    .where(and(eq(vehicle.isDeleted, false), eq(vehicle.blockNumber, flat)))
    .orderBy(asc(vehicle.vehicleNumber));
}

export async function getTotals() {
  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(vehicle)
    .where(eq(vehicle.isDeleted, false));

  return { totalVehicles: count };
}
