const express = require('express');
const { planetsSchema } = require('./database');
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
