# Multi-stage build: constrói o frontend Vite e serve via Node.js Express + Socket.io
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Runtime enxuto
FROM node:20-alpine
WORKDIR /app

COPY server/package*.json ./
RUN npm install --omit=dev

COPY server/ .
COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD ["node", "server.js"]
