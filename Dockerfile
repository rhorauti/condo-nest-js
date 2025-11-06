# ---- Base Stage (for dependencies) ----
# Use an official Node.js LTS (Long Term Support) image.
# 'alpine' is a lightweight Linux distribution.
FROM node:20-alpine AS base

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
# This leverages Docker's layer caching. These files don't change often,
# so this step will be skipped on future builds if they haven't changed.
COPY package*.json ./


# ---- Builder Stage (for building the app) ----
# This stage will have all devDependencies and build tools
FROM base AS builder

# Install all dependencies (including devDependencies)
# 'npm ci' is faster and more reliable for CI/CD than 'npm install'
RUN npm ci

# Copy the rest of your application's source code
COPY . .

# Run the build script defined in your package.json
RUN npm run build


# ---- Production Stage (for the final image) ----
# This is the final, slim image that will run in production
FROM base AS production

# Create a non-root user and group for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy *only* the production dependencies from the 'base' stage
# This uses the 'npm ci' from the 'base' stage, but we'll prune it.
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/package*.json ./

# Alternatively, you can re-install *only* prod dependencies
# If you uncomment the line below, remove the COPY --from=base .../node_modules line above
# RUN npm ci --omit=dev

# Copy the built application from the 'builder' stage
COPY --from=builder /usr/src/app/dist ./dist

# Switch to the non-root user
USER appuser

# Expose the port your NestJS app runs on (default is 3000)
EXPOSE 3000

# The command to start your application
CMD [ "node", "dist/main.js" ]