const mongoose = require('mongoose');

const dataSchema = mongoose.Schema(
  {
    name: String,
    options: {},
    x: Number,
    y: Number,
    z: Number,
    sector: String,
    owner: String,
  },
  { collection: 'planets' },
);

const Planets = mongoose.model('planets', dataSchema);

module.exports = Planets;
