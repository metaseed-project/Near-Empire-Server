const mongoose = require('mongoose');

const config = require('../core/config');
const planetsSchema = require('./planetsSchema');
const playersSchema = require('./playersSchema');

mongoose.Promise = global.Promise;
mongoose
  .connect(config.DB_HOST, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .catch((e) => {
    console.error('Mongo Error->' + e);
  });

const db = mongoose.connection;

module.exports = { planetsSchema, playersSchema, db };
