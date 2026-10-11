import { pgTable, text, serial, integer, timestamp, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// === TABLES ===

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const qualifications = pgTable("qualifications", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  dailyRate: integer("daily_rate").notNull(), // en centimes d'euro (15000 = 150,00 €)
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  baseQualificationId: integer("base_qualification_id").references(() => qualifications.id).notNull(),
});

export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id").references(() => clients.id).notNull(),
  description: text("description").notNull(),
  startDate: date("start_date").notNull(),
  totalDays: integer("total_days").notNull(),
  status: text("status").default("Draft").notNull(), // Draft, Active, Completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const contractAssignments = pgTable("contract_assignments", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").references(() => contracts.id).notNull(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  assignedQualificationId: integer("assigned_qualification_id").references(() => qualifications.id).notNull(),
});

// === RELATIONS ===

export const clientsRelations = relations(clients, ({ many }) => ({
  contracts: many(contracts),
}));

export const qualificationsRelations = relations(qualifications, ({ many }) => ({
  employees: many(employees),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  baseQualification: one(qualifications, {
    fields: [employees.baseQualificationId],
    references: [qualifications.id],
  }),
  assignments: many(contractAssignments),
}));

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  client: one(clients, { fields: [contracts.clientId], references: [clients.id] }),
  assignments: many(contractAssignments),
}));

export const contractAssignmentsRelations = relations(contractAssignments, ({ one }) => ({
  contract: one(contracts, { fields: [contractAssignments.contractId], references: [contracts.id] }),
  employee: one(employees, { fields: [contractAssignments.employeeId], references: [employees.id] }),
  assignedQualification: one(qualifications, {
    fields: [contractAssignments.assignedQualificationId],
    references: [qualifications.id],
  }),
}));

// === TYPES ===

export type Role = "admin" | "user";
export type DemoUser = { id: number; username: string; role: Role };

export type Client = typeof clients.$inferSelect;
export type Qualification = typeof qualifications.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type Contract = typeof contracts.$inferSelect;
export type Assignment = typeof contractAssignments.$inferSelect;

export type EmployeeWithQualification = Employee & { baseQualification: Qualification };
export type ContractWithClient = Contract & { client: Client };
export type ContractWithDetails = Contract & {
  client: Client;
  assignments: (Assignment & { employee: Employee; assignedQualification: Qualification })[];
};
export type DashboardStats = {
  activeContracts: number;
  draftContracts: number;
  completedContracts: number;
  employees: number;
  clients: number;
  recentClients: Pick<Client, "id" | "name" | "email">[];
};
