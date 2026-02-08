const nouvellePartie = document.querySelector('.card-body .btn');
const statErreurs = document.querySelector('#errors');
const statStreak = document.querySelector('#record');
const pendu = document.querySelector('#hangman');
const erreurs = pendu.querySelectorAll("[id^=error-]");
console.log(erreurs);
const affichageMot = document.querySelector('#word-display');
const conteneurLettres = document.querySelector('#letters-used');
const finDuJeu = document.querySelector('#game-over-modal');
const resultat = finDuJeu.querySelector('#game-result');
const rejouer = finDuJeu.querySelector('#game-result + div > button');

let mot = "";
async function chargerMot() {
    const response = await fetch("https://trouve-mot.fr/api/random");
    const data = await response.json();
    mot = data[0].name;
    mot = mot.replaceAll(/à|â|ä/g, "a");
    mot = mot.replaceAll(/é|è|ê|ë/g, "e");
    mot = mot.replaceAll(/î|ï/g, "i");
    mot = mot.replaceAll(/ô|ö/g, "o");
    mot = mot.replaceAll(/ù|û|ü/g, "u");
    mot = mot.replaceAll(/ÿ/g, "y");
    mot = mot.replaceAll(/ç/g, "c");
    mot = mot.toUpperCase();
}

async function demarrerJeu() {
  await chargerMot();
  initialiserPendu();
}

function initialiserPendu() {
    let nombreErreur = 0;
    while (affichageMot.hasChildNodes()) { // On supprime les tirets et lettres de l'ancien mot
        affichageMot.removeChild(affichageMot.firstChild);
    }
    for (let i=0; i<mot.length; i++) { // On créé de nouveaux tirets correspondant au nouveau mot
        const aAfficher = document.createElement("span");
        aAfficher.classList.add("letter-placeholder");
        affichageMot.appendChild(aAfficher);
    }
}

function essaiLettre(lettre, mot, nombreErreur) {
    const nouvelleLettre = document.createElement("div");
    if (mot.includes(lettre)) {
        gererReussite(nouvelleLettre);
    } else {
        nombreErreur = gererErreur(nouvelleLettre, nombreErreur);
    }
}

function gererReussite(nouvelleLettre) {
    nouvelleLettre.style = "color: green;";
    conteneurLettres.appendChild(nouvelleLettre); // Ajout de la lettre en vert dans le conteneur des lettres déjà essayées
    for (let i=0; i<mot.length; i++) {
        if (lettre = mot[i]) {
            const lettreBienPlacee = affichageMot.childNodes[i];
            lettreBienPlacee.innerHTML = lettre; // Ecriture de la lettre au bon emplacement
        }
    }
}

function gererErreur(nouvelleLettre, nombreErreur) {
    nouvelleLettre.style = "color: red;";
    conteneurLettres.appendChild(nouvelleLettre); // Ajout de la lettre en rouge dans le conteneur des lettres déjà essayées
    nombreErreur += 1;
    statErreurs.innerHTML = nombreErreur + "/5";
    const erreur = erreurs[nombreErreur - 1];
    erreur.classList.remove("hidden");
    erreur.classList.add("block"); // Ajout de l'élément suivant du pendu
    return nombreErreur;
}