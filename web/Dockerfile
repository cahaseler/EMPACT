FROM node:18.18.2 AS deps

WORKDIR /usr/src/app

COPY ./.next/standalone /usr/src/app

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
