import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

// this can e run by npx tsx index.ts
// async function main() {
//   const user: typeof usersTable.$inferInsert = {
//     name: 'John',
//     age: 30,
//     email: 'john@example.com',
//   };

//   const u = await db.insert(usersTable).values(user);
//   console.log('New user created!', u);

//   const users = await db
//     .select({ name: usersTable.id, age: usersTable.age })
//     .from(usersTable)
//     .where(and(lt(usersTable.age, 35), gte(usersTable.age, 30)));
//   console.log('Getting all users from the database: ', users);
//   /*
//   const users: {
//     id: number;
//     name: string;
//     age: number;
//     email: string;
//   }[]
//   */

//   //   const updated = await db
//   //     .update(usersTable)
//   //     .set({
//   //       age: 31,
//   //     })
//   //     .where(eq(usersTable.email, user.email));
//   //   console.log('User info updated!', updated);

//   //   const deleted = await db.delete(usersTable).where(eq(usersTable.email, user.email));
//   //   console.log('User deleted!', deleted);
// }

// main();
