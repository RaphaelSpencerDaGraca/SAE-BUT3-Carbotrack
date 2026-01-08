FROM node:20-alpine AS builder
WORKDIR /app

# Installer deps frontend (avec lockfile si présent)
COPY package.json package-lock.json* ./
RUN npm ci

# Copier le reste
COPY . .

# Build Vite avec API sur /api
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
