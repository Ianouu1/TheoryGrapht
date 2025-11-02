# 🛠️ Technologies utilisées

## Backend
- **Java 20** : Langage de programmation principal pour le backend
- **Spring Boot 3.3.4** : Framework pour créer des applications Java standalone et production-ready
- **Spring Web** : Module Spring pour créer des APIs REST
- **Maven** : Outil de gestion de dépendances et de build
- **SpringDoc OpenAPI 2.6.0** : Documentation automatique de l'API REST (Swagger UI)

## Frontend
- **React 19.2.0** : Bibliothèque JavaScript pour construire l'interface utilisateur
- **TypeScript 5.9.3** : Superset typé de JavaScript
- **Vite 7.1.7** : Build tool et dev server rapide pour les projets frontend modernes
- **D3.js 7.9.0** : Bibliothèque JavaScript pour la visualisation de données (graphes)
- **Axios 1.12.2** : Client HTTP pour les appels API
- **ESLint 9.36.0** : Linter pour maintenir la qualité du code JavaScript/TypeScript

## Outils de développement
- **Node.js** : Environnement d'exécution JavaScript pour le frontend
- **npm** : Gestionnaire de paquets pour le frontend
- **TypeScript ESLint** : Plugin ESLint pour TypeScript
- **Vite Plugin React** : Plugin Vite pour supporter React avec Fast Refresh

---

# 🧩 Architecture du projet

L'architecture adoptée pour ce projet suit une organisation modulaire afin de séparer clairement les responsabilités :

```
org.theorygrapht
├── controller       → contient les classes REST exposant les routes de l'API
├── model            → regroupe les structures de données principales (Graph, Node, Edge)
├── service          → implémente les algorithmes de graphes (BFS, DFS, Dijkstra, Kruskal, etc.)
└── util             → fournit des outils complémentaires (chargement JSON, fonctions utilitaires, etc.)
```
Cette structure favorise la lisibilité, la maintenabilité et l'évolutivité du code en isolant la logique métier, les modèles de données et les points d'entrée de l'API.
