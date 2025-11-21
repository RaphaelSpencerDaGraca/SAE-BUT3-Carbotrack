# CarboTrack - Guide de démarrage complet

Ce projet est une application hybride avec un **frontend Vite** et un **backend Node.js**, utilisant **PostgreSQL** comme base de données. Docker est utilisé pour simplifier le déploiement et le développement.

---

## **Prérequis**
- [Docker](https://docs.docker.com/get-docker/) (obligatoire)
- [Node.js](https://nodejs.org/) (uniquement pour le développement local)
- Git (pour cloner le projet)

---

## **Installation du projet**

1. **Cloner le dépôt** :
   ```bash
   git clone [URL_DU_DEPOT]
   cd <nom du fichier racine>

2. **Installer les dépendances pour le développement local
    ```bash
    npm run install\:all


## **Développement du projet**

1. **Lancer la base de données PosstgreSQL**
    ```bash
    docker-compose -f docker-compose.dev.yml up

PS: Pensez à ouvrir une nouvelle fenêtre de terminale dans l'IDE pour exécuter d'autres commandes

2. **Lancer le Frontend et le Backend en local
   ```bash
    npm run dev

→ Le frontend sera disponible sur http://localhost:5173.
→ Le backend sera disponible sur http://localhost:3000.

Pendant le développement vous aurez parfois besoin de faire Ctrl+C dans l'invite de commande puis de relancer la commande npm run dev

3. **Arrêter la base données**
   ```bash
    docker-compose -f docker-compose.dev.yml down


## Base de données
- Les tables sont créées automatiquement au premier démarrage via le fichier `backend/sql/init.sql`.
- Pour réinitialiser la base de données (ATTENTION supprime toutes les données) :
  ```bash
  docker-compose -f docker-compose.dev.yml up
  docker compose down --volumes --remove-orphans
