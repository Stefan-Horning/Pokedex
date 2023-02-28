let currentAsJson;
let pokedex = [];
let pokemonName = [];
let pokemonPicture = [];
let pokemonType = [];

async function init(){
    await first100Pokemon();
    document.getElementById('pokemon').src = pokedex[0]['sprites']['other']['official-artwork']['front_shiny'];
}

async function first100Pokemon(){
    let url = 'https://pokeapi.co/api/v2/pokemon/1';
    let response = await fetch(url);
    currentAsJson = await response.json();
    pokedex.push(currentAsJson);
}
