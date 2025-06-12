FROM node:20-alpine
RUN apk add --no-cache bash
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install axios
EXPOSE 3000
CMD ["bash", "-c", "while ! </dev/tcp/postgres/5432; do sleep 1; done; node scripts/init-db.js && npm start"]
