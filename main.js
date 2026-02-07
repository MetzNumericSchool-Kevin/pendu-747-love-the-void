const nouvelle_partie = document.querySelector('.card-body .btn');
const stat_erreurs = document.querySelector('#errors');
const stat_streak = document.querySelector('#record');
const pendu = document.querySelector('#hangman');
const erreur1 = pendu.querySelector('#error-1');
const erreur2 = pendu.querySelector('#error-2');
const erreur3 = pendu.querySelector('#error-3');
const erreur4 = pendu.querySelector('#error-4');
const erreur5 = pendu.querySelector('#error-5');
const affichage_mot = document.querySelector('#word-display');
const conteneur_lettres = document.querySelector('#letters-used');
const fin_du_jeu = document.querySelector('#game-over-modal');
const resultat = fin_du_jeu.querySelector('#game-result');
const rejouer = fin_du_jeu.querySelector('#game-result + div > button');

let mot = [];
fetch("https://trouve-mot.fr/api/random")
    .then((response) => response.json())
    .then((nouveau_mot) => mot.push(nouveau_mot[0].name));