let currentAsJson;
let pokedex = [];
let effects;
let isLoading;
let all_pokemon = [];
let results;
let PokedexSearch = [];
let currentAsJsonSearch;
let idForSearch = [];
let SearchingForEffect = false;
let isSearching = false;
let isLoadingForMorePokemons = false;

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
    isSearching = false;
    checkInputField()
}

function loadPokemonSearch() {
    let url = 'https://pokeapi.co/api/v2/pokemon/?offset=20&limit=2000';
    load();
    async function load(){
        all_pokemon = (await (await fetch(url)).json()).results;
    }  
}

async function loadPokemonSearchDetails(){
    isLoadingForMorePokemons = true;
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
    isLoadingForMorePokemons = true;
}

async function firstPokemon() {
    isSearching = true;
    checkInputField();
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
    if(!SearchingForEffect){
        if(!isLoadingForMorePokemons){
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
        
    }
}

//-----------------------------------------------------//
//-------------------- render Pokemon -----------------//
//-----------------------------------------------------//

function renderPokemon(i,Array,id) {
    let content = document.getElementById('allPokemon');
    if(Array != PokedexSearch){
        content.innerHTML += /*html*/ `
        <div class="pokemon-overview-div">   
            <img onclick="pokemonView(${id - 1}, 'pokedex')" id="pokemon${id}"  class="pokemon-overview-div-img hidden" src="${Array[i]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            <span>#${id} ${Array[i]['name']}</span>
        </div>
    `;
    }else{
        content.innerHTML += /*html*/ `
        <div class="pokemon-overview-div">   
            <img onclick="pokemonView(${i}, 'PokedexSearch')" id="pokemon${id}"  class="pokemon-overview-div-img hidden" src="${Array[i]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            <span>#${id} ${Array[i]['name']}</span>
        </div>
    `;
    }
    getEffect()
    
}

function pokemonView(i, Array) {
    let div = document.getElementById('pokemon-view-div');
    let divImg = document.getElementById('PokemoonImgView');
    divImg.innerHTML = '';
    divImg.innerHTML = loadImgHTML(i,Array);
    div.classList.remove('d-none');
    document.getElementById('details').innerHTML = pokemonViewHTML(i, Array);
}

//-----------------------------------------------------//
//--------------- Effects and Monitoring  -------------//
//-----------------------------------------------------//

async function onTheBottom() {
    let obj = document.getElementById('allPokemon');
    if (obj.scrollTop === (obj.scrollHeight - obj.offsetHeight) && !isLoading && !isLoadingForMorePokemons) {
        isLoading = true;
        await load20Pokemons()
        isLoading = false;
    };
}

function hovereffect(firstAmount, lastAmount) {
    for (let i = firstAmount; i < lastAmount; i++) {
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

function setTrueForSearching(){
    SearchingForEffect = true
    isSearching = true;
    isLoadingForMorePokemons = true;
}

function clearForFind(){
    let content = document.getElementById('allPokemon');
    content.innerHTML = '';
    pokedex = [];
    PokedexSearch = [];
    currentAsJsonSearch;
    idForSearch = [];
}

async function find() {
    if (!isSearching) {
        setTrueForSearching();
        checkInputField();
        if (results != '') {
            let input = document.getElementById('search').value;
            results;
            PokedexSearch = [];
            if (input != '') {
                results = all_pokemon.filter(pokemon => pokemon.name.toLowerCase().includes(input.toLowerCase()));
                document.getElementById('allPokemon').innerHTML = '';
                await loadPokemonSearchDetails();
                await hovereffectForSearch();
                idForSearch = [];
                if(PokedexSearch.length == 0){
                    let input = document.getElementById('search');
                    input.value = '';
                    alert('The Pokemon does not exist.');
                    SearchingForEffect = false;
                    clearForFind();
                    await init();
                    isLoadingForMorePokemons = false;
                }
            } else {
                SearchingForEffect = false;
                isLoadingForMorePokemons = false;
                clearForFind();
                await init();
            }
        }
        isSearching = false;
        checkInputField();
    }
}

//-----------------------------------------------------//
//----------------------- HTML ------------------------//
//-----------------------------------------------------//

function loadIMGbyPokedexHTML(i){
    if(i == 0){
        return /*html*/ `
        <div class="pokemon-View-main">
            <img  id="pokemonImg" src="${pokedex[i]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
        </div>
        <div class="pokemon-View-next">
        <img onclick="pokemonView(${i + 1}, 'pokedex')" id="nextPokemon" src="${pokedex[i + 1]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
        </div>
         `
    }else{
        if(i == pokedex.length - 1){
            return /*html*/ `
                <div class="pokemon-View-last">
                    <img onclick="pokemonView(${i - 1}, 'pokedex')"  id="lastPokemon" src="${pokedex[i - 1]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
                </div>
                <div class="pokemon-View-main">
                    <img  id="pokemonImg" src="${pokedex[i]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
                </div>
            `
        }else{
            return /*html*/ `
            <div class="pokemon-View-last">
                <img onclick="pokemonView(${i - 1}, 'pokedex')"  id="lastPokemon" src="${pokedex[i - 1]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            </div>
            <div class="pokemon-View-main">
                <img onclick="pokemonView(${i}, 'pokedex')"  id="pokemonImg" src="${pokedex[i]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            </div>
            <div class="pokemon-View-next">
                <img onclick="pokemonView(${i + 1}, 'pokedex')"  id="nextPokemon" src="${pokedex[i + 1]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            </div>
            `
        } 
    }
}

function loadIMGbyPokedexSearchHTML(i){
    if(PokedexSearch.length == 1){
        return /*html*/`
        <div class="pokemon-View-main">
            <img id="pokemonImg" src="${PokedexSearch[i]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
        </div>
        ` ; 
    }
    if(i == 0){
        return /*html*/ `
            <div class="pokemon-View-main">
                <img  id="pokemonImg" src="${PokedexSearch[i]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            </div>
            <div class="pokemon-View-next">
                <img onclick="pokemonView(${i + 1}, 'PokedexSearch')"  id="nextPokemon" src="${PokedexSearch[i + 1]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            </div>
            `
    }else{    
        if(i == PokedexSearch.length - 1){
            return /*html*/ `
                <div class="pokemon-View-last">
                    <img onclick="pokemonView(${i - 1}, 'PokedexSearch')"  id="lastPokemon" src="${PokedexSearch[i - 1]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
                </div>
                <div class="pokemon-View-main">
                    <img  id="pokemonImg" src="${PokedexSearch[i]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
                </div>
            `
        }else{
            return /*html*/ `
            <div class="pokemon-View-last">
                <img onclick="pokemonView(${i - 1}, 'PokedexSearch')"  id="lastPokemon" src="${PokedexSearch[i - 1]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            </div>
            <div class="pokemon-View-main">
                <img  id="pokemonImg" src="${PokedexSearch[i]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            </div>
            <div class="pokemon-View-next">
                <img onclick="pokemonView(${i + 1}, 'PokedexSearch')"  id="nextPokemon" src="${PokedexSearch[i + 1]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            </div>
            `
        } 
    }
}

function loadImgHTML(i, Array){
    if(Array != 'PokedexSearch'){
        return loadIMGbyPokedexHTML(i);
    }else{
        return loadIMGbyPokedexSearchHTML(i);
    } 
}

function pokemonViewHTML(i, Array) {
    if(Array == 'pokedex'){
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
    }else{
        return /*html*/ `
    <div>
        <span>Name:</span>
        <span>${PokedexSearch[i]['name']}</span>
    </div>
    <div>
        <span>Type:</span>
        <span>${PokedexSearch[i]['types'][0]['type']['name']}</span>
    </div>
    <div>
        <span>height:</span>
        <span>${PokedexSearch[i]['height'] / 10} M</span>
    </div>
    <div>
        <span>weight</span>
        <span>${PokedexSearch[i]['weight'] / 10} Kg</span>
    </div>
    <div>
        <span>Hp:</span>
        <span>${PokedexSearch[i]['stats'][0]['base_stat']} Hp</span>
    </div>
    <div>
        <span>attack:</span>
        <span>${PokedexSearch[i]['stats'][1]['base_stat']} At</span>
    </div>
    <div>
        <span>defense:</span>
        <span>${PokedexSearch[i]['stats'][2]['base_stat']} De</span>
    </div>
`;
    } 
}