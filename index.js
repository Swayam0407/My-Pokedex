const express = require("express");
const axios = require('axios');
const app = express();


app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/public/index.html");
})

app.get("/get-pokemon", async function (req, res) {
  const pokemonPromises = [];
  const number = parseInt(req.query.number);
  const category = req.query.category;

try{

  for (let i = 1; i <= 200; i++) {
    pokemonPromises.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`));
  }

  const pokemonFetched = await Promise.all(pokemonPromises);

const pokemons = pokemonFetched
  .filter((response) =>
    response.data.types.some((type) => type.type.name === category)
  )
  .slice(0, number)
  .map((response) => ({
    name: response.data.name,
    id: response.data.id,
    image: response.data.sprites.front_default,
    types: response.data.types.map((typeInfo) => typeInfo.type.name),
  }));

  res.send(pokemons);
}
catch(error){
    res.status(404).send('Error Fetching Data');
}

});

app.listen(3000,function(req,res){
    console.log('Server running on port 3000...');
})