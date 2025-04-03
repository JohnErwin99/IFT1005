function init() {
    console.log("Lecture des recettes ....");

    //url pour le livre
    let url = livrederecette()
    if( url === '') {
        url = "damn.yaml"
    }
    console.log("url: ", url);
    fetchYaml(url);
}

//ttrouve le paramtre livre dna sla barre de recherche
function livrederecette() {
    let p = window.location.search;
    if(p.substring(0,7)!="?livre=")
        console.log(p.substring(0,7));
    let url = p.substring(7);
    return url
}

//va chercher le fichier yaml
function fetchYaml(url) {
    console.log("fetching yaml file");
    const recettes = document.createElement('recettes');

    fetch(url, { method: 'GET' })
        .then(function(response) { return  response.text(); })
        .then(function(yaml) { return jsyaml.loadAll(yaml); })
        .then(function(recettejson) {
            console.log("Nombre de recettes: ", recettejson.length);
            recettejson.forEach(function(recette) {
                console.log("Recette: ", recette);
                creerrecetteshtml(recette);
                creermenucomplethtml(recette);
            });
            

        })
        .catch(function(error) {
            console.error("Erreur lors de la récupération du fichier YAML:", error);
        });
    
}
//creer la navigaiton de menu dynamiquementt
function creermenucomplethtml(recettesjson){
    const menucomplet = document.createElement('a');
    menucomplet.innerHTML += 
        `${recettesjson.nom}`;
    menucomplet.setAttribute('href', `#recette-${recettesjson.id}`);
     
    document.getElementsByClassName('listerecettes')[0].appendChild(menucomplet);
}


//creer les filtre pour regime dynamiquement 
function creerfiltreregime(recettejson) {
    const filtre = document.createElement('select');
    filtre.setAttribute('name', 'regime');
    filtre.innerHTML += 
        `<option value="vegetarien">Végétarien</option>
         <option value="sans gluten">Sans gluten</option>`;
}


function creerrecetteshtml(recettesjson){
    const recettes = document.createElement('recettes');
    recettes.innerHTML += 
        `
        <img class="image" src="${recettesjson.image}" alt="${recettesjson.nom}" width="300" height="200">
        <h2 id="recette-${recettesjson.id}"class="recettetitre"> ${recettesjson.nom}</h2>
        <p class="recettedescription">${recettesjson.description}</p>
        ${recettesjson.parties.map(partie => 
        `<div class="partie">
            <h3 class="recettetitre">${partie.titre}</h3>
            <p class="recetteingredients">Ingrédients: <br>${partie.ingrédients.map(ing => `- ${ing}`).join('<br>')}</p>
            <p class="recetteetapes">Étapes: <br>${partie.étapes.map(etape => `- ${etape}`).join('<br>')}</p>
            </div>
        `).join('')}
    </div>
`;

    document.getElementById('affichagerecettes').appendChild(recettes);
}

window.onload = init;