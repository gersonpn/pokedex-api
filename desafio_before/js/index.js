async function buscarPokemon(type) {
  let result = null;
  await fetch(`https://pokeapi.co/api/v2/type/${type}`)
    .then((response) => (result = response.json()))

  return result;
}

async function buscarPokemon(id) {
  let result = null;
  await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    .then((response) => (result = response.json()))

  return result;
}

async function buscarPokemons(pagina) {
  let result = null;
  let limit = 18;
  let offset = (pagina - 1) * limit;
  await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
  .then((response) => (result = response.json()))
  return result;
}

async function buscarTipos() {
  let tipos = null;
  await fetch(`https://pokeapi.co/api/v2/type`).then(
    (response) => (result = response.json())
  );
  return result;
}

async function buscarPokemonPorTipo(tipo) {
  let pokemonsPorTipo = null;
  await fetch(`https://pokeapi.co/api/v2/type/${tipo}`).then(
    (response) => (pokemonsPorTipo = response.json()))
  return pokemonsPorTipo;
}

function popularSelectTiposPokemons(pokemons) {
  let selectTipos = document.getElementById("tipos");
  pokemons.forEach((element) => {
    let option = document.createElement("option");
    option.value = element.name;
    option.innerHTML = element.name;
    selectTipos.appendChild(option);
  });
}

function popularPoke(pokemons) {
  let lista = document.getElementById("listapokemons");
  lista.innerHTML = "";
  pokemons.forEach((element) => {
    buscarPokemon(element.name).then(function (idname) {
      let paragrafo = document.createElement("p");
      paragrafo.innerHTML = idname.id + "-" + element.name;
      let img = document.createElement("img");
      if (idname.sprites.other.dream_world.front_default == null) {
        img.src = "/img/logopoke.png";

      }else{
        img.src = idname.sprites.other.dream_world.front_default;
      }
      let tipo = document.createElement("p");
      tipo.innerHTML = idname.types[0].type.name + "-" + idname.types[1]?.type.name;
      if (idname.types[1] == undefined) {
        tipo.innerHTML = idname.types[0].type.name;
      }
      let divpokemon = document.createElement("div");
      divpokemon.classList.add("card");
      divpokemon.id = element.name;
      divpokemon.classList.add("col-3");
      divpokemon.classList.add(idname.types[0].type.name);
      let cardpokemon = document.createElement("div");
      cardpokemon.classList.add("card-body");
      cardpokemon.appendChild(paragrafo);
      divpokemon.appendChild(cardpokemon);
      divpokemon.appendChild(img);
      divpokemon.appendChild(tipo);
      lista.appendChild(divpokemon);

      divpokemon.addEventListener("click", function(event) {
        buscarPokemon([element.name]).then(
          function (response) {
            let infoModel = document.querySelector("#myModal .modal-body")
            infoModel.innerHTML = "";
            let imgpoke = document.createElement("img");
            imgpoke.src = response.sprites.other.dream_world.front_default;
            if (response.sprites.other.dream_world.front_default == null) {
              imgpoke.src = "/img/logopoke.png";
            }
            let nomePoke = document.createElement("p");
            nomePoke.innerHTML = response.id + "-" + response.name;
            let tipoPoke = document.createElement("p");
            tipoPoke.innerHTML = "Tipo: " + response.types[0].type.name;
            let pesoPoke = document.createElement("p");
            pesoPoke.innerHTML = "Peso: " + response.weight/10 + "kg" ;
            let alturaPoke = document.createElement("p");
            alturaPoke.innerHTML = "Altura: " + response.height/10 + "m";
            let habilidadesPoke = document.createElement("p");
            let habiliPoke = 'habilidades: ';
            response.abilities.forEach((element) => {
              habiliPoke += element.ability.name + '; ';
            })

            habilidadesPoke.innerHTML = habiliPoke;
            infoModel.appendChild(imgpoke);
            infoModel.appendChild(nomePoke);
            infoModel.appendChild(tipoPoke);
            infoModel.appendChild(pesoPoke);
            infoModel.appendChild(alturaPoke);
            infoModel.appendChild(habilidadesPoke);
            $('#myModal').modal('show')

            })


          }
        )

      })



    });
  }

let paginaAtual = 1;
let proximo = document.querySelector("#proximo");
proximo.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("proximo");
  paginaAtual++;
  console.log(paginaAtual);
  let limpar = document.getElementById("listapokemons");
  listapokemons.innerText = "";
  buscarPokemons(paginaAtual).then(function (response) {
    popularPoke(response.results);
  });
});

let anterior = document.querySelector("#anterior");
anterior.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("anterior");
  if (paginaAtual > 1) {
    paginaAtual--;
  }
  console.log(paginaAtual);
  listapokemons.innerText = "";
  buscarPokemons(paginaAtual).then(function (response) {
    popularPoke(response.results);
  });
});

let botaoBuscar = document.querySelector("#botaoBuscar");
botaoBuscar.addEventListener("click", function (event) {
  event.preventDefault();
  let buscarPokemonNome = document
    .querySelector("#search_input")
    .value.toLowerCase();
  let pokemons = [];

  buscarPokemon(buscarPokemonNome)
    .then(function (response) {
      pokemons.push({ name: buscarPokemonNome });
      popularPoke(pokemons);
    })
    .catch(function (error) {
      console.log(error);

    });
});

let tipos = document.querySelector("#tipos");
tipos.addEventListener("change", function (event) {
  event.preventDefault();
  let pokemonsFiltradosPorTipo = [];
  buscarPokemonPorTipo(tipos.value)
    .then(function (response) {
      let pokemons = response.pokemon;
      pokemons.forEach(function (element) {
        pokemonsFiltradosPorTipo.push({ name: element.pokemon.name});
      });
      popularPoke(pokemonsFiltradosPorTipo);
    })
    .catch(function (error) {
      console.log("erro", error);
    });
});

window.onload = async (event) => {
  buscarPokemons(1).then(
    function (response) {
      console.log(response);
      let lista = document.getElementById("listapokemons");
      lista.innerHTML = "";
      popularPoke(response.results);
      vetor_pokemons = response.results;
    }
  );

  buscarTipos().then(function (response) {
    popularSelectTiposPokemons(response.results);
  });
};
