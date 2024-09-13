import { drizzle } from 'drizzle-orm';
import { sqlite } from 'drizzle-orm/sqlite';

const db = drizzle(sqlite('db.sqlite'));

export default db;