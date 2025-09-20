FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
# fasdfa
RUN npm install

COPY . .

ENV PORT=5000

EXPOSE 5000

CMD ["npm", "run", "dev"]