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
- [Telegram API]( https://core.telegram.org/api) : API permettant d'envoyer des messages sur Telegram.

### Services internes

- **Calcul gain/perte** : Service permettant de calculer les gains et pertes en fonction des tendances des cryptomonnaies.
- **Reformulation IA** : Service permettant de reformuler les horoscopes pour les rendre plus adaptés à la cryptomonnaie. (Modèle ollama tournant en local, API REST).

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
