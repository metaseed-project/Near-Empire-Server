const mongoose = require('mongoose');

const dataSchema = mongoose.Schema(
  {
    name: String,
    mines: {
      type: Array,
      default: () => []
    },
    options: {
      maxOcupation: { type: Number, default: 10000 },
      defaultOcupation: { type: Number, default: 10000 },
      clanOcupation: {}
    },
    sector: String,
    owner: String,
    minted: {
      type: Array,
      default: () => []
    },
  },
  { collection: 'planets' },
);

const Planets = mongoose.model('planets', dataSchema);

module.exports = Planets;
