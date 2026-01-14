# =========================
# deps (on installe aussi les devDeps pour compiler TS)
# =========================
FROM node:20-alpine AS deps
WORKDIR /app/backend

# Installer les deps backend (avec lockfile si présent)
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --include=dev

# =========================
# build (compile TS + inclut shared)
# =========================
FROM node:20-alpine AS build
WORKDIR /app

# Réutiliser les node_modules installés
COPY --from=deps /app/backend/node_modules ./backend/node_modules

# Copier le code backend + shared
COPY backend ./backend
COPY shared ./shared

# Compiler avec une config dédiée Docker (inclut shared)
WORKDIR /app/backend
RUN npx tsc -p tsconfig.docker.json

# =========================
# runner
# =========================
FROM node:20-alpine AS runner
WORKDIR /app

# deps runtime (dans /app/backend)
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY backend/package.json ./backend/package.json

# Optionnel mais propre : on retire les deps de dev
WORKDIR /app/backend
RUN npm prune --omit=dev

# IMPORTANT: rendre les modules trouvables depuis /app/dist/...
WORKDIR /app
RUN ln -s /app/backend/node_modules /app/node_modules

# JS compilé (inclut dist/backend/... + dist/shared/...)
COPY --from=build /app/backend/dist ./dist

# on copie les assets (xlsx) sur /app/assets
COPY --from=build /app/backend/assets ./assets

EXPOSE 3001

# On démarre le serveur compilé (chemin issu de tsconfig.docker.json)
CMD ["node", "dist/backend/src/server.js"]
