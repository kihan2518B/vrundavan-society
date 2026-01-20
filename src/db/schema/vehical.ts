import { pgTable, varchar, serial, timestamp, boolean, index } from 'drizzle-orm/pg-core';

export const vehical = pgTable(
  'vehical',
  {
    id: serial('id').primaryKey(),

    vehicleNumber: varchar('vehicle_number', { length: 16 }).notNull(),

    ownerName: varchar('owner_name', { length: 100 }).notNull(),

    flatNumber: varchar('flat_number', { length: 20 }).notNull(),
    contactNumber: varchar('contact_number', { length: 20 }).notNull(),

    isDeleted: boolean('is_deleted').default(false),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    vehicleNumberIdx: index('vehicle_number_idx').on(table.vehicleNumber),
    flatIdx: index('flat_number_idx').on(table.flatNumber),
  })
);
