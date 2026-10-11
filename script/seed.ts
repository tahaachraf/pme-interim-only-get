// Jeu de données de démonstration (script local, hors API). Usage : npm run db:seed
// Relancer avec --reset pour vider puis recréer les données.
import "dotenv/config";
import { db, pool } from "../server/db";
import { clients, qualifications, employees, contracts, contractAssignments } from "@shared/schema";

const reset = process.argv.includes("--reset");

async function main() {
  if (reset) {
    await db.delete(contractAssignments);
    await db.delete(contracts);
    await db.delete(employees);
    await db.delete(qualifications);
    await db.delete(clients);
    console.log("Données existantes supprimées.");
  } else if ((await db.select().from(clients).limit(1)).length > 0) {
    console.log("La base contient déjà des données (utilisez --reset pour repartir de zéro).");
    return;
  }

  const [junior, senior, chef, expert] = await db.insert(qualifications).values([
    { label: "Technicien Junior", dailyRate: 15000 },
    { label: "Technicien Senior", dailyRate: 25000 },
    { label: "Chef d'équipe", dailyRate: 35000 },
    { label: "Ingénieur Expert", dailyRate: 48000 },
  ]).returning();

  const cl = await db.insert(clients).values([
    { name: "TechSolutions SAS", address: "123 Rue de la Tech, 75011 Paris", email: "contact@techsolutions.fr", phone: "01 02 03 04 05" },
    { name: "BuildIt Corp", address: "45 Avenue des Champs, 69003 Lyon", email: "info@buildit.com", phone: "04 05 06 07 08" },
    { name: "Logistique du Sud", address: "8 Quai des Chartrons, 33000 Bordeaux", email: "ops@logisud.fr", phone: "05 56 11 22 33" },
    { name: "Atelier Nord Industrie", address: "12 Rue de l'Usine, 59000 Lille", email: "rh@ateliernord.fr", phone: "03 20 44 55 66" },
    { name: "Mairie de Montval", address: "1 Place de la République, 31000 Toulouse", email: "marches@montval.fr", phone: "05 61 77 88 99" },
  ]).returning();

  const em = await db.insert(employees).values([
    { firstName: "Jean", lastName: "Dupont", baseQualificationId: senior.id },
    { firstName: "Marie", lastName: "Curie", baseQualificationId: chef.id },
    { firstName: "Paul", lastName: "Martin", baseQualificationId: junior.id },
    { firstName: "Sophie", lastName: "Bernard", baseQualificationId: senior.id },
    { firstName: "Karim", lastName: "Benali", baseQualificationId: expert.id },
    { firstName: "Léa", lastName: "Moreau", baseQualificationId: junior.id },
    { firstName: "Hugo", lastName: "Petit", baseQualificationId: chef.id },
  ]).returning();

  const day = (offset: number) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);

  const ct = await db.insert(contracts).values([
    { clientId: cl[0].id, description: "Installation réseau local", startDate: day(-3), totalDays: 5, status: "Active" },
    { clientId: cl[1].id, description: "Chantier extension entrepôt", startDate: day(7), totalDays: 20, status: "Draft" },
    { clientId: cl[2].id, description: "Renfort préparation de commandes", startDate: day(-40), totalDays: 15, status: "Completed" },
    { clientId: cl[3].id, description: "Maintenance ligne de production", startDate: day(-10), totalDays: 30, status: "Active" },
  ]).returning();

  await db.insert(contractAssignments).values([
    { contractId: ct[0].id, employeeId: em[0].id, assignedQualificationId: senior.id },
    { contractId: ct[0].id, employeeId: em[2].id, assignedQualificationId: junior.id },
    { contractId: ct[1].id, employeeId: em[1].id, assignedQualificationId: chef.id },
    { contractId: ct[1].id, employeeId: em[3].id, assignedQualificationId: junior.id }, // qualification ajustée
    { contractId: ct[1].id, employeeId: em[5].id, assignedQualificationId: junior.id },
    { contractId: ct[2].id, employeeId: em[5].id, assignedQualificationId: junior.id },
    { contractId: ct[2].id, employeeId: em[6].id, assignedQualificationId: chef.id },
    { contractId: ct[3].id, employeeId: em[4].id, assignedQualificationId: expert.id },
    { contractId: ct[3].id, employeeId: em[3].id, assignedQualificationId: senior.id },
  ]);

  console.log("Données de démonstration créées.");
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => pool.end());
