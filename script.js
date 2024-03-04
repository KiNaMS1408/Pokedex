let offset = 1;
let limit = offset + 41;
let allFetchedPokemon = [];
let currentPokemonList = [allFetchedPokemon];
let url;
let myChart;

const typeColors = {
    normal: "#B0B0B0",
    fire: "#F08030",
    water: "#6EBEFF",
    electric: "#FFDE4A",
    grass: "#8CD750",
    ice: "#9DDFFF",
    fighting: "#D04A4A",
    poison: "#B760CB",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#FF77A8",
    bug: "#B8CC29",
    rock: "#C8B060",
    ghost: "#7A6EA6",
    steel: "#C0C0D0",
    dragon: "#7040F0",
    dark: "#705848",
    fairy: "#F0B6C1",
};

// Main function:
async function loadPokemon() {
    for (let i = offset; i < limit; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        pokemonDataAsJSON = await response.json();
        allFetchedPokemon.push(pokemonDataAsJSON);
        createNewCard(pokemonDataAsJSON);
    }
    await searchButton();
}

async function loadMorePokemon() {
    offset = limit
    limit += 20;
    await loadPokemon();
    window.scrollTo(0, document.body.scrollHeight);
}

//card management:
function createCardElement(pokemonDetails) {
    const newCard = document.createElement('div');
    newCard.className = 'card';
    newCard.id = pokemonDetails.id;
    newCard.innerHTML += `
    <h2 id="pokemonId_${newCard.id}" class="pokemonId he">${pokemonDetails.id}</h2>
    <h1 id="pokemonName_${newCard.id}" >${pokemonDetails.name}</h1>
    <img class="PokemonImage" id="pokemonImage_${newCard.id}" alt="">
    <div id="pokemonTypes_${newCard.id}" class="pokemonTypes"></div>
    <img id="pokemonImageSlide_${newCard.id}" class="front-image" alt="">
    `;
    return newCard;
}

function createNewCard(pokemonDetails) {
    const newCard = createCardElement(pokemonDetails);
    addCardClickEvent(newCard, pokemonDetails);
    appendCardToPokedex(newCard);
    console.log('Created new card:', newCard.id, pokemonDetails);
    renderPokemonInfo(pokemonDetails, newCard);
}

function appendCardToPokedex(cardElement) {
    const pokedex = document.getElementById('pokedex');
    pokedex.appendChild(cardElement);
}

function renderPokemonInfo(pokemonDetails, card) {
    const { pName, pId, pImage, pImageSlide, pTypes } = findDOMElements(card);

    if (!checkDOMElements({ pName, pId, pImage, pImageSlide, pTypes })) {
        return;
    }
    setInnerHTMLValues(pName, pId, pImage, pImageSlide, pTypes, pokemonDetails);
    renderPokemonTypes(pokemonDetails['types'], card);
}

function addCardClickEvent(cardElement, pokemonDetails) {
    cardElement.onclick = function () {
        cardClick(pokemonDetails);
    };
}

function findDOMElements(card) {
    return {
        pName: card.querySelector(`#pokemonName_${card.id}`),
        pId: card.querySelector(`#pokemonId_${card.id}`),
        pImage: card.querySelector(`#pokemonImage_${card.id}`),
        pImageSlide: card.querySelector(`#pokemonImageSlide_${card.id}`),
        pTypes: card.querySelector(`#pokemonTypes_${card.id}`),
    };
}

function checkDOMElements(e) {
    for (const key in e) {
        if (!e[key]) {
            console.error(`DOM element ${key} not found.`);
            return false;
        }
    }
    return true;
}

function setInnerHTMLValues(pName, pId, pImage, pImageSlide, pTypes, pokemonDetails) {
    pName.innerHTML = pokemonDetails['name'];
    pId.innerHTML = pokemonDetails['id'];
    pImage.src = pokemonDetails['sprites']['other']['dream_world']['front_default'];
    pImageSlide.src = pokemonDetails['sprites']['other']['official-artwork']['front_default'];
}

function renderPokemonTypes(pokemonTypes, card) {
    let typesHTML = createTypesHTML(pokemonTypes);
    let primaryType = extractPrimaryType(pokemonTypes);
    updatePokemonTypesContainer(card, typesHTML);
    setCardBackgroundColor(card, primaryType);
}

function createTypesHTML(pokemonTypes) {
    let typesHTML = '';
    for (let i = 0; i < pokemonTypes.length; i++) {
        const type = pokemonTypes[i]['type']['name'];
        typesHTML += `<img src="IMG/${type}.png" alt="${type}">`;
    }
    return typesHTML;
}

function extractPrimaryType(pokemonTypes) {
    if (pokemonTypes.length > 0) {
        return pokemonTypes[0]['type']['name'];
    }
    return null;
}

