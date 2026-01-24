// import { pgTable, serial, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

// export const admin = pgTable('admin', {
//   id: serial('id').primaryKey(),

//   email: varchar('email', { length: 255 }).notNull().unique(),

//   isActive: boolean('is_active').default(true),

//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow(),
// });

import { pgTable, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const admin = pgTable(
  'admin',
  {
    username: varchar('username', { length: 50 }).primaryKey().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    usernameIdx: index('admin_username_idx').on(table.username),
    activeIdx: index('admin_active_idx').on(table.isActive),
  })
);
