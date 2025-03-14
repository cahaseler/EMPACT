FROM node:20-slim

WORKDIR /usr/src/app

# Copy the standalone Next.js output that's already been built by yarn build-linux
COPY ./.next/standalone /usr/src/app

# Copy public and static files (these should already be included by build-linux)
COPY ./public /usr/src/app/public
COPY ./.next/static /usr/src/app/.next/static

# Install necessary dependencies for Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates

# Set executable permissions for Prisma engines
RUN find /usr/src/app -name "libquery_engine-*" -exec chmod +x {} \; || true
RUN find /usr/src/app -name "libquery_engine-*" -exec ls -la {} \; || true

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    DEBUG=prisma:*

EXPOSE 3000
# Use a non-root user for security
USER node
CMD ["node", "server.js"]
