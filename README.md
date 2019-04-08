[![CircleCI](https://circleci.com/gh/ungrim97/NodeJS-Example-RESTAPI.svg?style=svg)](https://circleci.com/gh/ungrim97/NodeJS-Example-RESTAPI) [![codecov](https://codecov.io/gh/ungrim97/NodeJs-Example-RESTAPI/branch/master/graph/badge.svg)](https://codecov.io/gh/ungrim97/NodeJs-Example-RESTAPI)

# NAME

ExampleNodeJSApp - Belt and Braces style example node app

# VERSION

1.0.0

# SYNOPSIS

    // Run Dev server
    npm run dev:docker:start

    // Generate data
    npm run dev:fixtures:populate:dockerize

    // Generate JWT string
    npm run dev:jwt:generate

    curl localhost:9000/messages -XPOST -H'Authorization: Bearer $JWT' -H'Accept: application/json' -H'Content-type: application/json' -d'{"text": "This is a test 📙", "owner": 1}'
    curl localhost:9000/messages/1 -XPUT -H'Authorization: Bearer $JWT' -H'Accept: application/json' -H'Content-type: application/json' -d'{"text": "This is a test 📙", "owner": 1}'
    curl localhost:9000/messages -XGET -H'Authroization: Beaer $JWT' '-H'Accept: application/json'
    curl localhost:9000/messages/1 -XGET -H'Authroization: Beaer $JWT' '-H'Accept: application/json'
    curl localhost:9000/messages/1 -XDELETE -H'Authroization: Beaer $JWT' '-H'Accept: application/json'

    // SwaggerUI
    http://localhost:9000/swagger

    // Run Full integration and unit tests
    npm run test:dockerize

    // run unit tests locally
    npm install
    npm run test:unit

    // Regenerate OMA3 docs
    npm run dev:docs:generate
    vi api-docs/openapi.{json,yml}

    // Destory containers and data volumes
    npm run dev:docker:destroy

# DESCRIPTION

This is designed an example NodeJS Rest API application showing all of the fixtures and fittings that
may be included in a production environment

The idea being that many examples and tutorials rarely sure examples of 'Production quality' code
that devs can actually use. Leaving a need to work out how best to architect them into the various
production service designs

# Docker

The Application can run in a docker container (1 for the application and 1 for the DB)

    npm run dev:db:start
    npm run dev:db:stop
The DB is available on 127.0.0.1:4406

    npm run dev:docker:start
    npm run dev:docker:stop
The Application is available on 127.0.0.1:9000

Starting the application server will automatically bring up the DB container
upon which if depends

# Running locally

You can run the dev server locally via the following commands

    npm run dev:db:start
    MS_DB_PORT=4406 npm run dev:fixtures:populate
    npm run dev:start

## Environment variables

The following environment variables are available to configure the system

- MS_DB_PORT: The port the database is available on
- MS_DB_HOST: The hostname of the database
- MS_DB_DATABASE: The database to connect to
- MS_DB_PASS: The password for the db user
- MS_DB_USER: The user of the database (default: message_app)

- MS_PORT: The Port to start the application on
- MS_BASE_URL: The base url of the application (default: http://localhost)
- MS_APP_LOG_LEVEL: The log level to output
- MS_ACCESS_LOG_FILE: The log filename to use for access logs
- MS_ERROR_LOG_FILE: The output error log filename

# Technology Stack

- CI (CircleCI): https://circleci.com/gh/ungrim97/NodeJS-Example-RESTAPI

- Code Coverage (CodeCov): https://codecov.io/gh/ungrim97/NodeJs-Example-RESTAPI

- Controller/Model/DAO design pattern

- Logger (Winston): https://github.com/winstonjs/winston

- Server Timings (Koa-server-timings): https://github.com/tinovyatkin/koa-server-timing#readme

- ORM (Sequelize): http://docs.sequelizejs.com/

- API Docs (Swagger/OpenAPI): https://swagger.io

- Containerization (Docker/DockerCompose): https://www.docker.com/

- Web Framework (KoaJS): https://koajs.com/

- Test Runner (MochaJs): https://mochajs.org/

- Assertions (ChaiJS): https://www.chaijs.com/api/assert/

- Mocking (Sinon): https://sinonjs.org/

- Linting (Prettier & ESLint): https://github.com/prettier/prettier & https://eslint.org/

- DB (MySQL8): https://dev.mysql.com/doc/refman/8.0/en/

# Future Desirables

- Logging more/better

- Request/Response caching

- 409 Conflict response if PUT request etag doesn't match current contents

- Last Updated Since handling

- JSDoc generation for models/dao

- API Documentation testing (Dredd)

# CONTRIBUTING

Patches are both encouraged and welcome. All contributers are however asked to follow some simple
guidelines:

- **Add Tests**

    Tests ensure your change doesn't get broken in the future

- **Document Changes**

    Documentation ensures people are aware of your change

- **Use feature branches**

    Feature branches help keep your changes easily accessible

- **One branch per feature**

    Independant branches ensure your change can be accepted independant of other changes

- **Atomic commits**

    Meaningful atomic commits help people understand the history of your change. Try and avoid commits like 'Fix typo' or 'fix broken test' by squashing them with the original change they fix. Commits like 'Implement test for feature X' and 'Modify X to achive Y' are more helpful.

# LICENSE

Copyright (C) Mike Eve.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

# AUTHOR

Mike Eve <ungrim97@gmail.com>
