# Portak

------------------------------------
BENZA Amandine
FORNALI Damien

--

Université Nice-Sophia-Antipolis
Master I IFI
2017-2018

--

Projet Javascript, création d'un jeu vidéo 2D

------------------------------------


- Sommaire

I. Description
II. Architecture du code
III. Répartition du travail
IV. Difficultés rencontrées
V. Points faibles et points forts

----

I. Description

    Portak est un labyrinthe 2D dans lequel le joueur doit rejoindre un portail afin d'accéder au niveau suivant. Sur son chemin, il va rencontrer différents obstacles comme des portes à ouvrir à l'aide de clés , des ennemis, divers murs...
    Afin d'atteindre le portail menant au niveau suivant, le joueur doit utiliser intelligemment l'énergie dont il dispose.
    Le joueur peut se déplacer, bien sûr, mais aussi tirer afin de détruire certains obstacles qu'il rencontre. Ces deux actions coûtent respectivement un et deux points d'énergie.

    Le jeu est composé de 12 niveaux dont la difficulté croît progressivement.

    Nous avons créé toutes les textures du jeu à l'aide des logiciels paint.net et Photoshop. Nous voulions obtenir un résultat cohérent et homogène correspondant à l'idée que nous nous faisions du jeu.
    Nous avons ajouté des sons synchronisés avec les évènements du jeu ainsi qu'une musique de fond dont le tempo varie en fonction du niveau. En revanche, les sons utilisés ont été récupéré sur internet et n'ont pas été composé par nos soins.


II. Architecture du code

    - game.js 				: boucle de jeu principale
    - eventEngine.js 		: moteur gérant les évenènements au clavier de l'utilisateur
    - renderEngine.js 		: contient l'appel d'affichage principal ainsi que des méthodes d'affichage de texte

    - world.js 				: le monde de jeu, contient le joueur, le niveau actuel et les portails
    - level.js 				: un niveau de jeu, contient la carte, les obstacles ainsi que les objets à collecter
    - levelLoader.js 		: le chargeur de niveaux, charge un niveau complet depuis un fichier .lvl
    - map.js 				: la carte, elle contient les tiles du jeu
    - tile.js 				: une fraction de la carte, peut savoir si elle est occupée par un élément du niveau

    - entity.js 			: classe mère de tous les éléments du monde exceptée la carte et ses tiles
    - enemy.js 				: classe mère des ennemies du joueur
    - zombie.js 			: l'unique type d'ennemi implémenté

    - player.js 			: le joueur est la source principale d'intéractivité avec le jeu. Il écoute les évènements du clavier provoqués par l'utilisateur pendant le déroulement            d'un niveau du jeu. Il agit en fonction de ces derniers et vérifie lui même les collisions avec son environnement.

    - projectile.js 		: classe mère des projectiles tirés par les ennemis et le joueur
    - enemyProjectile.js 	: projectiles tirés par les ennemis qui blessent uniquement le joueur
    - playerProjectile.js 	: projectiles tirés par le joueur permettant de tuer les ennemis et de détruire les murs destructibles

    - wall.js 				: mur classique impénétrable
    - destructibleWall.js 	: mur destructible par le joueur

    - door.js 				: obstacle que le joueur peut ouvrir à l'aide de la bonne clé
    - key.js 				: objet permettant au joueur d'ouvrir la porte correspondante

    - portal.js 			: portail permettant d'accéder au niveau suivant
    - power.js 				: source d'énergie que le joueur peut récupèrer

    - texture.js 			: objet utilisé pour l'affichage de tous les sprites du jeu
    - animation.js 			: animation de sprites (joueur / portail)

    - aabb.js 				: boîte de collision classique
    - menu.js 				: menu principal du jeu

    - sound.js 				: contient tous les sons du jeu
    - time.js 				: timer utilisé à différents endroits du code
    - toolbox.js 			: contient des méthodes utilitaires utilisées dans le code


III. Répartition du travail

    Un membre s'étant occupé d'un fichierX.js s'est également occupé de son intégration dans le jeu.
    
	Amandine: 
				- power.js
				- door.js
				- key.js
				- time.js
				- toolbox.js
				- projectile.js
				- enemyProjectile.js
				- playerProjectile.js
				- wall.js
				- destructibleWall.js
				- enemy.js
				- aabb.js
                 - Niveaux créés : 1, 2, 3, 6, 7, 9, 10, 12, 13

	Damien:
				- eventEngine.js
				- renderEngine.js
				- world.js
				- levelLoader.js
				- game.js
				- player.js
				- texture.js
				- animation.js
				- portal.js
				- zombie.js
				- menu.js
				- sound.js
                 - Niveaux créés : 4, 5, 6, 8, 11

	Commun:
				- entity.js
				- level.js
				- tile.js
				- map.js
				- Choix des sons et de la musique de fond

IV. Difficultés rencontrées

	1. Difficultés liées au langage

		La déclaration / initialisation automatique de variables inconnues de Javascript a parfois fait apparaître des anomalies dans le comportement du jeu sans nous indiquer que la variable utilisée était mauvaise (erreur dans l'orthographe du nom de la variable).

	2. Difficultés algorithmiques

		Nous avons rencontré quelques difficultés lors de l'implémentation des projectiles, de l'animation.
		Nous avons repensé plusieurs fois l'architecture globale du jeu ainsi que la localisation de l'affichage (méthodes de render présentes dans les objets et non pas dans renderEngine).

		Le déplacement du joueur fut aussi compliqué, nous avons fait en sorte que lorsque l'utilisateur ordonne un déplacement au joueur, tant que celui-ci ne s'est pas déplacé jusqu'à la tile de destination, le jeu continue à le faire avancer de 1 pixel vers cette direction. Nous obtenons donc un déplacement fluide du joueur vers la tile suivante ce qui nous permet d'éviter un quelconque soucis de collision.

		Nous avons voulu ajouter un mode génération de niveaux aléatoires mais après avoir rencontré quelques difficultés nous avons préféré nous concentrer sur le design de niveaux faits à la main dans un fichier .lvl plutôt que de générer des niveaux peu complexes et sans intérêts.
        
V. Points faibles et points forts

    1. Points faibles
    
    - Pas de redimensionnement dynamique de la taille du jeu : fonctionnalité trop longue a implémenter.
    - Modularité du contenu de player.js améliorable
    
    2. Points forts
    
    - Pixel Art personnalisé : graphismes homogènes.
    - Level design varié et réfléchi : le joueur doit mettre en place différentes stratégies en fonction du niveau.
    - Ressenti global du jeu : jeu complet.
    - Code évolutif : possibilité de facilement ajouter de nouvelles fonctionnalités/de nouveaux élements grâce, notamment, au levelLoader.

