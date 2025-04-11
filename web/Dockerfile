# Single-stage build: Install all dependencies, copy source, build, and run
FROM node:22.11.0-bookworm
WORKDIR /app

# Copy package files first for better caching
COPY web/package.json web/yarn.lock ./

# Install ALL dependencies (including devDependencies needed for build and runtime)
RUN yarn install --frozen-lockfile

# Copy the rest of the source code
# Ensure this path is correct relative to your Docker build context
COPY web/. .

# Build the Next.js app (includes prisma generate)
RUN yarn build

# Install runtime dependencies (like OpenSSL for Prisma) and ensure Prisma engines are executable
# Combine these RUN commands for layer efficiency
RUN apt-get update && apt-get install -y openssl ca-certificates && \
    find ./node_modules/.prisma/client -name "libquery_engine-*" -exec chmod +x {} \; || true && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables for production
ENV NODE_ENV=production \
    PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the app using the standard Next.js start script
CMD ["yarn", "start"]
