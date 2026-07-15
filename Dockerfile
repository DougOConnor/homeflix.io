# ---- Stage 1: build the React frontend ----
FROM node:22-slim AS frontend-build
WORKDIR /build
COPY app/frontend/package.json app/frontend/package-lock.json ./
RUN npm ci
COPY app/frontend/ ./
RUN npm run build

# ---- Stage 2: backend runtime ----
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app

# Backend dependencies — sqlite3/bcrypt may need to compile from source,
# so pull in build tools for the install and drop them afterwards.
COPY app/package.json app/package-lock.json ./
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && npm ci --omit=dev \
    && apt-get purge -y python3 make g++ \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Backend source
COPY app/ ./

# Built frontend, served by express from frontend/build
COPY --from=frontend-build /build/build ./frontend/build

# SQLite database + uploaded images live here — mount a volume to persist
VOLUME ["/app/data"]

EXPOSE 8080

# TMDB_TOKEN must be provided at runtime (never baked into the image):
#   docker run -e TMDB_TOKEN=... -v homeflix-data:/app/data -p 8080:8080 <image>
# Migrations run first so a fresh volume gets its schema.
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node index.js"]
