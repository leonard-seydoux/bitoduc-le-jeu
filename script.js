let mots = [];
let indexMotActuel = 0;
let score = 0;
let interval; // Variable pour stocker l'intervalle de la barre de chargement
const tempsAvantChangement = 5000; // Temps d'attente avant de changer le mot en millisecondes

const elementMotAnglais = document.getElementById("mot-anglais");
const champSaisie = document.getElementById("champ-de-saisie");
const elementRetour = document.getElementById("retour");
const elementScore = document.getElementById("score");
const barreDeChargement = document.getElementById("barre-de-chargement");
const progression = document.getElementById("progression");

// Charger les mots depuis le fichier JSON
fetch("liste_de_traductions.json")
    .then(response => response.json())
    .then(data => {
        mots = data;
        chargerMot();
    })
    .catch(error => {
        console.error("Erreur lors du chargement du fichier JSON :", error);
    });

// Fonction pour obtenir un mot aléatoire
function obtenirMotAleatoire() {
    const randomIndex = Math.floor(Math.random() * mots.length);
    return mots[randomIndex];
}

// Fonction pour générer une couleur aléatoire
function genererCouleurAleatoire() {
    const letters = 'BCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

// Charger un mot aléatoire
function chargerMot() {
    if (mots.length === 0) {
        elementMotAnglais.textContent = "Aucun mot à afficher.";
        return;
    }
    const mot = obtenirMotAleatoire();
    indexMotActuel = mots.indexOf(mot);
    elementMotAnglais.textContent = mot.anglais;
    elementRetour.textContent = ""; // Efface le message de retour
    champSaisie.value = ""; // Efface le champ de saisie

    // Changer la couleur de fond du body
    document.body.style.backgroundColor = genererCouleurAleatoire();
}

// Vérifier la proposition de l'utilisateur
function verifierProposition() {
    const propositionUtilisateur = champSaisie.value.trim().toLowerCase();
    const reponseCorrecte = mots[indexMotActuel].français.toLowerCase();

    if (propositionUtilisateur === reponseCorrecte) {
        elementRetour.textContent = "Correct ! 🎉";
        score++;
        elementScore.textContent = score;
        champSaisie.value = ""; // Efface le champ de saisie
        demarrerChargement(); // Démarrer la barre de chargement
    } else {
        elementRetour.textContent = "Essayez encore !";
    }
}

// Révéler la solution
function revelerSolution() {
    const reponseCorrecte = mots[indexMotActuel].français;
    elementRetour.textContent = `La réponse correcte est : ${reponseCorrecte}`;
    champSaisie.value = ""; // Efface le champ de saisie
    demarrerChargement(); // Démarrer la barre de chargement
}

// Démarrer la barre de chargement
function demarrerChargement() {
    barreDeChargement.style.display = "block"; // Afficher la barre de chargement
    progression.style.width = "0%"; // Réinitialiser la largeur

    let tempsEcoule = 0;
    interval = setInterval(() => {
        tempsEcoule += 100; // Augmenter le temps écoulé de 100 ms
        const pourcentage = Math.min((tempsEcoule / tempsAvantChangement) * 100, 100);
        progression.style.width = pourcentage + "%";

        // Si le temps écoulé atteint la durée d'attente, changer de mot
        if (tempsEcoule >= tempsAvantChangement) {
            clearInterval(interval); // Arrêter l'intervalle
            changerMot(); // Changer de mot
        }
    }, 100);
}

// Changer de mot
function changerMot() {
    // barreDeChargement.style.display = "none"; // Cacher la barre de chargement
    progression.style.width = "0%"; // Réinitialiser la largeur
    chargerMot();
}

// Écouteur pour la touche "Entrée"
champSaisie.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        // Vérifier si la combinaison Command + Entrée ou Ctrl + Entrée est utilisée
        if (event.metaKey || event.ctrlKey) {
            revelerSolution();
        } else {
            const propositionUtilisateur = champSaisie.value.trim().toLowerCase();
            const reponseCorrecte = mots[indexMotActuel].français.toLowerCase();
            if (propositionUtilisateur === reponseCorrecte) {
                // Si la proposition est correcte, rien n'est fait pour changer de mot immédiatement
                verifierProposition(); // Vérifier la proposition
            } else {
                verifierProposition();
            }
        }
    }
});

// Initialiser le jeu
chargerMot();
