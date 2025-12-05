# =========================
# STAGE 1: Builder
# =========================
FROM node:18-alpine AS builder

# Imposta variabili di ambiente
ENV NODE_ENV=production

# Crea directory di lavoro
WORKDIR /app

# Copia i file di configurazione e package.json
COPY package.json package-lock.json* yarn.lock* ./

# Installa le dipendenze (usa npm ci per build deterministica)
RUN npm ci

# Copia il resto del codice sorgente
COPY . .

# Compila il progetto Next.js
RUN npm run build

# =========================
# STAGE 2: Runner
# =========================
FROM node:18-alpine AS runner

# Imposta variabili di ambiente
ENV NODE_ENV=production

# Crea utente non root per sicurezza
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -s /bin/sh -D nextjs

# Crea directory di lavoro
WORKDIR /app

# Copia solo i file necessari dal builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Espone la porta
EXPOSE 3000

# Imposta utente non root
USER nextjs

# Comando di avvio
CMD ["npm", "start"]