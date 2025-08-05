FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install Prisma dependencies first (for caching)
COPY prisma ./prisma
COPY package*.json ./
RUN npm install
RUN npx prisma generate

# Copy the rest of the source
COPY . .

# Build the TypeScript app
RUN npm run build

# Set environment variables for production (optional)
ENV NODE_ENV=production

# Start the app
CMD ["node", "dist/server.js"]

EXPOSE 3000 