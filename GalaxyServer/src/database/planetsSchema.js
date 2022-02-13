const mongoose = require('mongoose');

const dataSchema = mongoose.Schema(
  {
    name: String,
    mines: [],
    // x: Number,
    // y: Number,
    // z: Number,
    options: {
      maxOcupation: { type: Number, default: 10000 },
      clanOcupation: {}
    },
    sector: String,
    owner: String,
  },
  { collection: 'planets' },
);

const Planets = mongoose.model('planets', dataSchema);

module.exports = Planets;
