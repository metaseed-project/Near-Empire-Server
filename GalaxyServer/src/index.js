const express = require('express');
const { planetsSchema, playersSchema } = require('./database');
const { mintNft } = require('./mint');
const config = require('./core/config');
const app = express();
const port = config.PORT;

app.use(express.json());

app.get('/getPlanets', async (req, res) => {
  const sector = req.query.sector;

  const planets = await planetsSchema.find({ sector });

  return res.send(planets);
});

app.get('/addMiner', async (req, res) => {
  const name = req.query.name;
  const clanId = req.query.clanId;
  const mineType = req.query.mineType;

  const planet = await planetsSchema.findOne({ name });
  if (!planet) return res.send({ err: "no planet found" });

  planet.mines.push({
    clanId,
    mineType,
  });

  await planet.save();

  return res.send({});
});

app.get('/mintPlanet', async (req, res) => {
  const account = req.query.to;
  const planetName = req.query.name;

  const player = await playersSchema.findOne({ account });

  if (!player) return res.send({ status: false });
  if (player.minted.includes(planetName)) return res.send({ status: false });

  const counter = await planetsSchema.findOne({ name: "counter" });
  try {
    await mintNft(planetName, counter.options.defaultOcupation + 1, account);
  } catch (e) {
    console.log(e);
    return res.send({ status: false });
  }

  const newMinted = [planetName, ...player.minted];
  await player.update({ _id: player._id }, { minted: newMinted });

  counter.options.defaultOcupation++;
  await counter.save();

  return res.send({ status: true });
});

app.get('/addIndex', async (req, res) => {
  const planet = await planetsSchema.findOne({ name: "counter" });

  planet.options.defaultOcupation++;
  await planet.save();

  return res.send({});
});

app.get('/getIndex', async (req, res) => {
  const planet = await planetsSchema.findOne({ name: "counter" });
  return res.send({ index: planet.options.defaultOcupation });
});

app.get('/updatePlayer', async (req, res) => {
  const account = String(req.query.account);
  const fuel = req.query.fuel;
  const artifact1 = req.query.artifact1;
  const artifact2 = req.query.artifact2;
  const artifact3 = req.query.artifact3;
  const networkId = req.query.networkId;
  const nftLink = req.query.nftLink;

  const player = await playersSchema.findOne({ account });
  if (!player) return res.send({ status: false });

  const newData = { ...player.data };

  if (fuel) newData.fuel = Number(fuel);
  if (artifact1) newData.artifact1 = Number(artifact1);
  if (artifact2) newData.artifact2 = Number(artifact2);
  if (artifact3) newData.artifact3 = Number(artifact3);
  if (networkId) newData.networkId = String(networkId);
  if (nftLink) newData.nftLink = String(nftLink);

  await player.update({ _id: player._id }, { data: newData }, { upsert: false });

  return res.send({});
});

app.get('/getPlayer', async (req, res) => {
  const account = String(req.query.account);
  const player = await playersSchema.findOne({ account });
  if (!player) {
    const newPlayer = new playersSchema({ account });
    await newPlayer.save();
    return res.send(newPlayer);
  }
  return res.send(player);
});

app.get('/getPlayerQuery', async (req, res) => {
  const networkId = String(req.query.networkId);
  const player = await playersSchema.findOne({ "data.networkId": networkId });
  if (!player) {
    return res.send({ status: false });
  }
  return res.send(player);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
