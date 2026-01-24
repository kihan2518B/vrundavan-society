import { eq, asc, sql, and, ilike, desc } from 'drizzle-orm';
import { db } from '..';
import { vehicle } from '@/db/schema/vehicle';
import { apartment } from '@/db/schema';

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

export async function getVehicles({
  filters,
  sort,
  limit,
}: {
  filters: {
    apartmentId?: string | null;
    block?: string | null;
    floor?: string | null;
    search?: string | null;
  };
  sort: {
    by: 'vehicle_number';
    order: 'asc' | 'desc';
  };
  limit?: number;
  cursor?: string | null;
}) {
  const conditions = [eq(vehicle.isDeleted, false)];

  // ✅ Normalize filters FIRST
  const apartmentId = filters.apartmentId ? Number(filters.apartmentId) : null;

  const floor = filters.floor ? Number(filters.floor) : null;

  if (apartmentId !== null) conditions.push(eq(vehicle.apartmentId, apartmentId));

  if (filters.block) conditions.push(eq(vehicle.blockNumber, filters.block));

  if (floor !== null) conditions.push(eq(vehicle.floor, floor));

  if (filters.search) conditions.push(ilike(vehicle.vehicleNumber, `%${filters.search}%`));

  const query = db
    .select({
      id: vehicle.id,
      vehicleNumber: vehicle.vehicleNumber,
      ownerName: vehicle.name,
      contactNumber: vehicle.mobile,
      blockNumber: vehicle.blockNumber,
      floor: vehicle.floor,
      apartmentId: vehicle.apartmentId,
      apartmentName: apartment.apartmentName,
    })
    .from(vehicle)
    .leftJoin(apartment, eq(vehicle.apartmentId, apartment.id))
    .where(and(...conditions))
    .orderBy(sort.order === 'asc' ? asc(vehicle.vehicleNumber) : desc(vehicle.vehicleNumber))
    .limit(limit ?? 10000);

  return query;
}
