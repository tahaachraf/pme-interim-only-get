import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";

const app = express();
const httpServer = createServer(app);

export function log(message: string, source = "express") {
  const time = new Date().toLocaleTimeString("fr-FR");
  console.log(`${time} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`);
    }
  });
  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  // Express 4 ne capture pas les erreurs des handlers async : on les attrape ici.
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    if (res.headersSent) return;
    res.status(err.status || err.statusCode || 500).json({ message: err.message || "Erreur serveur" });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  // 127.0.0.1 : accessible uniquement depuis cette machine (pas d'exposition réseau).
  httpServer.listen({ port, host: "127.0.0.1" }, () => {
    log(`Application disponible sur http://localhost:${port}`);
  });
})();
