import { useRoute, Link } from "wouter";
import { useContract } from "@/hooks/use-resources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Calendar, Clock, ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatMoney, statusClass, statusLabel } from "@/lib/format";

export default function ContractDetailsPage() {
  const [, params] = useRoute("/contracts/:id");
  const id = Number(params?.id);
  const { data: contract, isLoading } = useContract(id);

  if (isLoading) return <Skeleton className="h-[500px] w-full rounded-xl" />;
  if (!contract) {
    return (
      <div className="space-y-3">
        <p>Mission introuvable.</p>
        <Link href="/contracts" className="text-primary hover:underline text-sm">← Retour aux missions</Link>
      </div>
    );
  }

  const dailyTeamCost = contract.assignments.reduce((s, a) => s + a.assignedQualification.dailyRate, 0);
  const total = dailyTeamCost * contract.totalDays;

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <Link href="/contracts" className="text-sm text-primary hover:underline flex items-center gap-1 mb-2">
          <ArrowLeft className="h-3 w-3" /> Retour aux missions
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="text-sm px-3 py-1">#{contract.id}</Badge>
          <Badge variant="secondary" className={cn("text-sm px-3 py-1", statusClass(contract.status))}>{statusLabel(contract.status)}</Badge>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mt-2 break-words">{contract.description}</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <Card>
            <CardHeader><CardTitle>Équipe affectée</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {contract.assignments.map((a) => (
                <div key={a.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-secondary/10 rounded-lg border">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {a.employee.firstName[0]}{a.employee.lastName[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-lg truncate">{a.employee.firstName} {a.employee.lastName}</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{a.assignedQualification.label}</span>{" "}
                        ({a.employee.baseQualificationId === a.assignedQualificationId ? "qualification d'origine" : "qualification ajustée"})
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right pl-14 sm:pl-0">
                    <p className="font-mono font-medium">{formatMoney(a.assignedQualification.dailyRate)}/jour</p>
                    <p className="text-sm text-muted-foreground">Total : {formatMoney(a.assignedQualification.dailyRate * contract.totalDays)}</p>
                  </div>
                </div>
              ))}
              {contract.assignments.length === 0 && <p className="text-sm text-muted-foreground">Aucun employé affecté.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Synthèse financière</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Nombre de jours</span><span className="font-medium">{contract.totalDays}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Coût journalier de l'équipe</span><span className="font-medium">{formatMoney(dailyTeamCost)}</span></div>
              <div className="border-t pt-4 flex justify-between items-center text-lg sm:text-xl font-bold">
                <span>Valeur totale</span><span className="text-primary">{formatMoney(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-secondary/20 border-none shadow-none">
            <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Client</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="font-semibold text-lg">{contract.client.name}</div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3"><Mail className="h-4 w-4 mt-0.5 shrink-0" /><span className="break-all">{contract.client.email}</span></div>
                <div className="flex items-start gap-3"><Phone className="h-4 w-4 mt-0.5 shrink-0" />{contract.client.phone}</div>
                <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />{contract.client.address}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Calendrier</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div><p className="text-sm text-muted-foreground">Date de début</p><p className="font-medium">{formatDate(contract.startDate, "d MMMM yyyy")}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div><p className="text-sm text-muted-foreground">Durée</p><p className="font-medium">{contract.totalDays} jours ouvrés</p></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
