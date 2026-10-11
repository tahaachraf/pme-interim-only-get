import { useState } from "react";
import { useClients } from "@/hooks/use-resources";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Mail, Phone, MapPin } from "lucide-react";

export default function ClientsPage() {
  const { data, isLoading, isError } = useClients();
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const filtered = data?.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground mt-2">Entreprises clientes et coordonnées.</p>
      </div>

      <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-xl shadow-sm border">
        <Search className="text-muted-foreground h-5 w-5 shrink-0" />
        <Input
          placeholder="Rechercher par nom ou e-mail…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0 bg-transparent text-base"
        />
      </div>

      {isError && <p className="text-destructive">Impossible de charger les clients.</p>}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filtered?.map((c) => (
            <Card key={c.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary/0 hover:border-l-primary">
              <CardHeader>
                <CardTitle className="text-xl break-words">{c.name}</CardTitle>
                <CardDescription>Client n° {c.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3"><Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" /><span className="break-all">{c.email}</span></div>
                <div className="flex items-start gap-3"><Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />{c.phone}</div>
                <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />{c.address}</div>
              </CardContent>
            </Card>
          ))}
          {filtered?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed">
              Aucun client ne correspond à la recherche.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
