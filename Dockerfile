# Base Stage: Common Shared Environment
FROM node:20 AS base

# Builder Stage: Heavy for Typescript Transpiling
FROM base AS builder
ARG PACKAGE
ARG UHURA_SERVICE_URL
ENV UHURA_SERVICE_URL=${UHURA_SERVICE_URL}
WORKDIR /app
COPY package*.json yarn.lock tsconfig*.json ./
WORKDIR /app/${PACKAGE}
COPY ${PACKAGE}/src ./src
COPY ${PACKAGE}/package*.json ${PACKAGE}/tsconfig*.json ${PACKAGE}/*.config.dist.ts ${PACKAGE}/index.htm* ./
WORKDIR /app
RUN yarn install --frozen-lockfile
WORKDIR /app/${PACKAGE}
RUN yarn dist
RUN rm -rf ./node_modules
WORKDIR /app
RUN rm -rf ./node_modules
RUN yarn install --frozen-lockfile --production

# Release Stage: Lean for Deployments (Service)
FROM base AS service
ARG PACKAGE
ENV NODE_ENV=production
COPY --from=builder /app/${PACKAGE}/out/dist ./
CMD ["yarn", "start:prod"]
EXPOSE 3000

# Production Stage: Lean for Deployments (Client)
FROM nginx:alpine AS client
ARG PACKAGE
ARG UHURA_SERVICE_URL
ENV UHURA_SERVICE_URL=${UHURA_SERVICE_URL}
RUN rm -rf /usr/share/nginx/html/*
COPY ${PACKAGE}/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/${PACKAGE}/out/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80
