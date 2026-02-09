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
    console.log(mot);
    const lettresDuMot = [...new Set(mot)].join('');
    console.log(lettresDuMot);
    let nombreErreur = 0;
    const lettresTapees = {correctes: "", toutes: ""};
    initialiserPendu();
    nombreErreur = taperLettre(lettresTapees, nombreErreur);
    console.log(nombreErreur);
    // while (lettresTapees.correctes.length != lettresDuMot.length || nombreErreur < 5) {
    //     nombreErreur = taperLettre(lettresTapees, nombreErreur);
    // }
    finDePartie(nombreErreur);
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
}

function essaiLettre(lettre, nombreErreur, lettresTapees) {
    const nouvelleLettre = document.createElement("div");
    if (mot.includes(lettre)) {
        gererReussite(nouvelleLettre);
        lettresTapees.correctes += nouvelleLettre;
    } else {
        nombreErreur = gererErreur(nouvelleLettre, nombreErreur);
    }
    return nombreErreur;
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

function finDePartie(nombreErreur) {
    if (nombreErreur === 5) {
        resultat.innerHTML = "Score: " + nombreErreur + "/5" + " Perdu!"
        statStreak.innerHTML = "0"
    } else {
        resultat.innerHTML = "Score: " + nombreErreur + "/5" + " Gagné!"
        statStreak.innerHTML = (parseInt(statStreak.textContent) + 1).toString();
    }
    finDuJeu.show();
}

function taperLettre(lettresTapees, nombreErreur) {
    document.addEventListener('keydown', function(event) {
        if (!alphabet.contains(event.key.toUpperCase)) {
            alert("Veuillez taper une lettre valide.");
            return nombreErreur;
        }
        if (lettresTapees.contains(event.key.toUpperCase)) {
            alert("Cette lettre a déjà été tapée. Veuillez en choisir une autre.");
            return nombreErreur;
        }
        lettre = event.key.toUpperCase;
        nombreErreur = essaiLettre(lettre, nombreErreur, lettresTapees);
        lettresTapees.toutes += lettre;
    })
    return nombreErreur;
}

// A FAIRE:
// - Gérer la réussite -> vérifier à chaque essai si le mot est complètement rempli et activer le <dialog> et y écrire les résultats + streak si oui
// - Gérer l'échec -> si le nombre d'erreurs = 5, activer le <dialog> et y écrire les résultats + streak
// - Gérer le tiret - dans les mots
// - Gérer les lettres déjà saisies pour éviter les doublons -> avoir une liste des lettres déjà saisies?