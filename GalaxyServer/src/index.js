const express = require('express');
const { planetsSchema } = require('./database');
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

app.get('/addIndex', async (req, res) => {
  const planet = await planetsSchema.findOne({ name: "counter" });
  
  planet.options.defaultOcupation++;
  await planet.save();

  res.send({});
});

app.get('/mintPlanet', async (req, res) => {
  const to = req.query.to;
  const name = req.query.name;
  const planet = await planetsSchema.findOne({ name });
  if(planet.minted.indexOf(to) != -1) return res.send({ status: false });
  
  const counter = await planetsSchema.findOne({ name: "counter" });
  try {
    await mintNft(name, counter.options.defaultOcupation + 1, to);
  } catch(e) {
    console.log(e);
    return res.send({ status: false });  
  }

  counter.options.defaultOcupation++;
  await counter.save();

  planet.minted.push(to);
  await planet.save();

  res.send({ status: true });
});

app.get('/couldMint', async (req, res) => {
  const to = req.query.to;
  const name = req.query.name;
  const planet = await planetsSchema.findOne({ name });
  res.send({ status: planet.minted.indexOf(to) == -1 });
});

app.get('/getIndex', async (req, res) => {
  const planet = await planetsSchema.findOne({ name: "counter" });
  res.send({ index: planet.options.defaultOcupation });
});

app.get('/getPlanet', async (req, res) => {
  const x = req.query.x;
  const y = req.query.y;
  const z = req.query.z;

  const planet = await planetsSchema.findOne({ x, y, z });
  res.send(planet ? [planet] : []);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
