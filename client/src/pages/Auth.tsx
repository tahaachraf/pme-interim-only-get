import { useEffect } from "react";
import { useLocation } from "wouter";
import { Briefcase, ShieldCheck, User, Eye, Loader2, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@shared/schema";

const profiles: { role: Role; title: string; desc: string; icon: typeof User }[] = [
  { role: "admin", title: "Administrateur", desc: "Clients, employés et qualifications.", icon: ShieldCheck },
  { role: "user", title: "Utilisateur", desc: "Missions et détail financier.", icon: User },
];

export default function AuthPage() {
  const { user, login } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) setLocation("/");
  }, [user, setLocation]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-1/4 w-full h-full rounded-full border-[100px] border-white -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 -right-1/4 w-full h-full rounded-full border-[100px] border-white translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Briefcase className="h-6 w-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight">PME Intérim</span>
        </div>
        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold mb-6 leading-tight text-primary-foreground">
            Pilotez vos missions d'intérim en toute clarté.
          </h1>
          <p className="text-lg text-primary-foreground/80 leading-relaxed">
            Personnel, qualifications, clients et missions : une vue d'ensemble de votre activité.
          </p>
        </div>
        <div className="relative z-10 text-sm text-primary-foreground/60">Version démonstration</div>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex flex-col items-center gap-3 mb-2">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl">PME Intérim</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Accès à la démo</h2>
            <p className="text-muted-foreground mt-2">Choisissez un profil : aucun identifiant n'est nécessaire.</p>
          </div>

          <div className="space-y-3">
            {profiles.map(({ role, title, desc, icon: Icon }) => {
              const busy = login.isPending && login.variables === role;
              return (
                <button
                  key={role}
                  onClick={() => login.mutate(role)}
                  disabled={login.isPending}
                  className="w-full flex items-center gap-4 rounded-xl border bg-card p-4 text-left shadow-sm transition hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 min-h-[72px]"
                >
                  <div className="h-11 w-11 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">Se connecter en tant que {title.toLowerCase()}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </button>
              );
            })}
          </div>

          {login.isError && (
            <p className="text-sm text-destructive">Connexion impossible : {(login.error as Error).message}</p>
          )}

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5" /> Mode lecture seule : les données de la base ne peuvent pas être modifiées.
          </p>
        </div>
      </div>
    </div>
  );
}
