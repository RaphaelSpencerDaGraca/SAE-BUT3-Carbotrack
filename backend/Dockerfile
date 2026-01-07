FROM node:20
WORKDIR /app

COPY package*.json ./
# npm ci si lockfile présent, sinon npm install
RUN npm ci || npm install

COPY . .
RUN npm run build

EXPOSE 3001
CMD ["node", "dist/server.js"]
