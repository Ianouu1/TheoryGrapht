# TheoryGrapht : Rapport de Projet

Auteurs : Yannis BOUTALEB - Florian DE SOUSA

## 🎯 Contexte et objectifs

**TheoryGrapht** est une application web permettant de visualiser les algorithmes de graphes étudiés en cours. Elle implémente les algorithmes suivants :
- Parcours en largeur (BFS)
- Parcours en profondeur (DFS)
- Dijkstra
- Kruskal
- Prim
- Floyd-Warshall

## 🧩 Technologies utilisées & Architecture du projet

Pour ce projet, nous avons choisi de le réaliser en utilisant les technologies suivantes :
- **Java 17** : pour le développement back-end, car il s'agit du langage qu'on maîtrise le mieux.
- **Spring Boot** : pour créer une API RESTful. 
- **Maven** : pour la gestion des dépendances et la construction du projet.
- **Vite + React** : pour le développement front-end, permettant une interface utilisateur réactive et moderne.

### Architecture back-end

L’architecture **back-end** adoptée pour ce projet suit une organisation modulaire afin de séparer clairement les responsabilités. Nous retrouvons ainsi les couches suivantes : 

#### 1. Controlleur REST

Cette couche expose les endpoints d'une API, recevant les requêtes HTTP du frontend et renvoyant les réponses appropriées. Chaque endpoint correspond à un algorithme spécifique. 

```
org.theorygrapht
├── controller       → contient les classes REST exposant les routes de l’API
├── model            → regroupe les structures de données principales (Graph, Node, Edge)
├── service          → implémente les algorithmes de graphes (BFS, DFS, Dijkstra, Kruskal, etc.)
└── util             → fournit des outils complémentaires (chargement JSON, fonctions utilitaires, etc.)
```
Cette structure favorise la lisibilité, la maintenabilité et l’évolutivité du code en isolant la logique métier, les modèles de données et les points d’entrée de l’API.

## 2\. Théorie des algorithmes

Cette section présente le principe, la complexité et les cas d'usage de chaque algorithme.

| Algorithme     | Complexité     | Cas d'usage                         | Structure clé |
|----------------|----------------|-------------------------------------|---------------|
| BFS            | O(V+E)         | Parcours, distances non pondérées   | Queue         |
| DFS            | O(V+E)         | Détection de cycles, ordonnancement | Pile (stack)  |
| Dijkstra       | O((V+E) log V) | Plus court chemin (poids ≥ 0)       | PriorityQueue |
| Kruskal        | O(E log E)     | Arbre couvrant minimal              | Union-Find    |
| Prim           | O(E log V)     | Arbre couvrant minimal              | PriorityQueue |
| Floyd-Warshall | O(V^3)         | Tous les plus courts chemins        | Matrice       |

## 3\. Implémentation et choix techniques

L'application adopte une architecture en couches : (a) Frontend web (localhost:5173), (b) API Spring Boot (contrôleur REST), (c) couche Service (algorithmes), (d) couche Modèle (Graph, Vertex, Edge, GraphInput), (e) Utilitaires (conversion JSON ↔ modèle). L'API autorise explicitement les appels du front via CORS et expose les endpoints à la racine (sans préfixe /api).

**Endpoints exposés** (POST : BFS, DFS, Dijkstra, Kruskal, Prim, Floyd-Warshall ; GET : /hello). Corps JSON : liste d'adjacence Map&lt;String, List<Neighbor&gt;>; Réponse : List&lt;Edge&gt;.

![title](Images\Picture1.png)

### 3.1 Flux d'exécution (requête → résultat)

