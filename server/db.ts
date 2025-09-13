import { drizzle } from "drizzle-orm/neon-http";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const DATABASE_URL = process.env.DATABASE_URL;

// Check if this is a Neon database
const isNeonDB = DATABASE_URL.includes('neon.tech') || DATABASE_URL.includes('neondb.io');

export const db = isNeonDB ? 
  // Use Neon HTTP driver for actual Neon databases
  drizzle(neon(DATABASE_URL, {
    fetchOptions: {
      cache: 'no-store',
    },
  }), { schema }) :
  
  // Use node-postgres for Replit Helium and other standard PostgreSQL
  drizzleNode(new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('helium') ? false : { rejectUnauthorized: false },
  }), { schema });

console.log(`Database initialized with ${isNeonDB ? 'Neon HTTP' : 'node-postgres'} driver`);