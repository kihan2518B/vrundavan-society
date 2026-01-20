import { index, pgTable, serial, text, unique, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable(
  'admin_users',
  {
    id: serial().primaryKey().notNull(),
    user_name: varchar({ length: 255 }).notNull().unique(),
    phone: text().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
  },
  (table) => [
    index('idx_user_name').using('btree', table.user_name.asc().nullsLast().op('text_ops')),
    unique('users_user_name_key').on(table.user_name),
  ]
);
