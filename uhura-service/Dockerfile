# Base Stage: Common Shared Environment
FROM node:20 AS base

# Builder Stage: Heavy for Typescript Transpiling
FROM base AS builder
WORKDIR /app
COPY src ./src
COPY package*.json yarn.lock tsconfig*.json .npmrc ./
RUN npx yarn install --frozen-lockfile
RUN npx yarn dist

# Release Stage: Lean for Deployments
FROM base AS release
ENV NODE_ENV=production
COPY --from=builder /app/out/dist ./
CMD ["yarn", "start:prod"]
EXPOSE 3000
