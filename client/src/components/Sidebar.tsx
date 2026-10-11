import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Briefcase, BadgeCheck, FileText, LogOut, Building2, Menu, Eye } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const navItems = [
  { href: "/", label: "Tableau de bord", icon: LayoutDashboard, roles: ["admin", "user"] },
  { href: "/clients", label: "Clients", icon: Building2, roles: ["admin"] },
  { href: "/employees", label: "Employés", icon: Users, roles: ["admin"] },
  { href: "/qualifications", label: "Qualifications", icon: BadgeCheck, roles: ["admin"] },
  { href: "/contracts", label: "Missions", icon: FileText, roles: ["user"] },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const items = navItems.filter((i) => user && i.roles.includes(user.role));

  return (
    <div className="flex h-full flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">PME Intérim</span>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-medium">
          <Eye className="h-3 w-3" /> Démo · lecture seule
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? location === "/" : location.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t bg-secondary/30">
        <div className="mb-3 px-2">
          <p className="text-sm font-medium truncate">{user?.username}</p>
          <p className="text-xs text-muted-foreground">{user?.role === "admin" ? "Profil administrateur" : "Profil utilisateur"}</p>
        </div>
        <button
          onClick={() => logout.mutate()}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border bg-background hover:bg-secondary transition-colors text-sm font-medium text-muted-foreground"
        >
          <LogOut className="h-4 w-4" />
          Changer de profil
        </button>
      </div>
    </div>
  );
}

// Barre latérale fixe (≥ lg) et tiroir + barre supérieure sur mobile/tablette.
export function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside className="hidden lg:block fixed left-0 top-0 z-30 h-screen w-64 border-r bg-card">
        <NavContent />
      </aside>

      <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 border-b bg-card/95 backdrop-blur px-4 h-14">
        <button
          aria-label="Ouvrir le menu"
          onClick={() => setOpen(true)}
          className="h-10 w-10 -ml-2 flex items-center justify-center rounded-lg hover:bg-secondary"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">PME Intérim</span>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[11px] font-medium">
          <Eye className="h-3 w-3" /> Démo
        </span>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Navigation principale</SheetDescription>
          <NavContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
