import { useQualifications } from "@/hooks/use-resources";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCheck } from "lucide-react";
import { formatMoney } from "@/lib/format";

export default function QualificationsPage() {
  const { data, isLoading, isError } = useQualifications();

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Qualifications</h1>
        <p className="text-muted-foreground mt-2">Niveaux de qualification et tarifs journaliers.</p>
      </div>

      {isError && <p className="text-destructive">Impossible de charger les qualifications.</p>}
      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <Card>
          <CardContent className="p-0 divide-y">
            {data?.map((q) => (
              <div key={q.id} className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{q.label}</p>
                  <p className="text-xs text-muted-foreground">Qualification n° {q.id}</p>
                </div>
                <div className="text-right font-mono font-semibold whitespace-nowrap">
                  {formatMoney(q.dailyRate)}
                  <span className="block text-xs font-normal text-muted-foreground">par jour</span>
                </div>
              </div>
            ))}
            {data?.length === 0 && <p className="p-8 text-center text-muted-foreground">Aucune qualification.</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
