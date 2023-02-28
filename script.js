let currentAsJson;
let pokedex = [];

async function init(){
    await first100Pokemon();
}

async function first100Pokemon(){
    for(let i = 1; i < 100; i++){
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentAsJson = await response.json();
        pokedex.push(currentAsJson);
        renderPokemon(i -1)
    }
    await all898Pokemon();
}

async function all898Pokemon(){
    for(let i = 100; i<= 898; i++){
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentAsJson = await response.json();
        pokedex.push(currentAsJson);
        renderPokemon(i -1)
    }
}

function renderPokemon(i){
    let content = document.getElementById('allPokemon');
    content.innerHTML += /*html*/ `
        <div class="pokemon-overview-div">   
            <img src="${pokedex[i]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            <span>#${i + 1} ${pokedex[i]['name']}</span>
        </div>
        
    `;
}