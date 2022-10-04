FROM node:16-buster-slim

WORKDIR /app

COPY package*.json .npmrc ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
