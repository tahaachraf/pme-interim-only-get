import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { api } from "@shared/routes";
import type { DemoUser, Role } from "@shared/schema";
import { apiGet } from "@/lib/queryClient";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const userQuery = useQuery({
    queryKey: [api.me],
    queryFn: () => apiGet<DemoUser>(api.me, { nullOn401: true }),
    staleTime: Infinity,
  });

  const login = useMutation({
    mutationFn: (role: Role) => apiGet<DemoUser>(`${api.demoLogin}?role=${role}`),
    onSuccess: (user) => {
      queryClient.clear();
      queryClient.setQueryData([api.me], user);
      setLocation("/");
    },
  });

  const logout = useMutation({
    mutationFn: () => apiGet(api.logout),
    onSettled: () => {
      queryClient.clear();
      queryClient.setQueryData([api.me], null);
      setLocation("/auth");
    },
  });

  return { user: userQuery.data ?? null, isLoading: userQuery.isLoading, login, logout };
}
