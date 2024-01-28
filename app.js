// Function to fetch Pokemon information by name
async function fetchPokemonInfo(pokemonName) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const pokemonInfo = await response.json();
    return pokemonInfo;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to fetch a random Pokemon name
function getRandomPokemonName() {
  const randomPokemonId = Math.floor(Math.random() * 898) + 1; // There are 898 Pokemon
  return fetchPokemonInfo(randomPokemonId.toString());
}

// Variable to track the hide/unhide state
let isPokemonHidden = false;

// Function to show the Pokemon
function showPokemon(pokemonData) {
  const displayPokemon = document.querySelector("#pokemonContainer .displayPokemon");
  const pokemonNameElement = document.getElementById("pokeName");
  const pokemonTypeElement = document.getElementById("pokeType");

  displayPokemon.innerHTML = `<img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" width="200" height="200">`;
  pokemonNameElement.textContent = `Pokemon: ${pokemonData.name}`;

  // Display Pokemon types
  if (pokemonData.types && pokemonData.types.length > 0) {
    const types = pokemonData.types.map((type) => type.type.name).join(", ");
    pokemonTypeElement.textContent = `Pokemon Type: ${types}`;
  } else {
    pokemonTypeElement.textContent = "Unknown";
  }
}

// Function to hide or unhide the Pokemon
function togglePokemonVisibility() {
  const displayPokemon = document.querySelector("#pokemonContainer .displayPokemon");
  const pokemonNameElement = document.getElementById("pokeName");
  const pokemonTypeElement = document.getElementById("pokeType");

  if (isPokemonHidden) {
    // Unhide the Pokemon
    const pokemonData = sessionStorage.getItem("lastPokemonData");

    if (pokemonData) {
      showPokemon(JSON.parse(pokemonData));
    }
  } else {
    // Hide the Pokemon  // const pokeballImageUrl = "./assets/pokeball.png"; pokeball to hide the pokemon
    displayPokemon.innerHTML = " ";
    pokemonNameElement.textContent = " ";
    pokemonTypeElement.textContent = " ";
  }

  // Toggle the hide/unhide state
  isPokemonHidden = !isPokemonHidden;
}

// Function to search for a specific Pokemon
async function searchPokemon(pokemonName) {
  const displayPokemon = document.querySelector("#pokemonContainer .displayPokemon");
  const pokemonNameElement = document.getElementById("pokeName");
  const pokemonTypeElement = document.getElementById("pokeType");

  try {
    const pokemonData = await fetchPokemonInfo(pokemonName);

    if (pokemonData) {
      // Save the last Pokemon data to session storage
      sessionStorage.setItem("lastPokemonData", JSON.stringify(pokemonData));

      // Display the Pokemon
      showPokemon(pokemonData);
    } else {
      console.log("Pokemon not found.");
      // Optionally, you can handle the case when the Pokemon is not found.
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Get the button elements
  const showPokemonButton = document.getElementById("showPokemonBtn");
  const hidePokemonButton = document.getElementById("hidePokemonBtn");
  const searchForm = document.getElementById("searchForm");

  // Add event listeners to the buttons
  showPokemonButton.addEventListener("click", async function () {
    try {
      // Fetch a random Pokemon
      const pokemonData = await getRandomPokemonName();

      // Check if the data is not null
      if (pokemonData) {
        // Save the last Pokemon data to session storage
        sessionStorage.setItem("lastPokemonData", JSON.stringify(pokemonData));

        // Show the Pokemon
        showPokemon(pokemonData);
      } else {
        console.log("Unable to fetch Pokemon information.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  hidePokemonButton.addEventListener("click", function () {
    // Hide or unhide the Pokemon
    togglePokemonVisibility();
  });

  // Add event listener to the form
  searchForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const searchBar = document.getElementById("searchBar");
    const pokemonName = searchBar.value.trim().toLowerCase();

    if (pokemonName) {
      // Search for the entered Pokemon name
      await searchPokemon(pokemonName);

      searchBar.value = "";
    } else {
      console.log("Please enter a Pokemon name.");
      // Optionally, you can handle the case when the search input is empty.
    }
  });
});
