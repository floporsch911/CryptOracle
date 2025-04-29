# backend/Dockerfile
FROM node:23-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

# Expose the port the app runs on
EXPOSE 4000

COPY . .

CMD ["node", "index.js"]
