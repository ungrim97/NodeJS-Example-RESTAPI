#!/bin/sh

echo "Running Tests"
npm -s test
npm run -s test:integration

echo "Running coverage. Report stored in coverage.lcov"
exec npm run -s coverage -- --reporter=text-lcov > coverage.lcov

wait

