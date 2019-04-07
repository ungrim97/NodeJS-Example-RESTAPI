'use strict';
const lintTest = require('mocha-eslint');

lintTest(['bin', 'src', 'test'], {
  strict: true,
  formatter: 'tap',
  timeout: 0
});
