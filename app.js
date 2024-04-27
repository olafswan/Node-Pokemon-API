const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const { success, getUniqueId } = require("./helper");
const { Sequelize, DataTypes } = require("sequelize");
let pokemons = require("./mock-pokemon");
const PokemonModel = require("./src/models/pokemons");

const app = express();
const port = 3000;

const sequelize = new Sequelize("pokedex", "root", "", {
  hots: "localhost",
  dialect: "mariadb",
  dialectOptions: {
    timezone: "Etc/GMT-2",
  },
  logging: false,
});

sequelize
  .authenticate()
  .then((_) =>
    console.log("La connexion à la base de données a bien été établie")
  )
  .catch((error) =>
    console.error(`Impossible de se connecter à la base de données ${error}`)
  );

const Pokemon = PokemonModel(sequelize, DataTypes);

sequelize.sync({ force: true }).then((_) => {
  console.log("La base de données 'Pokedex' a bien été synchronisée.");

  pokemons.map((pokemon) => {
    Pokemon.create({
      name: pokemon.name,
      hp: pokemon.hp,
      cp: pokemon.cp,
      picture: pokemon.picture,
      types: pokemon.types.join(),
    }).then((pokemon) => console.log(pokemon.toJSON()));
  });
});

// 1er middleware "logger"
// const logger = (req, res, next) => {
//   console.log(`URL : ${req.url}`);
//   next();
// };
// app.use(logger);
// 1er middleware "logger" version raccourcie
// app.use((req, res, next) => {
//   console.log(`URL : ${req.url}`);
//   next();
// });
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

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

app.post("/api/pokemons", (req, res) => {
  const id = getUniqueId(pokemons);
  const pokemonCreated = { ...req.body, ...{ id: id, created: new Date() } };
  pokemons.push(pokemonCreated);
  const message = `Le pokemon ${pokemonCreated.name} a bien été crée.`;
  res.json(success(message, pokemonCreated));
});

app.put("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonUpdated = { ...req.body, id: id };
  pokemons = pokemons.map((pokemon) => {
    return pokemon.id === id ? pokemonUpdated : pokemon;
  });
  const message = `Le pokemon ${pokemonUpdated.name} a bien été modifié.`;
  res.json(success(message, pokemonUpdated));
});

app.delete("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonDeleted = pokemons.find((pokemon) => pokemon.id === id);
  pokemons = pokemons.filter((pokemon) => pokemon.id !== id);
  const message = `Le pokemon ${pokemonDeleted.name} a bien été supprimé.`;
  res.json(success(message, pokemonDeleted));
});

app.listen(port, () =>
  console.log(
    `Notre application Node est démarée sur : http://localhost:${port}`
  )
);
