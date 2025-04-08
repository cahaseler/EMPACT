# Builder stage
FROM node:22.11.0-slim AS builder

WORKDIR /app

# Copy root dependency files
COPY package.json yarn.lock ./
# Copy workspace dependency file
COPY web/package.json ./web/
# Copy necessary config files (adjust if others are needed for build)
COPY tsconfig.json ./
COPY web/tsconfig.json ./web/
COPY web/next.config.mjs ./web/
COPY prettier.config.cjs ./
COPY web/prettier.config.cjs ./web/
COPY tailwind.config.ts ./
COPY web/tailwind.config.ts ./web/
COPY web/postcss.config.mjs ./web/

# Install dependencies using workspaces
RUN yarn install --frozen-lockfile

# Copy the rest of the web source code needed for the build
COPY web/ ./web/
# Copy any other shared source code if needed by the web build
# e.g., COPY shared/ ./shared/

# Generate Prisma client for the required schema
RUN yarn workspace empact_web prisma generate --schema=prisma/mssql/schema.prisma

# Build Next.js app (will create standard .next output now)
RUN yarn workspace empact_web build

# Standalone setup steps removed as output mode is no longer standalone

# Production stage
# Use the standard Node image which includes more common libraries like OpenSSL
FROM node:22.11.0 AS production

# Set working directory to match builder root for consistency
WORKDIR /app

# Copy necessary package files for running the app
COPY package.json yarn.lock ./
COPY web/package.json ./web/

# Copy the entire node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the built Next.js app from the web workspace
COPY --from=builder /app/web/.next ./web/.next

# Copy public assets
COPY --from=builder /app/web/public ./web/public

# Copy Prisma schema and generated client
COPY --from=builder /app/web/prisma ./web/prisma

# No need to install OS dependencies like openssl unless specifically required
# RUN apt-get update && apt-get install -y openssl ca-certificates --no-install-recommends && \
#     apt-get clean && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    DEBUG=prisma:*

EXPOSE 3000

# Use yarn workspace to run the start script defined in web/package.json
CMD ["yarn", "workspace", "empact_web", "start"]
