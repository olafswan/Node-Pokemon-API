const express = require("express");
let pokemons = require("./mock-pokemon");
const { success } = require("./helper");

const app = express();
const port = 3000;

// 1er endpoint (point de terminaison)
app.get("/", (req, res) => res.send("POKEDEX API"));

// 2nd point de terminaison
app.get("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  //   res.send(`Vous avez demandé le pokémon ${pokemon.name}`);
  const pokemon = pokemons.find((pokemon) => pokemon.id === id);
  const message = "Un pokémon a bien été trouvé";
  res.json(success(message, pokemon));
});

// 3eme point de terminaison
app.get("/api/pokemons", (req, res) => {
  //   res.send(`Il y a ${pokemons.length} pokémons dans le pokédex, pour le moment`);
  const message = `La liste des ${pokemons.length} pokémons a bien été récupérée`;
  res.json(success(message, pokemons));
});

app.listen(port, () =>
  console.log(
    `Notre application Node est démarée sur : http://localhost:${port}`
  )
);
