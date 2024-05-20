# Uhura Client

The Uhura Client is a web application that provides a user interface for interacting with the Uhura Service. The client is built with [React](https://react.dev/) and is designed to be deployed as a Docker container.

## Stack

- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Mantine](https://mantine.dev/)

## Quick Start

1. Start the backend service:

   ```sh
   docker compose up -d service
   ```

2. Install the dependencies:

   ```sh
   npx yarn install
   ```

3. Start the development server:

   ```sh
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.