function updatePokemonTypesContainer(card, typesHTML) {
    let pokemonTypesC = card.querySelector(`#pokemonTypes_${card.id}`);
    pokemonTypesC.innerHTML = typesHTML;
}

function setCardBackgroundColor(card, primaryType) {
    if (primaryType) {
        card.style.backgroundColor = typeColors[primaryType];
    }
}

function updateBigCardBackgroundColor(type) {
    const bigCard = document.getElementById('bigCard');
    bigCard.style.backgroundColor = typeColors[type];
}

function cardClick(pokemonDetails) {
    const { id, name, sprites, height, weight, base_experience, moves, types, pokemonTypes } = pokemonDetails;
    currentIndex = allFetchedPokemon.findIndex(pokemonObject => pokemonObject.id === id);
    console.log('Card clicked:', id, name);
    showCard();
    updatePokemonInfo(id, name, sprites, height, weight, base_experience, moves, types);
    rada(pokemonDetails);
    renderMoves(moves);

}

function updatePokemonInfo(id, name, sprites, height, weight, base_experience, moves, types) {
    document.getElementById('pokemonId').innerText = id;
    document.getElementById('pokemonName').innerText = name;
    document.getElementById('pokemonImage').src = sprites.other['official-artwork']['front_default'];
    document.getElementById('height').innerText = height;
    document.getElementById('weight').innerText = weight;
    document.getElementById('xp').innerText = base_experience;
    document.getElementById('littleImg').src = sprites.other['showdown']['front_default'];

    // backgroundcolor for bigCard
    if (types && types.length > 0) {
        const primaryType = types[0]['type']['name'];
        updateBigCardBackgroundColor(primaryType);
        displayPokemonTypes(types);
    }

}

function displayPokemonTypes(types) {
    const typesContainer = document.getElementById('pokemonTypes');
    if (typesContainer && types && types.length > 0) {
        typesContainer.innerHTML = '';
        types.forEach(type => {
            const typeName = type.type.name;
            const img = document.createElement('img');
            img.src = `IMG/${typeName}.png`;
            img.alt = typeName;
            typesContainer.appendChild(img);
        });
    }
}

function renderMoves(moves) {
    document.getElementById('scrolling-container').innerHTML = '';
    for (let i = 0; i < moves.length; i++) {
        document.getElementById('scrolling-container').innerHTML += (i + 1) + '.' + moves[i]['move']['name'] + '<br>';
    }
}

function getPreviousPokemon() {
    if (currentIndex === 0) {
        currentIndex = allFetchedPokemon.length - 1;
    } else {
        currentIndex -= 1;
    }
    const previousPokemon = allFetchedPokemon[currentIndex];
    cardClick(previousPokemon);
}

function getNextPokemon() {
    if (currentIndex === allFetchedPokemon.length - 1) {
        loadMorePokemon();
    } else {
        currentIndex += 1;
        const nextPokemon = allFetchedPokemon[currentIndex];
        cardClick(nextPokemon);
    }
}

function showCard() {
    document.getElementById('showCard').classList.remove('d-none');
    document.getElementById('flags').classList.add('d-none');
    document.getElementById('body').classList.add('stop-scrolling');
}

function closeCard() {
    document.getElementById('showCard').classList.add('d-none');
    document.getElementById('flags').classList.remove('d-none');
    document.getElementById('body').classList.remove('stop-scrolling');
}

// search function
async function searchButton() {
    let input = document.getElementById('search');
    let button = document.getElementById('button');
    button.disabled = true;

    input.addEventListener("input", () => {
        filterPokemon();
    });
}

async function filterPokemon() {
    document.getElementById('pokedex').innerHTML = '';
    let search = document.getElementById('search').value.trim().toLowerCase();
    if (search.length >= 3) {
       for (let i = 0; i < allFetchedPokemon.length; i++) {
           let name = allFetchedPokemon[i]['name'].toLowerCase();
           let type1 = allFetchedPokemon[i]['types'][0]['type']['name'].toLowerCase();
           let type2 = allFetchedPokemon[i]['types'].length > 1 ? allFetchedPokemon[i]['types'][1]['type']['name'].toLowerCase() : '';
           
           if (name.includes(search) || type1.includes(search) || type2.includes(search)) {
               createNewCard(allFetchedPokemon[i]);
            }
        }
    } else {
        allFetchedPokemon.forEach(pokemon => createNewCard(pokemon));
    }
}


// help functionen
function setPokemonName(languageIndex) {
    const languageIndexMap = {
        german: 1,
        english: 2,
        japan: 3,
        chinese: 5
    };

    for (let i = 1; i < limit; i++) {
        const name = pokemon_data[i - 1][languageIndexMap[languageIndex]];
        console.log(name);
        const element = document.getElementById(`pokemonName_${i}`);
        if (element) {
            element.innerText = name;
        } else {
            console.error(`Element with ID pokemonName_${i} not found.`);
        }
    }
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}