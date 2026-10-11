import { Link } from "wouter";
import { useContracts } from "@/hooks/use-resources";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, statusClass, statusLabel } from "@/lib/format";

export default function ContractsPage() {
  const { data, isLoading, isError } = useContracts();

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Missions</h1>
        <p className="text-muted-foreground mt-2">Contrats de mise à disposition par client.</p>
      </div>

      {isError && <p className="text-destructive">Impossible de charger les missions.</p>}
      {isLoading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {data?.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className={cn("mb-2", statusClass(c.status))}>{statusLabel(c.status)}</Badge>
                  <span className="text-xs text-muted-foreground font-mono">#{c.id}</span>
                </div>
                <CardTitle className="leading-tight text-lg">{c.description}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <FileText className="h-3 w-3 shrink-0" /> {c.client.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3 flex-1">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 opacity-70" />{formatDate(c.startDate)}</span>
                  <span>{c.totalDays} jours</span>
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t bg-secondary/5">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/contracts/${c.id}`}>Voir le détail</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
          {data?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed">
              Aucune mission.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
