'use strict';
const config = require('config');
const fixtures = require('../test/integration/fixtures');

const Store = require('../src/store');
const store = new Store(config.get('store'));

fixtures.populate(store).then(() => process.exit(0));
