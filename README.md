# Crypt'Oracle

Projet réalisé dans le cadre du cours de LO10 - Architecture Orientée Services.
Membres de l'équipe :

- Florian Bonelli
- Florian Chaffard
- Luna Schenk

## Description

### "Un service alliant le suivi des tendances cryptos et la parodie de l’imprédictibilité des marchés."

Le projet a pour but de créer un site web permettant de **visualiser les tendances des cryptomonnaies**, les actualités liées à celles-ci ainsi que d'obtenir des **prédictions personnalisées** basées sur des informations personnelles de l'utilisateur. Le projet joue sur **l’illusion de la prédiction pour critiquer le caractère imprévisible des marchés.**

Nous voulons également permettre à l'utilisateur de s'informer sur les tendances en cryptomonnaie tout en **améliorant la transparence des gains et des pertes réelles** en fonction des tendances des différentes cryptomonnaies. Cela permet de **sensibiliser aux risques liés à l’investissement** dans les cryptomonnaies et à leur caractère imprévisible.

## Services utilisés

### Services externes

- [Horoscope API](https://horoscope-app-api.vercel.app/) : API permettant de récupérer les horoscopes quotidiens pour chaque signe astrologique.
- [Binance API](https://github.com/binance/binance-spot-api-docs) : API permettant de récupérer les données financières des cryptomonnaies.
- [CoinTelegraph RSS](https://cointelegraph.com/rss) : Flux RSS permettant de récupérer les actualités liées aux cryptomonnaies.

### Services internes

- **Calcul gain/perte** : Service permettant de calculer les gains et pertes en fonction des tendances des cryptomonnaies.
- **Reformulation IA** : Service permettant de reformuler les horoscopes pour les rendre plus adaptés à la cryptomonnaie. (Modèle ollama tournant en local, API REST).
- **CouchDB** : Base de données NoSQL permettant de stocker les données des utilisateurs.

## Patrons de conception utilisés

### Reverse Proxy

Notre projet utilise un reverse proxy NGINX afin de centraliser et sécuriser l'accès à l'ensemble des services, qu'ils soient internes (API de prédiction, calculs, IA) ou externes (Binance, Horoscope, CoinTelegraph). Grâce à NGINX, toutes les requêtes des utilisateurs transitent par un point d'entrée unique, ce qui facilite la configuration du CORS ou encore la maintenance en cas de modification des services consommés. De plus, cela permet de simplifier l'architecture en masquant la complexité des différents services et en assurant une meilleure évolutivité et maintenance du projet.

### MediaType Negotiation

Le projet utilise la négociation de type média pour permettre aux clients de spécifier le format de réponse souhaité (JSON ou XML) lors des appels aux API. Cela permet d'offrir une flexibilité aux utilisateurs et de s'adapter à différents cas d'utilisation. En fonction du type de contenu demandé, le serveur renvoie la réponse dans le format approprié, facilitant ainsi l'intégration avec différents clients et langages de programmation.

### Tolerant Reader

Le projet utilise le patron de conception Tolerant Reader pour gérer les variations dans les réponses des API externes. En raison de la nature dynamique des données financières et des horoscopes, il est possible que certaines informations soient manquantes ou diffèrent légèrement d'une réponse à l'autre. En adoptant ce patron, nous avons conçu notre code pour être résilient face à ces variations, en s'assurant que même si certaines données sont absentes ou modifiées, le système continue de fonctionner correctement et de fournir une expérience utilisateur fluide.

## Le lancer

### Prérequis

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
```

### Lancer le frontend

```bash
cd frontend
npm start
```

### Lancer le backend

Depuis la racine du projet :

```bash
docker-compose up
```
