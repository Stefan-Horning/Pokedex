let currentAsJson;
let pokedex = [];

async function init(){
    await first100Pokemon();
    //await all898Pokemon();
}

async function first100Pokemon(){
    for(let i = 1; i < 100; i++){
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentAsJson = await response.json();
        pokedex.push(currentAsJson);
        await renderPokemon(i -1);
    }
    for(let i = 1; i < 100; i++){
        document.getElementById(`pokemon${i+1}`).classList.add('pokemon-overview-div-img');
    }
    
}

/*async function all898Pokemon(){
    for(let i = 100; i<= 898; i++){
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentAsJson = await response.json();
        pokedex.push(currentAsJson);
        renderPokemon(i -1)
    }
}*/

function renderPokemon(i){
    let content = document.getElementById('allPokemon');
    content.innerHTML += /*html*/ `
        <div class="pokemon-overview-div">   
            <img onclick="pokemonView(${i})" id="pokemon${i+1}" class="pokemon-overview-div-img" src="${pokedex[i]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            <span>#${i + 1} ${pokedex[i]['name']}</span>
        </div>
        
    `;
}

function pokemonView(i){
    let div = document.getElementById('pokemon-view-div');
    let img = document.getElementById('pokemonImg');
    div.classList.remove('d-none');
    img.src = `${pokedex[i]['sprites']['other']['official-artwork']['front_shiny']}`;
    document.getElementById('details').innerHTML = `
    
    `;
}

function doNotClose(event){
    event.stopPropagation();
}

function closePopup(){
    document.getElementById('pokemon-view-div').classList.add('d-none')
}


