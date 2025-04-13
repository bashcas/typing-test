# Getting Started with LINCtype

Quick start:
Install dependencies: npm install
Start the server: npm start
Start the DB server: npm run json-server
Build on production: npm run build

## Available Scripts

In the project directory, you can run several commands: `npm start`, `npm run json-server`, `npm test`, `npm run build`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run json-server`

Runs the JSON Server pseudo-db which can be found in the db.json file. JSON Server supports standard CRUD operations. To learn more about json-server, see its [npm page](https://www.npmjs.com/package/json-server) for more information.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Architecture

### Domain

The domain layer is the core of the application. It contains the business logic and the data access logic.

### Application

The application layer is the layer that is responsible for the application's logic. It is responsible for the application's business logic and the data access logic. In our case, since this is a frontend application, our use cases are the components and hooks that are responsible for the application's logic.

### Infrastructure

The infrastructure layer is the layer that is responsible for the data access logic. It is responsible for the data access logic and the data storage logic. Here mostly will go the repositories responsible for connecting to the api.
