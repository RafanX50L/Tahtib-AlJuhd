FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV PORT=5000
EXPOSE 5000
CMD ["node", "--experimental-specifier-resolution=node", "dist/server.js"]