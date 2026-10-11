# PME Intérim — Démo lecture seule (Windows, 100 % local)

Version de démonstration : l'application **lit** la base PostgreSQL et ne peut rien modifier.

- **Connexion sans identifiant** : la page d'accueil propose « administrateur » ou « utilisateur ».
  - Administrateur : tableau de bord, clients, employés, qualifications.
  - Utilisateur : tableau de bord, missions et détail financier.
- **GET uniquement** : l'API répond `405` à toute autre méthode (POST, PUT, PATCH, DELETE). Aucune méthode d'écriture n'existe dans le code serveur.
- **Responsive** : barre latérale sur ordinateur, menu tiroir sur mobile/tablette.
- **Local** : aucune police Google, aucun service externe. Le serveur n'écoute que sur `127.0.0.1`.

## Prérequis
- Node.js 20+ (LTS) — https://nodejs.org
- PostgreSQL installé et démarré (service Windows)

## Installation (une fois)
1. Double-cliquez sur `1-installer.bat` (ou : copiez `.env.example` en `.env`, mettez votre mot de passe PostgreSQL, puis `npm install` et `npm run setup`).
   Cela crée la base `pme_db`, les tables, et des données de démonstration.

## Lancement
Double-cliquez sur `2-demarrer.bat`, ou `npm run dev`, puis ouvrez http://localhost:5000.

Version « production » : `npm run build` puis `npm start`.

## Commandes utiles
| Commande | Effet |
|---|---|
| `npm run db:init` | crée la base si absente |
| `npm run db:push` | crée/met à jour les tables |
| `npm run db:seed` | insère les données de démo (si base vide) |
| `npm run db:reset` | vide puis réinsère les données de démo |
| `npm run check` | vérification TypeScript |

Les données se modifient uniquement hors application (script `db:seed`, pgAdmin, SQL…).
Les tarifs sont stockés en centimes d'euro (15000 = 150,00 €).
