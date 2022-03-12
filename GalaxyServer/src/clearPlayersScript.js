const mongoose = require('mongoose');
const { db } = require('./database');

(async () => {
  await db.dropCollection('players');
  process.exit(0);
})();