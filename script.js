let currentAsJson;
let pokedex = [];
let effects;
let isLoading;
let PokedexSearch = [];
let SearchCurrentAsJson;
let AllNamePokemon = [];

async function init() {
    await firstPokemon();
    await loadAllPokemonName();
}

async function loadAllPokemonName() {
    let textfield = document.getElementById("search");
    textfield.disabled = true;
    for (let i = 1; i <= 1010; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        SearchCurrentAsJson = await response.json();
        PokedexSearch.push(SearchCurrentAsJson);
        pushName(i - 1);
    }
    textfield.disabled = false;
}

function pushName(i) {
    let name = PokedexSearch[i]['name'];
    AllNamePokemon.push(name);
}

async function firstPokemon() {
    let firstAmount = 1;
    let lastAmount = 100;
    for (let i = firstAmount; i < lastAmount; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentAsJson = await response.json();
        pokedex.push(currentAsJson);
        await renderPokemon(i - 1);
    }
    hovereffect(firstAmount, lastAmount);
}

function hovereffect(firstAmount, lastAmount) {
    for (let i = firstAmount; i < lastAmount - 1; i++) {
        document.getElementById(`pokemon${i}`).classList.add('hover-effect');
    }
}

async function load20Pokemons() {
    let firstAmount = pokedex.length + 1;
    let lastAmount = pokedex.length + 51;
    for (let i = firstAmount; i < lastAmount; i++) {
        if (pokedex.length == 1010) {
            console.log('all')
        } else {
            let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
            let response = await fetch(url);
            currentAsJson = await response.json();
            pokedex.push(currentAsJson);
            await renderPokemon(i - 1);
        }
    }
    hovereffect(firstAmount, lastAmount);
}

function renderPokemon(i) {
    let content = document.getElementById('allPokemon');
    content.innerHTML += /*html*/ `
        <div class="pokemon-overview-div">   
            <img onclick="pokemonView(${i})" id="pokemon${i}"  class="pokemon-overview-div-img hidden" src="${pokedex[i]['sprites']['other']['official-artwork']['front_shiny']}" alt="">
            <span>#${i + 1} ${pokedex[i]['name']}</span>
        </div>
        
    `;
    getEffect()
}

function pokemonView(i) {
    let div = document.getElementById('pokemon-view-div');
    let img = document.getElementById('pokemonImg');
    div.classList.remove('d-none');
    img.src = `${pokedex[i]['sprites']['other']['official-artwork']['front_shiny']}`;
    document.getElementById('details').innerHTML = pokemonViewHTML(i);
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

function renderPokemonByName(i) {
    let content = document.getElementById('allPokemon');
    let img = PokedexSearch[i]['sprites']['other']['official-artwork']['front_shiny'];
    content.innerHTML += /*html*/ `
        <div class="pokemon-overview-div">   
            <img onclick="pokemonView(${i})" id="pokemon${i + 1}"  class="pokemon-overview-div-img" src="${img}" alt="">
            <span>#${i + 1} ${PokedexSearch[i]['name']}</span>
        </div>
        
    `;
}

async function onTheBottom() {
    let obj = document.getElementById('allPokemon');
    if (obj.scrollTop === (obj.scrollHeight - obj.offsetHeight) && !isLoading) {
        isLoading = true;
        await load20Pokemons()
        isLoading = false
    };
}

function filterPokemon() {
    setTimeout(() => {
        let search = document.getElementById('search').value;
        let content = document.getElementById('allPokemon');
        if (search !== '') {
            search = search.toLowerCase();
            content.innerHTML = '';
            for (let i = 1; i < AllNamePokemon.length; i++) {
                let Pokemon = AllNamePokemon[i];
                if (Pokemon.toLowerCase().includes(search)) {
                    renderPokemonByName(i);
                }
            }
        }else{
            content.innerHTML = '';
            currentAsJson = '';
            pokedex = [];
            firstPokemon();
        }
    }, 1);
}