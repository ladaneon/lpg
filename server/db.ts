import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Configure the Neon client with SSL settings for Replit environment
const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    cache: 'no-store',
  },
});

export const db = drizzle(sql, { schema });