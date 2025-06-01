# CTF Platform for Wireless & IoT Security

Une plateforme gamifiée d'entraînement à la cybersécurité dans les réseaux sans fil et les objets connectés.

## 🎯 Objectifs

- Créer un environnement sécurisé pour expérimenter les attaques/défenses spécifiques à la sécurité sans fil et IoT
- Favoriser l'apprentissage actif par la résolution de défis pratiques
- Promouvoir une culture de la sécurité offensive et défensive
- Développer une plateforme modulaire et open source

## 🏗️ Structure du Projet

```
/ctf-platform
  /frontend         # React + Tailwind UI
  /backend          # Flask + PostgreSQL
  /challenges       # Fichiers PCAP, firmwares, scripts
  /docker           # Dockerfiles et configurations
  /docs             # Documentation technique et pédagogique
```

## 🚀 Installation

### Prérequis

- Docker et Docker Compose
- Node.js (v16+)
- Python (v3.8+)
- PostgreSQL

### Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
cd ctf-platform
```

2. Installer les dépendances frontend
```bash
cd frontend
npm install
```

3. Installer les dépendances backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou `venv\Scripts\activate` sur Windows
pip install -r requirements.txt
```

4. Lancer avec Docker Compose
```bash
docker-compose up -d
```

## 🎮 Utilisation

1. Accéder à l'interface web : http://localhost:3000
2. Créer un compte ou se connecter
3. Commencer à résoudre les challenges !

## 📚 Documentation

La documentation complète est disponible dans le dossier `/docs` :
- Guide d'installation
- Guide de création de challenges
- Documentation technique
- Fiches pédagogiques

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez notre guide de contribution dans `/docs/CONTRIBUTING.md`.

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 