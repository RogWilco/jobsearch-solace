# Uhura

Experience the power of Uhura, your ultimate healthcare companion. Effortlessly
track and manage communications and document submissions with healthcare
providers and insurance carriers. Streamline your record-keeping process for
peace of mind and ultimate convenience.

## Quick Start

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Using Docker Compose (Recommended)

1. Start all services:

   ```sh
   docker compose up -d
   ```

2. ???

3. Profit: `http://localhost:3001`.

### Manually

### Additional Prequisites

- [Node.js v20.0+](https://nodejs.org/en/download/)

1.  Start the database:

    ```sh
    docker compose up -d database
    ```

2.  Install dependencies:

    ```sh
    yarn install
    ```

3.  Start the backend and frontend services:

    1. Both together:

    ```sh
    yarn start
    ```

    2. Or separately:

    ```sh
    yarn start:service
    ```

    ```sh
    yarn start:client
    ```

4.  Open your browser and navigate to `http://localhost:3001`.

## Design

To put my own spin on the project, I drew inspiration from my personal
experience working as my own advocate in the healthcare system. I wanted to
create a tool that would help me document my interactions with healthcare
providers and insurance carriers as I negotiated through the system.

I also took some artistic license drawing inspiration from the Star Trek
universe. While Uhura was before my time, it seemed fitting to name the app
after the infmamous communications officer.

### Considerations

- I chose to use a **_monorepo_** structure to keep the frontend and backend
  services together, supported by
  [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/). I
  often find matching the repository structure to the people structure is the
  most effective. Since I was going to be the sole developer, this structure
  kept the development workflow simple and streamlined.

- For **_data persistence_**, I opted for the tried and true relational database
  [PostgreSQL](https://www.postgresql.org/). I chose this database for its
  proven track record in similar applications and its wide adoption in the
  industry. [MySQL](https://www.mysql.com/) would have been a equally suitable
  choice.

- I opted to use an **_ORM_** at the application level to favor accelerated
  development and out-of-the-box security features. I chose
  [TypeORM](https://typeorm.io/) for its TypeScript support integration with
  the NestJS framework. An alternative I considered was
  [Prisma](https://prisma.io/) , but felt it was not yet mature enough for this
  project and complicated the integration with NestJS.

- For the **_API layer_**, I chose alother time-tested design pattern, the
  RESTful API. I find this pattern to be the most intuitive and easy to work
  with for simple applications. I was tempted to go the GraphQL route, but I
  felt it would be overkill for the scope of this project.

- I wanted to keep the **_data model_** simple for this iteration. The
  focus was on the core functionality of creating, updating, and deleting notes.
  Future iterations would include more complex data models with relationships to
  other entities (e.g. users, appointments, etc).

- For the **_UI_** I chose to use [React](https://reactjs.org/) as the frontend
  framework. I have the most experience with React and felt it would be the
  quickest way to get a working prototype up and running. I also wanted to
  experiment with [Vite](https://vitejs.dev/) as the build tool. I found it to
  be faster than other tools I've used in the past.

- For **_UI_** components, I chose to go with the
  [Mantine](https://mantine.dev/) component library. I found it to be a good
  balance between flexibility and ease of use. I also wanted to experiment with a
  new library and see how it compared to other popular libraries I've used in the
  past.

### Stack

#### Tools

- [Yarn Workspaces](https://yarnpkg.com/features/workspaces)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

#### Uhura Client (Frontend)

- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Mantine](https://mantine.dev/)

#### Uhura Service (Backend)

- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)

### To-Dos/Next Steps/Wishlist

- [ ] **Markdown:** Add support for markdown formatting in notes (possibly including a rich text editor).
- [ ] **Data Model:** Implement a more robust data model for notes, including relationships to
      other entities (e.g. users, appointments, etc).
- [ ] **Shared Code:** Unify common types and interfaces between the frontend and backend
      services (single source of truth for schemas, enums, validation, etc).
- [ ] **CI/CD:** Create pipelines for automated testing and deployment.
- [ ] **Test Coverage:** Implement more comprehensive test coverage for both the frontend and
      backend services.
- [ ] **UI:** Refine the UI to be more unique and distinctive.
- [ ] **Input Validation:** Implement more robust input validation in the frontend and forward backend
      validation errors to the UI.
- [ ] **Authn/Authz:** Implement user authentication and authorization.
- [ ] **Backend Utilization:** Connect the frontend to the existing backend search functionality.
- [ ] **Automatic Versioning:** Implement automatic versioning using semantic-release or similar tooling.

---

## Specification

### Background

Solace wants to see how you develop code and deliver a small project that would be similar to your day-to-day work at Solace. The app built here will flex both your backend and frontend skill sets.

Solace has a feature that allows advocates to create notes on both their individual client appointments and contract work they perform for the client. A simple feature that has proven very valuable for advocates to solidify all their information inside one application that they can then share with their clients as they see fit. We want you to build the first iteration of what that feature was for Solace.

### Deliverables

The deliverable out of this should be a link to a Github repo, whatever documentation you might think would be helpful, and a working web app hosted somewhere publicly accessible.

### Task

Please build a very simple “Notes” Web App. An app that will allow a user to Index, Create, Update and Delete notes.

Our main goal is to see how you put the pieces together, so feel free to be creative and have fun with it. Please ensure that you cover all of the acceptance criteria mentioned below but be sure to add your own spin on it and if you have to make tradeoffs in any area, that’s fine, just mention what and why in your documentation. Technical framework decisions are up to you (so long as they are in the JS/TS family), if you want this to be a NestJS and React app, great! If you want it to be a NextJS app, also great! If you want to do another framework or a hybrid, also great!

Please include in the README any details around the implementation of the final product, struggles you ran into and things you would change are return to.

The goal here isn't merely to hack something together, but to lay out something that looks and feels nice. We appreciate that this isn't going to be a completely polished product, but we want to understand what you're capable up, not just an MVP.

### Acceptance Criteria

Must be written with JavaScript or Typescript (preferred)

- [x] Note Form must have the following validations
  - [x] Must not be shorter then 20 characters
  - [x] Must not be longer then 300 characters
- [x] Main page must include all the notes and a way to create a new note
- [x] Main page must include a search bar that will find based on a notes content. (Client or Server query is fine)
- [x] Must include README with steps on how to run the application(s) locally and any details around the implementation of the final product, struggles you ran into, and things you would change and return to if given more time.
- [x] Must include working web app hosted somewhere publicly accessible
