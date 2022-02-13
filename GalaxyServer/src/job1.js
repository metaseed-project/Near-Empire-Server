const { planetsSchema } = require('./database');
const schedule = require('node-schedule');

async function update() {
  console.log("Update");
  
  const planets = await planetsSchema.find();
  for (const p of planets) {

    const maxOcupation = defaultOcupation + 100 * p.mines.length;
    p.options.maxOcupation = maxOcupation;

    const prevDict = { ...p.options.clanOcupation };
    for (const m of p.mines) {
      if(!prevDict[m.clanId]) prevDict[m.clanId] = 0;
      prevDict[m.clanId] += parseInt(m.mineType) * 10 + 20;

      if(prevDict[m.clanId] >= maxOcupation) {
        p.owner = m.clanId;
        p.options.clanOcupation = {};
        p.mines = [];
        
        await p.save();
        break;
      }
    }
    p.options.clanOcupation = prevDict;
    await p.save();
  }
}

const job = schedule.scheduleJob('*/10 * * * * *', update);

// (async () => {})();

// function delay(ss) {
//   return new Promise(resolve => setTimeout(resolve, ss * 1000))
// }