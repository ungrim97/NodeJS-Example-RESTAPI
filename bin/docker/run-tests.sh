#!/bin/sh

# Run migrations
./bin/docker/run-migrations.sh

# Run both test suits
echo "Running Tests"
npm -s test
npm run -s test:integration

status=$?

# Create coverage report and store in artifacts
echo "Running coverage. Report stored in coverage.lcov"
exec npm run -s coverage -- --reporter=text-lcov > artifacts/coverage.lcov

exit $status
