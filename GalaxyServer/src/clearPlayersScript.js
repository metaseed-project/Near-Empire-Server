const { playersSchema } = require('./database');

(async ()=>{
  const players = await playersSchema.find();
  for(const player of players){
    console.log(player);
    player.minted = [];
    delete player.data.minted;
    await player.save();
  }
})();