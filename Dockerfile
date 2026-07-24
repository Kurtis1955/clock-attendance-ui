# Use the official Node.js image as the base
FROM node:22.14.0 AS builder

# Set the working directory
WORKDIR /app

# Copy only necessary files for dependency installation
COPY package*.json ./ 

# Install dependencies
# RUN npm ci --omit=dev && npm cache clean --force
RUN npm install

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

FROM node:22.14.0-slim AS runner

WORKDIR /app
# Set environment variables
# ENV NODE_ENV=development

COPY --from=builder /app/package*.json ./

COPY --from=builder /app/.next ./.next

COPY --from=builder /app/public ./public

RUN npm ci
# Expose the port Next.js will run on
EXPOSE 3300

# Start the Next.js application
CMD ["npm", "run", "start"]
