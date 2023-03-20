let currentAsJson;
let pokedex = [];
let effects;
let isLoading;
let all_pokemon = [];
let results;
let PokedexSearch = [];
let currentAsJsonSearch;
let idForSearch = [];

async function init() {
    await firstPokemon();
    await loadSearch();
}

//-----------------------------------------------------//
//-------------------- API include --------------------//
//-----------------------------------------------------//

async function loadSearch(){
    let url = 'https://pokeapi.co/api/v2/pokemon/?offset=20&limit=1010';
    let response = await fetch(url);
    results = await response.json();
    all_pokemon = (await (await fetch(url)).json()).results;
}

function loadPokemonSearch() {
    let url = 'https://pokeapi.co/api/v2/pokemon/?offset=20&limit=2000';
    load();
    async function load(){
        all_pokemon = (await (await fetch(url)).json()).results;
    }  
}

async function loadPokemonSearchDetails(){
    let content = document.getElementById('allPokemon');
    content.innerHTML = '';
    let input = document.getElementById('search').value;
    if(results != ''){
        for(i = 0; i < results.length; i++){
            if(input != ''){
                let url = results[i]['url'];
                let response = await fetch(url)
                currentAsJsonSearch = await response.json();
                PokedexSearch.push(currentAsJsonSearch);
                let id = await PokedexSearch[i]['id'];
                await renderPokemon(i,PokedexSearch, id);
                idForSearch.push(id);
            }
         }
    }
}

async function firstPokemon() {
    let firstAmount = 1;
    let lastAmount = 100;
    for (let i = firstAmount; i < lastAmount; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentAsJson = await response.json();
        pokedex.push(currentAsJson);
        let id = pokedex[i - 1]['id'];
        await renderPokemon(i - 1, pokedex, id);
    }
    hovereffect(firstAmount, lastAmount);
}

async function load20Pokemons() {
    let firstAmount = pokedex.length + 1;
    let lastAmount = pokedex.length + 21;
    for (let i = firstAmount; i < lastAmount; i++) {
        if (pokedex.length == 1010) {
            console.log('all')
        } else {
            let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
            let response = await fetch(url);
            currentAsJson = await response.json();
            pokedex.push(currentAsJson);
            let id = pokedex[i - 1]['id'];
            await renderPokemon(i - 1, pokedex, id);
        }
    }
    hovereffect(firstAmount, lastAmount);
}

//-----------------------------------------------------//
//-------------------- render Pokemon -----------------//
//-----------------------------------------------------//

function renderPokemon(i,Array,id) {
    let content = document.getElementById('allPokemon');
    content.innerHTML += /*html*/ `
        <div class="pokemon-overview-div">   
            <img onclick="pokemonView(${id - 1})" id="pokemon${id}"  class="pokemon-overview-div-img hidden" src="${Array[i]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            <span>#${id} ${Array[i]['name']}</span>
        </div>
        
    `;
    getEffect()
}

function pokemonView(i) {
    let div = document.getElementById('pokemon-view-div');
    loadImgHTML(i);
    div.classList.remove('d-none');
    document.getElementById('details').innerHTML = pokemonViewHTML(i);
}

//-----------------------------------------------------//
//--------------- Effects and Monitoring  -------------//
//-----------------------------------------------------//

async function onTheBottom() {
    let obj = document.getElementById('allPokemon');
    if (obj.scrollTop === (obj.scrollHeight - obj.offsetHeight) && !isLoading) {
        isLoading = true;
        await load20Pokemons()
        isLoading = false;
    };
}

function hovereffect(firstAmount, lastAmount) {
    for (let i = firstAmount; i < lastAmount - 1; i++) {
        document.getElementById(`pokemon${i}`).classList.add('hover-effect');
    }
}
function hovereffectForSearch(){
    
    for(let i = 0; i < idForSearch.length; i++){
        let id = idForSearch[i];
        document.getElementById(`pokemon${id}`).classList.add('hover-effect');
    }
}

function doNotClose(event) {
    event.stopPropagation();
}

function closePopup() {
    document.getElementById('pokemon-view-div').classList.add('d-none')
}

function getEffect() {
    effects = document.querySelectorAll(".pokemon-overview-div-img");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle("show", entry.isIntersecting)

        })
    }, {
        threshold: 0.5,
    })

    effects.forEach(effect => {
        observer.observe(effect);

    })
}

function checkInputField(){
    let input = document.getElementById('search');
    if(!isSearching){
        input.disabled = false;
    }else{
        input.disabled = true;
    }
}

//-----------------------------------------------------//
//------------------- Search Function -----------------//
//-----------------------------------------------------//
let isSearching = false;
async function find() {
    if(!isSearching){
        isSearching = true;
        checkInputField()
        if(results != ''){
            let input = document.getElementById('search').value;
            results;
            PokedexSearch = [];
        if(input != ''){
            results = all_pokemon.filter(pokemon => pokemon.name.toLowerCase().includes(input.toLowerCase()));
            await loadPokemonSearchDetails();
            await hovereffectForSearch();
            idForSearch = [];
        }else{
            let content = document.getElementById('allPokemon');
            content.innerHTML = '';
            await firstPokemon();
        }
        }
        isSearching = false;
        checkInputField();
    }    
}

//-----------------------------------------------------//
//----------------------- HTML ------------------------//
//-----------------------------------------------------//

function loadImgHTML(i){
    let img = document.getElementById('pokemonImg');
    let lastPokemon = document.getElementById('lastPokemon');
    let nextPokemon = document.getElementById('nextPokemon');
    if(i == 0){
        lastPokemon.classList.add('d-none');
        img.src = `${pokedex[i]['sprites']['other']['official-artwork']['front_shiny']}`;
        nextPokemon.src = `${pokedex[i + 1]['sprites']['other']['official-artwork']['front_shiny']}`;
    }else{
        if(i == pokedex.length){
            nextPokemon.classList.add('d-none');
            lastPokemon.src = `${pokedex[i - 1]['sprites']['other']['official-artwork']['front_shiny']}`;
            img.src = `${pokedex[i]['sprites']['other']['official-artwork']['front_shiny']}`;
        }else{
            lastPokemon.src = `${pokedex[i - 1]['sprites']['other']['official-artwork']['front_shiny']}`;
            img.src = `${pokedex[i]['sprites']['other']['official-artwork']['front_shiny']}`;
            nextPokemon.src = `${pokedex[i + 1]['sprites']['other']['official-artwork']['front_shiny']}`;
        } 
    }
}

function pokemonViewHTML(i) {
    return /*html*/ `
    <div>
        <span>Name:</span>
        <span>${pokedex[i]['name']}</span>
    </div>
    <div>
        <span>Type:</span>
        <span>${pokedex[i]['types'][0]['type']['name']}</span>
    </div>
    <div>
        <span>height:</span>
        <span>${pokedex[i]['height'] / 10} M</span>
    </div>
    <div>
        <span>weight</span>
        <span>${pokedex[i]['weight'] / 10} Kg</span>
    </div>
    <div>
        <span>Hp:</span>
        <span>${pokedex[i]['stats'][0]['base_stat']} Hp</span>
    </div>
    <div>
        <span>attack:</span>
        <span>${pokedex[i]['stats'][1]['base_stat']} At</span>
    </div>
    <div>
        <span>defense:</span>
        <span>${pokedex[i]['stats'][2]['base_stat']} De</span>
    </div>

`;
}