FROM node:alpine AS deps

WORKDIR /usr/src/app

COPY ./.next/standalone /usr/src/app
RUN apk add --no-cache openssl3

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

# Use a non-root user for security
USER node

CMD ["node", "server.js"]
