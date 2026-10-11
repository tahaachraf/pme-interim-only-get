import { db } from "./db";
import { eq, desc, count } from "drizzle-orm";
import {
  clients, qualifications, employees, contracts,
  type Client, type Qualification, type EmployeeWithQualification,
  type ContractWithClient, type ContractWithDetails, type DashboardStats,
} from "@shared/schema";

// Stockage en LECTURE SEULE : aucune méthode d'écriture n'existe dans cette version.
export const storage = {
  async getClients(): Promise<Client[]> {
    return db.select().from(clients).orderBy(clients.name);
  },

  async getQualifications(): Promise<Qualification[]> {
    return db.select().from(qualifications).orderBy(qualifications.dailyRate);
  },

  async getEmployees(): Promise<EmployeeWithQualification[]> {
    return db.query.employees.findMany({
      with: { baseQualification: true },
      orderBy: (e, { asc }) => [asc(e.lastName), asc(e.firstName)],
    });
  },

  async getContracts(): Promise<ContractWithClient[]> {
    return db.query.contracts.findMany({
      with: { client: true },
      orderBy: (c) => [desc(c.createdAt), desc(c.id)],
    });
  },

  async getContract(id: number): Promise<ContractWithDetails | undefined> {
    return db.query.contracts.findFirst({
      where: eq(contracts.id, id),
      with: {
        client: true,
        assignments: { with: { employee: true, assignedQualification: true } },
      },
    });
  },

  async getDashboard(): Promise<DashboardStats> {
    const byStatus = await db
      .select({ status: contracts.status, n: count() })
      .from(contracts)
      .groupBy(contracts.status);
    const n = (s: string) => Number(byStatus.find((r) => r.status === s)?.n ?? 0);
    const [{ n: employeeCount }] = await db.select({ n: count() }).from(employees);
    const [{ n: clientCount }] = await db.select({ n: count() }).from(clients);
    const recentClients = await db
      .select({ id: clients.id, name: clients.name, email: clients.email })
      .from(clients)
      .orderBy(desc(clients.createdAt), desc(clients.id))
      .limit(5);
    return {
      activeContracts: n("Active"),
      draftContracts: n("Draft"),
      completedContracts: n("Completed"),
      employees: Number(employeeCount),
      clients: Number(clientCount),
      recentClients,
    };
  },
};
