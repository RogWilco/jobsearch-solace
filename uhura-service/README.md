# Uhura Service

The Uhura Service is a RESTful API that provides a way to manage and retrieve data from the Uhura database. The service is built using the [NestJS](https://nestjs.com/) framework and is designed to be deployed as a Docker container.

## Stack

- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [Jest](https://jestjs.io/)

## Quick Start

1. Start the database:

   ```sh
   docker compose up -d database
   ```

2. Install the dependencies:

   ```sh
   npx yarn install
   ```

3. Start the development server:

   ```sh
   yarn start:dev
   ```

4. View the Swagger documentation at `http://localhost:3000/docs`.
