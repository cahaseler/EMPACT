FROM node:20.14.0 AS deps

WORKDIR /usr/src/app

COPY ./.next/standalone /usr/src/app

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

# Use a non-root user for security
USER node

CMD ["node", "server.js"]
