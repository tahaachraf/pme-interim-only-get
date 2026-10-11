import { useDashboard } from "@/hooks/use-resources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Building2, FileText, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) return <Skeleton className="h-[500px] w-full rounded-xl" />;
  if (isError || !data) return <p className="text-destructive">Impossible de charger les données.</p>;

  const stats = [
    { title: "Missions en cours", value: data.activeContracts, icon: FileText, description: `${data.draftContracts} en brouillon`, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Employés", value: data.employees, icon: Users, description: "Disponibles pour affectation", color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Clients", value: data.clients, icon: Building2, description: "Enregistrés", color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const chartData = [
    { name: "Brouillon", value: data.draftContracts },
    { name: "En cours", value: data.activeContracts },
    { name: "Terminé", value: data.completedContracts },
  ];

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">Vue d'ensemble de votre activité d'intérim.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
                <div className={`p-2 rounded-full ${s.bg}`}><Icon className={`h-4 w-4 ${s.color}`} /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-md border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="h-4 w-4 text-primary" />Répartition des missions</CardTitle>
          </CardHeader>
          <CardContent className="pl-0 sm:pl-2">
            <div className="h-[240px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} width={30} />
                  <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                  <Bar dataKey="value" name="Missions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-md border-none">
          <CardHeader><CardTitle className="text-lg">Derniers clients</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.recentClients.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {c.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                </div>
              </div>
            ))}
            {data.recentClients.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Aucun client.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
