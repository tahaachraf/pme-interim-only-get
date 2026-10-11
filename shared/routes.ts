// Contrat d'API : version démo, lecture seule (GET uniquement).
export const api = {
  me: "/api/user",
  demoLogin: "/api/demo-login", // ?role=admin | user
  logout: "/api/logout",
  dashboard: "/api/dashboard",
  clients: "/api/clients",
  qualifications: "/api/qualifications",
  employees: "/api/employees",
  contracts: "/api/contracts",
  contract: (id: number | string) => `/api/contracts/${id}`,
} as const;
