# livrable-niaina

Module 1 — Structure et réutilisabilité du code
Durée : 2 heures
La mise en place de l’architecture du projet ainsi que la conception de composants réutilisables ont nécessité un temps conséquent. L’objectif était d’assurer une base de code propre, maintenable et facilement extensible, notamment côté frontend.

Module 2 — Développement Backend
Durée : 1 heure 30 minutes
La structuration du backend a été réalisée avec succès. Toutefois, des difficultés ont été rencontrées lors des phases de test avec la base de données PostgreSQL, notamment au niveau de la configuration et de la connexion.

Module 3 — Intégration d’API
Durée : 2 heures 30 minutes
Une tentative d’intégration d’API a été effectuée. Cependant, en raison de problèmes techniques non résolus dans les délais impartis, cette fonctionnalité n’a pas été finalisée ni présentée dans la version actuelle du projet.

Module 4 — Gestion des appels et traitement PDF
Durée : 2 heures
Des difficultés ont été rencontrées concernant les appels de fonctions et le traitement des fichiers PDF. À ce stade, la fonctionnalité de lecture des fichiers PDF n’est pas encore opérationnelle et nécessite des améliorations supplémentaires.

Conclusion

Le projet a permis de mettre en place une base technique solide, malgré certaines difficultés rencontrées, notamment sur l’intégration d’API et le traitement des fichiers PDF. Des améliorations sont prévues pour finaliser ces parties et renforcer la stabilité globale de l’application.



Choix d’architecture et organisation du projet

Pour garantir une application maintenable, sécurisée et évolutive, j’ai adopté une architecture modulaire en séparant les différentes responsabilités du projet.

Configuration de la base de données
La configuration de la base de données a été isolée dans un fichier dédié.
Cela permet :
une meilleure maintenabilité (modifications centralisées)
une réutilisation simplifiée dans plusieurs parties de l’application
une meilleure sécurité, notamment pour la gestion des variables sensibles (via .env)

Utilisation d’un dossier utils
Un dossier utils a été mis en place afin de regrouper les fonctions réutilisables dans l’application.
Objectifs :
éviter la duplication de code
centraliser les fonctionnalités communes (ex : JWT, hashage, validation)
améliorer la lisibilité et la structure globale du projet

Séparation server et app
La séparation entre server.js et app.js permet une meilleure organisation :
app.js : configuration de l’application (middlewares, routes, etc.)
server.js : lancement du serveur
Cela rend le code :
plus clair
plus testable
plus scalable (facile à faire évoluer)

Sécurité : JWT et bcrypt
Pour sécuriser l’application :
JWT (JSON Web Token) est utilisé pour l’authentification et la gestion des sessions
bcrypt est utilisé pour le hashage des mots de passe
Cela garantit :
la protection des données utilisateurs
une authentification sécurisée
 
Organisation du Frontend (UI)
Les composants UI ont été séparés afin d’assurer :
une cohérence visuelle sur toute l’application
une réutilisation des composants (inputs, boutons, etc.)
un rendu plus professionnel

Découpage en étapes (steps)
L’application a été structurée en plusieurs étapes (wizard) :
permet un code plus lisible et organisé
facilite la maintenance
rend le flux utilisateur plus clair
Utilisation des interfaces (types)
Des interfaces/types ont été définis pour :
structurer les données
éviter les erreurs
améliorer la compréhension du code
Cela renforce la robustesse et la qualité du développement


Conclusion
Cette architecture permet d’obtenir une application :
bien structurée
sécurisée
maintenable
évolutive
Elle facilite également le travail en équipe et l’ajout de nouvelles fonctionnalités à long terme.
