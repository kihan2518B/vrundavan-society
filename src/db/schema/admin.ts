import { pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

export const admin = pgTable('admin', {
  id: serial('id').primaryKey(),

  email: varchar('email', { length: 255 }).notNull().unique(),

  isActive: boolean('is_active').default(true),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
