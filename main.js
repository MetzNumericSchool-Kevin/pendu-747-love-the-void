const nouvellePartie = document.querySelector('.card-body .btn');
const statErreurs = document.querySelector('#errors');
const statStreak = document.querySelector('#record');
const pendu = document.querySelector('#hangman');
const erreurs = pendu.querySelectorAll("[id^=error-]");
const affichageMot = document.querySelector('#word-display');
const conteneurLettres = document.querySelector('#letters-used');
const finDuJeu = document.querySelector('#game-over-modal');
const resultat = finDuJeu.querySelector('#game-result');
const rejouer = finDuJeu.querySelector('#game-result + div > button');
const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const lettresTapees = {correctes: "", toutes: ""};
let lettresDuMot = [];
let nombreErreur = 0;
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
    finDuJeu.close();
    await chargerMot();
    lettresDuMot = [...new Set(mot)].join('');
    initialiserPendu();
}

function initialiserPendu() {
    while (affichageMot.hasChildNodes()) { // On supprime les tirets et lettres de l'ancien mot
        affichageMot.removeChild(affichageMot.firstChild);
    }
    for (let i=0; i<mot.length; i++) { // On créé de nouveaux tirets correspondant au nouveau mot
        const aAfficher = document.createElement("span");
        aAfficher.classList.add("letter-placeholder");
        affichageMot.appendChild(aAfficher);
    }
    nombreErreur = 0; // On initialise le compteur d'erreurs
    statErreurs.innerHTML = "0/5"; // On initialise le compteur d'erreurs affiché sur la page
    erreurs.forEach(erreur => {
        erreur.classList.add('hidden'); // On initialise le pendu
    });
    while (conteneurLettres.firstChild) {
        conteneurLettres.removeChild(conteneurLettres.firstChild); // On initialise le conteneur des lettres tapées
    }
    lettresTapees.correctes = ""; // On initialise le dictionnaire des lettres tapées
    lettresTapees.toutes = "";
}

demarrerJeu();
document.addEventListener('keydown', (event) => {
    nombreErreur = taperLettre(event, lettresTapees, nombreErreur);
    if (nombreErreur === 5 || lettresTapees.correctes.length === lettresDuMot.length) {
        finDePartie(nombreErreur);
    }
});

function essaiLettre(lettre, nombreErreur, lettresTapees) {
    if (mot.includes(lettre)) {
        gererReussite(lettre);
        lettresTapees.correctes += lettre;
    } else {
        nombreErreur = gererErreur(lettre, nombreErreur);
    }
    return nombreErreur;
}

function gererReussite(lettre) {
    const nouvelleLettre = document.createElement("div");
    nouvelleLettre.textContent = lettre;
    nouvelleLettre.style.color = "green";
    conteneurLettres.appendChild(nouvelleLettre); // Ajout de la lettre en vert dans le conteneur des lettres déjà essayées
    for (let i=0; i<mot.length; i++) {
        if (lettre === mot[i]) {
            affichageMot.querySelectorAll("span")[i].innerHTML = lettre;
        }
    }
}

function gererErreur(lettre, nombreErreur) {
    const nouvelleLettre = document.createElement("div");
    nouvelleLettre.textContent = lettre;
    nouvelleLettre.style.color = "red";
    conteneurLettres.appendChild(nouvelleLettre); // Ajout de la lettre en rouge dans le conteneur des lettres déjà essayées
    nombreErreur += 1;
    statErreurs.innerHTML = nombreErreur + "/5";
    const erreur = erreurs[nombreErreur - 1];
    erreur.classList.remove("hidden");
    erreur.classList.add("block"); // Ajout de l'élément suivant du pendu
    return nombreErreur;
}

function finDePartie(nombreErreur) {
    if (nombreErreur === 5) {
        statStreak.innerHTML = "0";
        resultat.innerHTML = "Perdu!" + "<br>Erreurs: " + nombreErreur + "/5<br>Le mot était " + mot;
    } else {
        statStreak.innerHTML = (parseInt(statStreak.textContent) + 1).toString();
        resultat.innerHTML = "Gagné!" + "<br>Erreur(s): " + nombreErreur + "/5<br>Nombre de parties gagnées à la suite: " + statStreak.textContent;
    }
    finDuJeu.show();
}

function taperLettre(event, lettresTapees, nombreErreur) {
    if (!alphabet.includes(event.key.toUpperCase())) {
        alert("Veuillez taper une lettre valide.");
        return nombreErreur;
    }
    if (lettresTapees.toutes.includes(event.key.toUpperCase())) {
        alert("Cette lettre a déjà été tapée. Veuillez en choisir une autre.");
        return nombreErreur;
    }
    lettre = event.key.toUpperCase();
    lettresTapees.toutes += lettre;
    nombreErreur = essaiLettre(lettre, nombreErreur, lettresTapees);
    return nombreErreur;
}

// A FAIRE:
// - Gérer le tiret - dans les mots
// - Gérer l'appui de touches utiles (ctrl, flèches, fn, ...)