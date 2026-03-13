FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma
COPY server ./server
COPY index.html account.html faq.html main.js account.js faq.js styles.css ./

RUN apk add --no-cache openssl
RUN npm install
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
