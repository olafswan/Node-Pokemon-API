exports.success = (message, data) => {
  return { message, data };
};

// const success = (message, data) => {
//   return {
//     message: message,
//     data: data,
//   };
// };

// exports.success;

exports.getUniqueId = (pokemon) => {
  console.log("🚀 ~ pokemon:", pokemon);
  const pokemonsIds = pokemon.map((pokemon) => pokemon.id);
  console.log("🚀 ~ pokemonsIds:", pokemonsIds);
  const maxId = pokemonsIds.reduce((a, b) => Math.max(a, b));
  const uniqueId = maxId + 1;
  return uniqueId;
};
