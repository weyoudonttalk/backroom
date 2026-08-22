FROM node:20-alpine
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev
COPY server/dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
