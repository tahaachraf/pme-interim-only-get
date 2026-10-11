import { useState } from "react";
import { useEmployees } from "@/hooks/use-resources";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { formatMoney } from "@/lib/format";

export default function EmployeesPage() {
  const { data, isLoading, isError } = useEmployees();
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const filtered = data?.filter((e) =>
    `${e.firstName} ${e.lastName} ${e.baseQualification.label}`.toLowerCase().includes(q),
  );

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Employés</h1>
        <p className="text-muted-foreground mt-2">Annuaire du personnel intérimaire et qualification de base.</p>
      </div>

      <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-xl shadow-sm border">
        <Search className="text-muted-foreground h-5 w-5 shrink-0" />
        <Input
          placeholder="Rechercher un employé ou une qualification…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0 bg-transparent text-base"
        />
      </div>

      {isError && <p className="text-destructive">Impossible de charger les employés.</p>}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered?.map((e) => (
            <Card key={e.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
                  {e.firstName[0]}{e.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{e.firstName} {e.lastName}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Badge variant="secondary">{e.baseQualification.label}</Badge>
                    <span className="text-xs text-muted-foreground font-mono">{formatMoney(e.baseQualification.dailyRate)}/j</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed">
              Aucun employé trouvé.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
