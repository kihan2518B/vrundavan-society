import { pgTable, serial, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const apartment = pgTable(
  'apartment',
  {
    id: serial('id').primaryKey(),

    apartmentName: varchar('apartment_name', { length: 100 }).notNull(),

    pramukhName: varchar('pramukh_name', { length: 100 }).notNull(),
    pramukhMobile: varchar('pramukh_mobile', { length: 15 }).notNull(),

    bahadurName: varchar('bahadur_name', { length: 100 }).notNull(),
    bahadurMobile: varchar('bahadur_mobile', { length: 15 }).notNull(),

    isDeleted: boolean('is_deleted').default(false).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    apartmentNameIdx: index('apartment_name_idx').on(table.apartmentName),
    notDeletedIdx: index('apartment_not_deleted_idx').on(table.isDeleted),
  })
);
