# Orapa Mine – Maître du jeu

Une application web qui joue le rôle du maître du jeu d’**Orapa Mine**. Posez un seul téléphone au centre de la table. L’app cache les gemmes, répond aux rayons et aux cases sondées (à voix haute si vous voulez), fait tourner les tours et vérifie les propositions. Tout le monde peut chercher, de 1 à 8 prospecteurs, sans que personne ne doive se « sacrifier » comme maître du jeu.

**Jouer : https://benoitprat.github.io/orapa-mine/**

> ⚠️ **Il faut posséder le jeu.** Cette page remplace seulement le maître du jeu et son plateau caché. Pour jouer, il vous faut la boîte d’Orapa Mine : les feuilles de solutions pour noter vos déductions, les pièces de gemmes pour tester vos hypothèses et le livret de règles. Soutenez les auteurs et l’éditeur en achetant le jeu.

---

## Sommaire

1. [Installation sur le téléphone](#installation-sur-le-téléphone)
2. [Préparer une partie](#préparer-une-partie)
3. [Déroulement d’un tour](#déroulement-dun-tour)
4. [Proposer une solution](#proposer-une-solution)
5. [Couleurs du rayon](#couleurs-du-rayon)
6. [Voix](#voix)
7. [Sauvegarde et hors ligne](#sauvegarde-et-hors-ligne)
8. [Différences avec le jeu en boîte](#différences-avec-le-jeu-en-boîte)
9. [Fonctionnement technique](#fonctionnement-technique)
10. [Crédits](#crédits)

---

## Installation sur le téléphone

1. Ouvrez https://benoitprat.github.io/orapa-mine/ sur le téléphone.
2. **iPhone (Safari)** : touchez le bouton Partager, puis « Sur l’écran d’accueil ».
   **Android (Chrome)** : ouvrez le menu ⋮, puis « Ajouter à l’écran d’accueil » ou « Installer l’application ».
3. L’app s’ouvre alors en plein écran avec sa propre icône. Après la première ouverture, elle fonctionne sans connexion.

## Préparer une partie

Chaque prospecteur prend une feuille de solutions et un crayon. Gardez les pièces de gemmes de la boîte sur la table pour tester vos hypothèses.

Dans l’app :

| Réglage | Rôle |
|---|---|
| **Prospecteurs** | Noms des joueurs, dans l’ordre du tour (de 1 à 8). Avec un seul nom, vous jouez seul contre la mine. |
| **Difficulté** | Facile, Normal ou Expert (voir ci-dessous). |
| **Extension Diamant** | Ajoute la gemme transparente : elle renvoie le rayon sans le colorer. |
| **Extension Corps noir** | Ajoute le corps noir : il absorbe le rayon (« le signal a été absorbé »). |
| **Propositions par joueur** | De 1 à 3. Le choix de la difficulté règle une valeur par défaut, que vous pouvez modifier. |
| **Voix** | Annonce les réponses, et éventuellement le joueur suivant. |

### Niveaux de difficulté

| Niveau | Mine | Règles |
|---|---|---|
| **Facile** | Gemmes bien espacées : elles ne se touchent pas, même par un coin. L’app choisit une mine où peu de rayons touchent plusieurs gemmes. | 3 propositions. Pendant une proposition, un encadré liste les réponses du journal que votre mine n’explique pas encore. |
| **Normal** | Placement au hasard selon les règles du livret. | 2 propositions, comme dans le livret. |
| **Expert** | Gemmes imbriquées : l’app choisit, parmi 40 mines tirées au hasard, celle qui a le plus de contacts entre gemmes et de rayons aux couleurs mélangées. | 2 propositions. On ne peut pas sonder une case, seulement envoyer des rayons. |

L’aide du niveau Facile n’utilise que les réponses publiques du journal. Elle fait le calcul que chaque joueur pourrait faire sur sa feuille.

Touchez **Creuser la mine**. L’app place au hasard les 5 gemmes de base (rouge, jaune, bleue, grande blanche, petite blanche), plus les extensions choisies, en respectant les règles du livret :

- les pièces suivent les lignes de la grille et ne dépassent pas du plateau ;
- deux pièces ne se touchent jamais par un côté, seulement par un coin ou un point ;
- aucune pièce n’est entièrement cachée derrière les autres vue depuis les bords.

## Déroulement d’un tour

À son tour, un joueur fait **une** action :

- **Envoyer un rayon** : touchez un repère du bord (1 à 10 en haut, 11 à 18 à droite, I à R en bas, A à H à gauche), puis le bouton d’envoi. L’app annonce le **point de sortie** et la **couleur** du rayon. Le repère d’entrée et celui de sortie se colorent sur la grille.
- **Sonder une case** (sauf en Expert) : passez en mode « Sonder une case », touchez une case (par exemple C4), puis le bouton. L’app dit quelle couleur de gemme s’y trouve, ou « rien ». Elle ne donne ni la forme ni l’orientation. Une case du corps noir répond « le signal a été absorbé ».
- **Proposer une solution** (voir plus bas).

Chaque réponse reste affichée en grand, s’ajoute au **journal** (de la plus récente à la plus ancienne), puis le tour passe au joueur suivant encore en jeu.

## Proposer une solution

1. Touchez **Proposer une solution** et confirmez. Les autres joueurs détournent les yeux.
2. **Poser une gemme** : faites-la glisser de la réserve vers la grille. Sur téléphone, elle s’affiche un peu au-dessus du doigt pour rester visible. Vous pouvez aussi toucher la gemme dans la réserve, puis toucher une case : la gemme se centre sur cette case.
3. **Ajuster** : touchez une gemme posée pour la sélectionner (contour orange). **↻ Tourner** la fait pivoter d’un quart de tour, **⇋ Retourner** la retourne comme un miroir. Elle garde sa place sur la grille. Faites-la glisser pour la déplacer. **Retirer** la remet dans la réserve.
4. La grille porte les mêmes repères que la feuille de solutions (1 à 18, A à R), pour recopier facilement votre feuille.
5. Les gemmes qui se chevauchent ou se touchent par un côté sont entourées de rouge pointillé. **Valider** s’active quand toutes les gemmes sont posées sans conflit.

- **Juste** : le joueur gagne, la mine s’affiche avec le nombre de questions posées.
- **Faux** : le joueur perd une proposition. Sans proposition restante, il est éliminé. Si tous les joueurs sont éliminés, la mine gagne.

Les deux gemmes blanches sont interchangeables pour la vérification. Seules comptent la couleur et la position exacte des pièces.

## Couleurs du rayon

| Couleur annoncée | Gemmes touchées |
|---|---|
| Transparent | aucune |
| Rouge / Bleu / Jaune / Blanc | une seule couleur |
| Violet | bleu + rouge |
| Bleu clair | bleu + blanc |
| Vert | bleu + jaune |
| Rose | rouge + blanc |
| Orange | rouge + jaune |
| Jaune clair | blanc + jaune |
| Violet clair | bleu + rouge + blanc |
| Noir | bleu + rouge + jaune |
| Vert clair | bleu + blanc + jaune |
| Orange clair | rouge + blanc + jaune |
| Gris | les quatre couleurs |

Toucher plusieurs fois la même couleur ne change pas le résultat. Le diamant renvoie le rayon sans changer sa couleur.

**Noir ≠ absorbé.** Un rayon *noir* ressort bien de la mine, après avoir touché du bleu, du rouge et du jaune : l’app l’affiche en pastille noire pleine, avec un point de sortie. Un rayon *absorbé* a heurté le corps noir et ne ressort pas : l’app annonce « le signal a été absorbé » et l’affiche en pastille hachurée de rouge, sans point de sortie. Une case du corps noir sondée s’affiche de la même façon.

## Voix

- L’app utilise la synthèse vocale française du téléphone, sans connexion ni compte.
- Exemple d’annonce : « Rayon 7 : il ressort en 12, violet clair. À Marie. »
- Le bouton **🔊** répète la dernière réponse.
- Touchez l’écran une première fois pour que le navigateur accepte de parler. Sur iPhone, coupez le mode silencieux.
- Pour une voix plus naturelle, installez une voix française « améliorée » dans les réglages d’accessibilité du téléphone.

## Sauvegarde et hors ligne

- Les réglages et la partie en cours sont enregistrés **sur ce téléphone** : fermez l’app, la partie reprend où elle en était. Effacer les données du navigateur, ou jouer en navigation privée, efface la sauvegarde.
- L’écran reste allumé pendant la partie, quand le navigateur le permet.
- Après une première ouverture avec connexion, l’app fonctionne hors ligne.

## Différences avec le jeu en boîte

- La mine est générée au hasard par l’app. Personne ne la connaît, même pas le propriétaire du téléphone.
- L’app suit le mode « 3 joueurs et plus » : tout le monde cherche la même mine. Elle fonctionne aussi à 1 ou 2 joueurs.
- Les formes des pièces ont été relevées sur les schémas du livret :
  - **rouge** : parallélogramme de 3 × 1 ;
  - **jaune** : triangle rectangle de 2 cases de côté ;
  - **bleue** et **grande blanche** : triangle de base 4 et de hauteur 2 ;
  - **petite blanche** : losange de 2 × 2 ;
  - **diamant** : triangle rectangle isocèle de 1 carreau de côté (une demi-case) ;
  - **corps noir** : base rectangulaire de 2 × 1.

  Si une forme ne correspond pas à vos pièces, ouvrez une *issue* sur le dépôt.

## Fonctionnement technique

L’app tient dans une seule page HTML, sans serveur ni dépendance.

| Fichier | Rôle |
|---|---|
| `index.html` | Toute l’application : interface, voix, sauvegarde, moteur inclus. |
| `engine.js` | Copie autonome du moteur, utilisable dans Node pour des tests. |
| `manifest.webmanifest` | Nom, couleurs et icônes pour l’installation sur l’écran d’accueil. |
| `sw.js` | Service worker : met l’app en cache pour le hors ligne. |
| `icon-*.png`, `apple-touch-icon.png` | Icônes. |

**Moteur.** Le plateau fait 10 × 8 cases. Chaque case est découpée en 4 triangles par ses diagonales. Comme toutes les pièces ont des sommets sur la grille et des côtés à 0°, 45° ou 90°, chaque pièce est exactement une réunion de ces triangles. Le rayon avance de case en case :

- s’il rencontre un côté droit d’une gemme, il repart en sens inverse ;
- s’il rencontre un côté en diagonale, il tourne à 90° ;
- chaque gemme touchée ajoute sa couleur, le corps noir arrête le rayon.

Le moteur a été vérifié sur l’exemple du livret : le rayon I revient en I, rouge, et le rayon 15 ressort en 8, violet clair. Le trajet de chaque rayon est aussi testé dans les deux sens.

**Mettre à jour l’app.** Modifiez `index.html`, puis changez le nom du cache dans `sw.js` (`orapa-mj-v2`, `v3`, etc.) pour que les téléphones récupèrent la nouvelle version.

## Crédits

*Orapa Mine* est un jeu de **Junghee Choi** et **Wanjin Gill**, édité par **Playte**, et distribué en France par **Gigamic**. Ce projet est une aide de jeu amateur et non officielle, sans lien avec les auteurs ni les éditeurs. Il ne contient aucun élément graphique ni aucun texte du jeu. Il ne remplace pas le jeu : achetez-le pour en profiter.
