import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

// Les tarifs sont stockés en centimes d'euro.
const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
export const formatMoney = (cents: number) => eur.format(cents / 100);

export const formatDate = (iso: string, pattern = "d MMM yyyy") => format(parseISO(iso), pattern, { locale: fr });

export const STATUS_LABELS: Record<string, string> = {
  Draft: "Brouillon",
  Active: "En cours",
  Completed: "Terminé",
};
export const statusLabel = (s: string) => STATUS_LABELS[s] ?? s;
export const statusClass = (s: string) =>
  s === "Active"
    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
    : s === "Completed"
    ? "bg-slate-200 text-slate-700 hover:bg-slate-200"
    : "bg-amber-100 text-amber-800 hover:bg-amber-100";
