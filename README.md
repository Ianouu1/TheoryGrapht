# 🧩 Architecture du projet

L’architecture adoptée pour ce projet suit une organisation modulaire afin de séparer clairement les responsabilités :

```
org.theorygrapht
├── controller       → contient les classes REST exposant les routes de l’API
├── model            → regroupe les structures de données principales (Graph, Node, Edge)
├── service          → implémente les algorithmes de graphes (BFS, DFS, Dijkstra, Kruskal, etc.)
└── util             → fournit des outils complémentaires (chargement JSON, fonctions utilitaires, etc.)
```
Cette structure favorise la lisibilité, la maintenabilité et l’évolutivité du code en isolant la logique métier, les modèles de données et les points d’entrée de l’API.
