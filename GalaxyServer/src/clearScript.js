const { planetsSchema } = require('./database');

(async ()=>{
  const sector = "session1";

  const planets = await planetsSchema.find({ sector });
  for(const planet of planets){
    console.log(planet);
    planet.mines = [];
    planet.owner = null;
    planet.options = {
      maxOcupation: 10000,
      defaultOcupation: 10000,
      clanOcupation: {},
    }
    await planet.save();
  }
})();