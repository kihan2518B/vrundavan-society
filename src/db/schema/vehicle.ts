import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { apartment } from './apartment';

export const vehicle = pgTable(
  'vehicle',
  {
    id: serial('id').primaryKey(),

    apartmentId: integer('apartment_id')
      .references(() => apartment.id)
      .notNull(),

    vehicleNumber: varchar('vehicle_number', { length: 10 }).notNull(),

    blockNumber: varchar('block_number', { length: 20 }).notNull(),
    floor: integer('floor').notNull(),

    name: varchar('name', { length: 100 }).notNull(),
    mobile: varchar('mobile', { length: 15 }).notNull(),

    isDeleted: boolean('is_deleted').default(false).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    // 🔑 Composite uniqueness (your requirement)
    vehicleUniqueIdx: uniqueIndex('vehicle_apartment_number_deleted_unique').on(
      table.apartmentId,
      table.vehicleNumber,
      table.isDeleted
    ),

    // 🔍 Fast search
    vehicleNumberIdx: index('vehicle_number_idx').on(table.vehicleNumber),

    // 📦 Apartment filtering
    apartmentIdx: index('vehicle_apartment_idx').on(table.apartmentId),

    // 🏢 Location-based reports
    blockFloorIdx: index('vehicle_block_floor_idx').on(table.blockNumber, table.floor),

    // 🗑 Soft delete filtering
    notDeletedIdx: index('vehicle_not_deleted_idx').on(table.isDeleted),
  })
);
