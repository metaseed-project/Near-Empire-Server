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
