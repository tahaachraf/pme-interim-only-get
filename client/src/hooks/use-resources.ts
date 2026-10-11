import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type {
  Client, Qualification, EmployeeWithQualification,
  ContractWithClient, ContractWithDetails, DashboardStats,
} from "@shared/schema";
import { apiGet } from "@/lib/queryClient";

// Uniquement des lectures (GET).
export const useDashboard = () =>
  useQuery({ queryKey: [api.dashboard], queryFn: () => apiGet<DashboardStats>(api.dashboard) as Promise<DashboardStats> });

export const useClients = () =>
  useQuery({ queryKey: [api.clients], queryFn: () => apiGet<Client[]>(api.clients) as Promise<Client[]> });

export const useQualifications = () =>
  useQuery({ queryKey: [api.qualifications], queryFn: () => apiGet<Qualification[]>(api.qualifications) as Promise<Qualification[]> });

export const useEmployees = () =>
  useQuery({ queryKey: [api.employees], queryFn: () => apiGet<EmployeeWithQualification[]>(api.employees) as Promise<EmployeeWithQualification[]> });

export const useContracts = () =>
  useQuery({ queryKey: [api.contracts], queryFn: () => apiGet<ContractWithClient[]>(api.contracts) as Promise<ContractWithClient[]> });

export const useContract = (id: number) =>
  useQuery({
    queryKey: [api.contract(id)],
    queryFn: () => apiGet<ContractWithDetails>(api.contract(id), { nullOn404: true }),
    enabled: Number.isInteger(id) && id > 0,
  });
