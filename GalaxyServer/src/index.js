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

  res.send(planets);
});

app.get('/addMiner', async (req, res) => {
  const name = req.query.name;
  const clanId = req.query.clanId;
  const mineType = req.query.mineType;
  
  const planet = await planetsSchema.findOne({ name });
  if(!planet) res.send({ err: "no planet found" });

  planet.mines.push({
    clanId,
    mineType,
  });

  await planet.save();

  res.send({});
});

app.get('/mintPlanet', async (req, res) => {
  const account = req.query.to;
  const planetName = req.query.name;
  
  const player = await playersSchema.findOne({ account });

  if(!player) return res.send({ status: false });
  if(player.data.minted.indexOf(planetName) != -1) return res.send({ status: false });
  
  const counter = await planetsSchema.findOne({ name: "counter" });
  try {
    await mintNft(planetName, counter.options.defaultOcupation + 1, account);
  } catch(e) {
    console.log(e);
    return res.send({ status: false });  
  }

  player.data.minted.push(planetName);
  await player.save();

  counter.options.defaultOcupation++;
  await counter.save();

  res.send({ status: true });
});

app.get('/couldMint', async (req, res) => {
  const to = req.query.to;
  const name = req.query.name;
  const planet = await planetsSchema.findOne({ name });
  res.send({ status: planet.minted.indexOf(to) == -1 });
});

app.get('/addIndex', async (req, res) => {
  const planet = await planetsSchema.findOne({ name: "counter" });
  
  planet.options.defaultOcupation++;
  await planet.save();

  res.send({});
});

app.get('/getIndex', async (req, res) => {
  const planet = await planetsSchema.findOne({ name: "counter" });
  res.send({ index: planet.options.defaultOcupation });
});

app.get('/updatePlayer', async (req, res) => {
  const account = req.query.account;
  const fuel = req.query.fuel;
  const artifact1 = req.query.artifact1;
  const artifact2 = req.query.artifact2;
  const artifact3 = req.query.artifact3;
  const mint = req.query.mint;
  
  const player = await playersSchema.findOne({ account });
  if(!player) return res.send({ status: false });
  
  if(fuel) player.data.fuel = fuel;
  if(artifact1) player.data.artifact1 = artifact1;
  if(artifact2) player.data.artifact2 = artifact2;
  if(artifact3) player.data.artifact3 = artifact3;
  if(mint) player.data.minted.push(mint);
  await player.save();

  res.send({});
});

app.get('/getPlayer', async (req, res) => {
  const account = req.query.account;
  const player = await playersSchema.findOne({ account });
  if(!player) {
    const newPlayer = new playersSchema({account});
    await newPlayer.save();
    return res.send(newPlayer);
  }
  res.send(player);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
