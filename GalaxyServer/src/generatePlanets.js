const size = 2000;
const dimensions = 2;
const { planetsSchema } = require('./database');

(async () => {
  for (let x = -size * dimensions; x <= size * dimensions; x += size) {
    for (let y = -size * dimensions; y <= size * dimensions; y += size) {
      for (let z = -size * dimensions; z <= size * dimensions; z += size) {
        const p = getRandomInt(100);
        if (p > 90) {
          console.log(x, y, z);
          const p = new planetsSchema({ options: {}, x, y, z, sector: 'A1' });
          await p.save();
        }
      }
    }
  }
})();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
