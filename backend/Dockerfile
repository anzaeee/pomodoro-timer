FROM node:18-slim

WORKDIR /app

# Install OpenSSL and other dependencies for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Run migrations and start server
CMD ["sh", "-c", "sleep 5 && (npx prisma migrate deploy || echo 'Migration failed, continuing...') && node server.js"]

