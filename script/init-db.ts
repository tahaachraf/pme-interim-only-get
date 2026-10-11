// Crée la base si elle n'existe pas (sans avoir besoin de psql). Usage : npm run db:init
import "dotenv/config";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL manquant : copiez .env.example vers .env et adaptez-le.");
  process.exit(1);
}

const target = new URL(url);
const dbName = decodeURIComponent(target.pathname.slice(1));
if (!/^[A-Za-z0-9_]+$/.test(dbName)) {
  console.error(`Nom de base invalide : "${dbName}" (lettres, chiffres et _ uniquement).`);
  process.exit(1);
}

const admin = new URL(url);
admin.pathname = "/postgres";
const client = new pg.Client({ connectionString: admin.toString() });

try {
  await client.connect();
  const { rowCount } = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
  if (rowCount) {
    console.log(`Base "${dbName}" déjà présente.`);
  } else {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Base "${dbName}" créée.`);
  }
} catch (e: any) {
  console.error("Impossible de se connecter à PostgreSQL :", e.message);
  console.error("Vérifiez que le service PostgreSQL est démarré et que DATABASE_URL (.env) est correct.");
  process.exit(1);
} finally {
  await client.end();
}
