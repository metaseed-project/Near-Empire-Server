const mongoose = require('mongoose');

const dataSchema = mongoose.Schema(
  {
    account: String,
    data: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0,
        z: 0,
        fuel: 0,
        artifact1: 0,
        artifact2: 0,
        artifact3: 0,
        networkId: { type: String, default: "" },
        nftLink: "",
        minted: [],
      })
    },
  },
  { collection: 'players' },
);

const Players = mongoose.model('players', dataSchema);

module.exports = Players;
