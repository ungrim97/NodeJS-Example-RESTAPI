'use strict';
const lintTest = require('mocha-eslint');

lintTest(['bin', 'src', 'test', 'database', 'config'], {
  strict: true,
  formatter: 'tap',
  timeout: 0
});
