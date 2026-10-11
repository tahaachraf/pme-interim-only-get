import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { api } from "@shared/routes";
import type { DemoUser, Role } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    role?: Role;
  }
}

const DEMO_USERS: Record<Role, DemoUser> = {
  admin: { id: 1, username: "Démo Administrateur", role: "admin" },
  user: { id: 2, username: "Démo Utilisateur", role: "user" },
};

// Express 4 n'intercepte pas les promesses rejetées : on les transmet à next().
const wrap =
  (fn: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch(next);

const currentUser = (req: Request): DemoUser | null =>
  req.session.role ? DEMO_USERS[req.session.role] : null;

function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = currentUser(req);
    if (!user) return res.status(401).json({ message: "Non connecté" });
    if (!roles.includes(user.role)) return res.status(403).json({ message: "Accès refusé pour ce profil" });
    next();
  };
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "demo-local-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 8 },
    }),
  );

  // Version démo en lecture seule : toute méthode autre que GET/HEAD est refusée sur l'API.
  app.use("/api", (req, res, next) => {
    if (req.method === "GET" || req.method === "HEAD") return next();
    res.setHeader("Allow", "GET, HEAD");
    res.status(405).json({ message: "Version démo en lecture seule (GET uniquement)" });
  });

  // --- Connexion démo (sans identifiant ni mot de passe) ---
  app.get(api.demoLogin, (req, res, next) => {
    const role = req.query.role;
    if (role !== "admin" && role !== "user") {
      return res.status(400).json({ message: "Profil invalide (admin ou user)" });
    }
    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.role = role;
      req.session.save((err2) => (err2 ? next(err2) : res.json(DEMO_USERS[role])));
    });
  });

  app.get(api.logout, (req, res, next) => {
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.json({ ok: true });
    });
  });

  app.get(api.me, (req, res) => {
    const user = currentUser(req);
    if (!user) return res.status(401).json({ message: "Non connecté" });
    res.json(user);
  });

  // --- Données (lecture seule) ---
  app.get(api.dashboard, requireRole("admin", "user"), wrap(async (_req, res) => {
    res.json(await storage.getDashboard());
  }));

  app.get(api.clients, requireRole("admin"), wrap(async (_req, res) => {
    res.json(await storage.getClients());
  }));

  app.get(api.qualifications, requireRole("admin"), wrap(async (_req, res) => {
    res.json(await storage.getQualifications());
  }));

  app.get(api.employees, requireRole("admin"), wrap(async (_req, res) => {
    res.json(await storage.getEmployees());
  }));

  app.get(api.contracts, requireRole("user"), wrap(async (_req, res) => {
    res.json(await storage.getContracts());
  }));

  app.get("/api/contracts/:id", requireRole("user"), wrap(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: "Identifiant invalide" });
    const contract = await storage.getContract(id);
    if (!contract) return res.status(404).json({ message: "Contrat introuvable" });
    res.json(contract);
  }));

  app.use("/api", (_req, res) => res.status(404).json({ message: "Route introuvable" }));

  return httpServer;
}
