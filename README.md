## Repo Overview

This is a Next.js project. It is using the App Router of Next.js v14. It is also
using Prisma ORM along with a SQLite database that you can find at:
`src/prisma/dev.db`. Finally, MUI is already setup and ready to use.

## Implementation details

In order to run this app, you need to follow these steps

1. `npm install` to install all your dependencies
2. Create a `.env` file at the root of the project and add this line:
   `DATABASE_URL="file:./dev.db"`
3. `npm run db:generate` to generate the Prisma schema and other artifacts as
   specified in ZModel.
4. `npm run db:migrate` to run any pending database migrations.
5. `npm run dev` to start the server
6. Visit `http://localhost:3000/dashboard` to get started

## Other tasks

1. `npm run db:seed` to seed your database with dummy data.
2. `npm run db:studio` to open the prisma db studio.
3. `npm run db:reset` to reset the database. It actually cleans up, run all
   migrations and seeds the db.
4. `npm run typecheck` to compile the project defined by the tsconfig.json.
5. `npm run format` to format the project defined by the prettier.config.js.

## Added Packages to the project

The following packages were added to the project:

1. `@epic-web/remember` used by prisma implementation. It's basically a
   type-safe singleton implementation that you can use to keep state between
   module re-evaluations. In our case used for the db connections.
2. `@faker-js/faker` used by seed data to create dummy data. It could also be
   used by unit tests.
3. `@hookform/resolvers`used by edit project form. Adds the zod validator on the
   forms.
4. `@testing-library/user-event` used by tests.
5. `@zenstackhq/runtime` ORM build on top of Prisma, covering access control
   requirements.
6. `clsx` utility for constructing className strings conditionally.
7. `debounce` delay function calls until a set time elapses after the last
   invocation. Used by the auto-save functionality
8. `framer-motion` used by the mobile view of the dashboard layout
9. `react-hook-form` used by edit project form. Build extensible forms with
   easy-to-use validation.
10. `tsx` used in package.json for the prisma section in order to run the seed
    command.
11. `use-deep-compare-effect` used to autosave functionality. It's React's
    useEffect hook, except using deep comparison on the inputs.
12. `zod` used to form validations. Create a validator and Zod will
    automatically infer the static TypeScript type.
13. `prettier`, `prettier-plugin-sql`, `prettier-plugin-tailwindcss`,
    `tailwindcss`, `vitest`. All these dev dependencies, were also added
14. `vitest`, dev dependency to create the tests

### 1. Folder Structure

1. `components`, folder that contains all the shared components
2. `dashboard`, folder that holds all the routes for the app. the routes are:

   - `/dashboard`, A screen with just a text has been created.
   - `/dashboard/projects`, The list of the projects
   - `/dashboard/projects/[projectId]`, The edit project screen

3. `hooks`, folder that holds all shared hook. At this point the useBreadcrumb
   hook has been created in order each screen to pass to the context the
   breadcrumb title which is visible on the header of the dashboard layout.
4. `services`, folder that contains all services of all entities and the db
   configuration files
5. `styles`, folder that contains all global styles. For now it has the tailwind
   imports in order the tailwind classes to be available to the project
6. `prisma`, folder that contains the prisma schema, db migrations, seed file
   and the local db file
7. `tests`, setup some mocks for the tests, and some db-utils, that currently
   are used only by the seed process. At the point tests will be written for
   data operations these utils, alongside with the setup of a test db, will be
   needed for the tests too.

### 2. Database Layer

Zenstack has been chosen as the ORM of the application as it will give us the
future ability to apply access policies to the db tables. The policies are
applied at the database level via a new schema.zmodel file, so we will need to
modify this file to change DB schema moving forward. The Zenstack Docs are
excellent at explaining how to use the new @@allow & @@deny attributes, but the
syntax is pretty intuitive. Using Zenstack, we can easily implement soft-delete
in our DB, which I did creating the corresponding prisma extensions.

#### Structure

1. `services/prisma.extensions.ts`, 3 extensions have been created for the
   prisma client. The softDelete, softDeleteMany and logLongRunningQueries to
   log and monitor the long running db queries
2. `services/custom-prisma-client.ts`, Here we create the custom prisma client
   which is actually extended with the above extensions.
3. `services/db.server.ts`, provides the prisma client enhanced by the access
   policy. For the purpose of this task no authentication has been used, but
   assuming that we would use Clerk, we could pass the loggedIn Clerk user to
   the zmodel. We also create an unrestricted prisma client without access
   policies or data validation. Used by seed file or unit tests. Please notice,
   that we return the extended version of the Prisma client that holds all the
   aforementioned extensions.
4. `services/db-context.server.ts`, provides an instance of the DataService
   class where the Prisma client has been restricted. The getDbContext() will be
   called by our application. In order the access policies to work, this method
   should get as parameter the current request context, that holds information
   about the loggedIn clerk user, about the url or whatever we would like to use
   as param in order to determine the access policies. All services will be
   registered inside the dbContext. For example, for the purpose of this task,
   the `project.server.ts` holds all the related db operations for the project.
   For every new entity we add we should create the corresponding service and
   register it inside the context.
5. `schema.zmodel`. Using the zenstack ORM, means that from now on we modify the
   .zmodel schema, not the prisma.schema, as this is auto-generated by the
   `zenstack generate` command.

#### Soft Delete explanation

Having creating the extended prisma client, what is left for this implementation
is the following:

1. Add the `@@deny('read', deleted)` to the .zmodel file. In this way we will
   not read the soft deleted entries.
2. On deleting an entry use the clientSoftDelete client to soft delete.

### 3. App details

1. You will notice that a dashboard like layout was chosen. On the header, there
   is a breadcrumb and the profile icon which on hover a menu is displayed.
2. There is a left navigation panel in order to easily navigate on the dashboard
   items. On each project item of the projects list screen, there is an action
   menu as well.
3. On editing an already existing project the breadcrumb displays the project
   title.
4. On clicking the `Create Project` button on the breadcrumb the 'new' label is
   displayed. No project has been created to the db at this point.
5. At the moment the project will be saved both the breadcrumb and the title
   will display the title.
6. Some validation rules have also been added on the field inputs. The same
   validation rules are running both on the client and the backend side. The
   save operation will run only if all validation rules are successful.
