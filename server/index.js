const express = require("express");
const axios = require('axios');
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = {
  origin: "https://my-pokedex-kkthy3xtf-swayam0407s-projects.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

app.get("/", function(req,res){
  res.send("Running!");
})

app.get("/api/get-pokemon", async function (req, res) {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

