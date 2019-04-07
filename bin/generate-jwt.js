'use strict';
const jwt = require('jsonwebtoken');
const fs = require('fs');

console.log(
  jwt.sign({ name: 'testUser' }, fs.readFileSync('test/auth-private.key'), {
    algorithm: 'ES256'
  })
);
