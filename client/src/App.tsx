import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@shared/schema";

import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import ClientsPage from "@/pages/Clients";
import EmployeesPage from "@/pages/Employees";
import QualificationsPage from "@/pages/Qualifications";
import ContractsPage from "@/pages/Contracts";
import ContractDetailsPage from "@/pages/ContractDetails";
import NotFound from "@/pages/not-found";

function Protected({ component: Component, role }: { component: React.ComponentType; role?: Role }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Redirect to="/auth" />;
  if (role && user.role !== role) return <Redirect to="/" />;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8 max-w-[100vw] overflow-x-hidden lg:max-w-none">
        <Component />
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/"><Protected component={Dashboard} /></Route>
      <Route path="/clients"><Protected component={ClientsPage} role="admin" /></Route>
      <Route path="/employees"><Protected component={EmployeesPage} role="admin" /></Route>
      <Route path="/qualifications"><Protected component={QualificationsPage} role="admin" /></Route>
      <Route path="/contracts"><Protected component={ContractsPage} role="user" /></Route>
      <Route path="/contracts/:id"><Protected component={ContractDetailsPage} role="user" /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
