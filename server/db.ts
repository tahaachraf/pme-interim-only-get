import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("ERREUR : DATABASE_URL n'est pas défini dans le fichier .env");
  console.log("Vérifiez que votre fichier .env est bien à la racine et contient :");
  console.log('DATABASE_URL="postgresql://utilisateur:mot_de_passe@localhost:5432/votre_base"');
  process.exit(1);
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });
