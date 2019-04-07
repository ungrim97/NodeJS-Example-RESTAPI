[![CircleCI](https://circleci.com/gh/ungrim97/NodeJS-Example-RESTAPI.svg?style=svg)](https://circleci.com/gh/ungrim97/NodeJS-Example-RESTAPI) [![codecov](https://codecov.io/gh/ungrim97/api_example_app/branch/master/graph/badge.svg)](https://codecov.io/gh/ungrim97/api_example_app)

# NAME

ExampleNodeJSApp - Belt and Braces style example node app

# SYNOPSIS

    // Run Dev server
    npm run dev:dockerize

    curl localhost:9000/messages -XPUT -H'Accept: application/json' -H'Content-type: application/json' -d'{"text": "This is a test 📙", "owner": 1}'
    curl localhost:9000/messages/1 -XGET -H'Accept: application/json'


    // Run Full integration and unit tests
    npm run test:dockerize

    // run unit tests locally
    npm install
    npm run test:unit


# DESCRIPTION

This is designed an example NodeJS Rest API application showing all of the fixtures and fittings that
may be included in a production environment

The idea being that many examples and tutorials rarely sure examples of 'Production quality' code
that devs can actually use. Leaving a need to work out how best to architect them into the various
production service designs

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
