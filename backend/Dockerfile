# backend/Dockerfile (build context = repo root)

FROM node:20-alpine AS deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci || npm install

FROM node:20-alpine AS build
WORKDIR /app

# deps
COPY --from=deps /app/backend/node_modules ./backend/node_modules

# sources
COPY backend ./backend
COPY shared ./shared

# build
WORKDIR /app/backend
RUN npm run build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app/backend

COPY --from=build /app/backend/package*.json ./
COPY --from=build /app/backend/node_modules ./node_modules
COPY --from=build /app/backend/dist ./dist

# On garde shared à côté, au cas où le JS runtime en a besoin
COPY --from=build /app/shared ../shared

EXPOSE 3001
CMD ["node", "dist/server.js"]