Front (<http://localhost:5173>)  
└─ envoie JSON (liste d'adjacence) -> POST /dijkstra?start=...&end=...  
└─ GraphController : reçoit Map&lt;String, List<Neighbor&gt;>  
└─ GraphUtils.fromMap(...) : construit Graph (Vertex\[\], Edge\[\], adjacencyList symétrique)  
└─ Service.getDijkstra(Graph, start, end) : calcule chemin (List&lt;Edge&gt;)  
└─ Retour JSON (List&lt;Edge&gt;) -> Front (visualisation/path)

## 4\. Modèle de données et conventions

Le modèle manipulé par les services comporte : (i) Vertex (nom de ville), (ii) Edge (source, target, weight=int), (iii) Graph (tableaux de sommets/arêtes + liste d'adjacence), (iv) GraphInput.Neighbor (ville, distance) pour l'entrée JSON.

Conversion : GraphUtils crée les Vertex et Edge à partir de la map, et alimente la liste d'adjacence des deux côtés (source et target), ce qui équivaut à un graphe non orienté au niveau de la navigation. Points d'attention : dédoublonnage d'arêtes, boucles, cohérence des noms de villes.

## 4\. Théorie détaillée des algorithmes

### 4.1 Parcours en largeur (BFS)

Principe : explore par couches depuis une source. Invariant : lorsqu'un sommet est extrait de la file, la distance calculée est minimale en nombre d'arêtes. Utilisations : distances non pondérées, composantes connexes, découverte de niveaux. Complexité : O(V+E).

Pseudo-code BFS(G, s):  
pour v in V: dist\[v\] <- +inf ; parent\[v\] <- ⌀  
dist\[s\] <- 0 ; Q <- file()  
enfiler(Q, s)  
tant que Q non vide:  
u <- défiler(Q)  
pour chaque voisin v de u:  
si dist\[v\] = +inf:  
dist\[v\] <- dist\[u\] + 1  
parent\[v\] <- u  
enfiler(Q, v)

![title](Images/Picture2.png)

### 4.2 Parcours en profondeur (DFS)

Principe : exploration récursive/itérative en profondeur. Invariants : temps d'entrée/sortie utiles pour détection de cycles et topologie (DAG). Complexité : O(V+E).

Pseudo-code DFS(G):  
pour v in V: couleur\[v\] <- blanc ; parent\[v\] <- ⌀  
pour v in V:  
si couleur\[v\] = blanc:  
DFS-Visite(v)  
<br/>DFS-Visite(u):  
couleur\[u\] <- gris  
pour v voisin de u:  
si couleur\[v\] = blanc: parent\[v\] <- u ; DFS-Visite(v)  
couleur\[u\] <- noir

![title](Images/Picture3.png)

### 4.3 Dijkstra (plus court chemin, poids ≥ 0)

Principe : relaxation itérative des arêtes avec sélection du sommet non traité le plus proche via une file de priorité. Complexité typique : O((V+E) log V) avec tas binaire. Préconditions : poids non négatifs.

Pseudo-code Dijkstra(G, s):  
pour v in V: dist\[v\] <- +inf ; parent\[v\] <- ⌀  
dist\[s\] <- 0 ; PQ <- tas(min)  
insérer(PQ, (0, s))  
tant que PQ non vide:  
(d, u) <- extraire-min(PQ)  
si d > dist\[u\]: continuer  
pour chaque arête (u, v, w):  
si dist\[u\] + w < dist\[v\]:  
dist\[v\] <- dist\[u\] + w ; parent\[v\] <- u  
insérer(PQ, (dist\[v\], v))

![title](Images/Picture4.png)
### 4.4 Kruskal (arbre couvrant minimal)

Principe : tri des arêtes par poids croissant et ajout si les extrémités sont dans des composantes disjointes (Union-Find). Complexité : O(E log E).  
Pseudo-code Kruskal(G):  
T <- ∅ ; initialiser Union-Find sur V  
trier E par poids croissant  
pour (u, v) dans E triées:  
si find(u) ≠ find(v):  
T <- T ∪ {(u,v)} ; union(u, v)  
retourner T  
![title](Images/Picture5.png)
### 4.5 Prim (arbre couvrant minimal)

Principe : croissance d'un sous-ensemble de sommets en choisissant à chaque étape l'arête de coupe minimale via PriorityQueue. Complexité : O(E log V).

Pseudo-code Prim(G, s):  
pour v in V: key\[v\] <- +inf ; parent\[v\] <- ⌀  
key\[s\] <- 0 ; PQ <- tas(min)  
insérer(PQ, (0, s))  
tant que PQ non vide:  
(k, u) <- extraire-min(PQ)  
pour chaque arête (u, v, w):  
si v non inclus et w < key\[v\]:  
key\[v\] <- w ; parent\[v\] <- u  
insérer(PQ, (key\[v\], v))

![title](Images/Picture6.png)

### 4.6 Floyd-Warshall (tous les plus courts chemins)

Principe : DP sur triples boucles mettant à jour la matrice des distances par l'intermédiaire de sommets k. Complexité : O(V^3). Peut être complété d'une matrice des prédécesseurs pour reconstruire les chemins.

Pseudo-code Floyd-Warshall(G):  
initialiser dist\[i\]\[j\] (0 si i=j, w(i,j) sinon, +inf si pas d'arête)  
pour k in V:  
pour i in V:  
pour j in V:  
dist\[i\]\[j\] <- min(dist\[i\]\[j\], dist\[i\]\[k\] + dist\[k\]\[j\])

![title](Images/Picture7.png)
## 5\. Implémentation dans ce projet

Contrôleur REST : endpoints POST à la racine (bfs, dfs, dijkstra, kruskal, prim, floydWarshall) et GET /hello. Chaque POST reçoit Map&lt;String, List<Neighbor&gt;> et renvoie List&lt;Edge&gt;. Les services appelés sont exposés via imports statiques (getBFS, getDFS, getDijkstra, getKruskal, getPrim, getFloydWarshall).

Exemples d'appels:  
POST /dijkstra?start=Bordeaux&end=Lille  
Body: {"Bordeaux":\[{"ville":"Paris","distance":590}\],"Paris":\[{"ville":"Lille","distance":220}\],"Lille":\[\]}  
Réponse: List&lt;Edge&gt; représentant le chemin dans l'ordre

Conversion JSON → Graph : GraphUtils.fromMap(...) crée Vertex/Edge et remplit la liste d'adjacence pour les deux extrémités (symétrique). Implication : les parcours et MST sont traités comme non orientés par défaut. Si un comportement orienté est requis, adapter la construction.

## 6\. Protocole expérimental et résultats

Jeu de données : graphe de villes françaises (ex. Paris, Lille, Rennes, Bordeaux, etc.). Protocole : (i) charger le graphe (front → API), (ii) exécuter chaque algorithme, (iii) collecter mesures : chemin retourné + distance (Dijkstra), coût total (Kruskal/Prim), ordre/edges parcourus (BFS/DFS), matrice des distances (Floyd-Warshall).

| Algorithme | Paramètres | Résultat (ex.) | Mesure (valeur) | Interprétation (qualitative) |
| --- | --- | --- | --- | --- |
| BFS | source=Rennes | Edges parcourues = \[...\] | Niveau max = … | Couverture rapide des voisins |
| DFS | source=Rennes | Edges parcourues = \[...\] | Profondeur max = … | Exploration en profondeur |
| Dijkstra | start=Bordeaux,end=Lille | Chemin = \[Bordeaux, Paris, Lille\] | Distance = 810 | Cohérent avec la carte |
| Kruskal | \-  | Arêtes MST = {...} | Coût total = … | Comparé à Prim, très proche |
| Prim | start=Paris | Arêtes MST = {...} | Coût total = … | Même coût attendu que Kruskal |
| Floyd-Warshall | \-  | Matrice dist\[i\]\[j\] | Δ vs Dijkstra = 0 | All-pairs cohérent |

## 7\. Interprétation des résultats

• BFS vs DFS : BFS optimise la distance en nombre d'arêtes ; DFS privilégie l'exploration profonde - utile pour structure du graphe et détection de cycles.  
• Dijkstra vs Floyd-Warshall : Dijkstra confirme les plus courts chemins point-à-point ; Floyd-Warshall doit retrouver la même distance pour chaque paire (sanity-check).  
• Kruskal vs Prim : sur un même graphe pondéré connecté, les deux renvoient un MST de même coût ; des différences d'arêtes peuvent exister si égalités de poids.

## 8\. Limites et améliorations possibles

• Orientation : la construction actuelle alimente l'adjacence des deux côtés ; pour des graphes orientés, différencier (sortants/entrants).  
• Poids négatifs : prévoir Bellman-Ford si des distances négatives sont introduites ; vérifier la cohérence des services.  
• Validation : détecter doublons d'arêtes, sommets isolés, self-loops ; normaliser la casse des noms de villes.  
• Performance : utiliser PriorityQueue (Dijkstra/Prim), Union-Find optimisé (Kruskal), et profiling sur grands graphes.

## 9\. Conclusion

Le projet consolide la compréhension des parcours, des plus courts chemins et des arbres couvrants, depuis la théorie jusqu'à l'expérimentation. Les résultats attendus (coûts de MST, distances minimales) servent d'oracle pour valider l'implémentation et guider des améliorations futures (orientation, poids négatifs, interface).