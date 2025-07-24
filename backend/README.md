# AarTangaay

Projet Django utilisant MongoEngine pour MongoDB.

## Prérequis

- Python 3.11+
- Docker (optionnel mais recommandé)
- MongoDB

## Installation

1. **Cloner le dépôt**

```bash
git clone <https://github.com/AarTangaay/aarTangaay>
cd AarTangaay
```

2. **Installer les dépendances**

```bash
pip install -r requirements.txt
```

3. **Configurer la base de données**

Le projet utilise MongoDB via MongoEngine. Les paramètres de connexion sont définis dans [`AarTangaay/settings.py`](AarTangaay/settings.py) :

```python
connect(
    db='aartangaay_db',
    host='mongo',
    port=27017,
    username='root',
    password='at_db$',
    authentication_source='admin',
)
```

Adapte-les selon ton environnement si besoin.

## Utilisation avec Docker

1. **Construire et lancer les conteneurs**

```bash
docker-compose up --build
```

2. **Accéder à l’application**

L’application Django sera disponible sur [http://localhost:8000](http://localhost:8000).

## Lancer le serveur en local

```bash
python manage.py migrate
python manage.py runserver
```

## API

Le projet utilise Django REST Framework. Les endpoints sont à définir dans tes applications.

## Structure du projet

- `AarTangaay/` : code source principal Django
- `requirements.txt` : dépendances Python
- `docker-compose.yml` : configuration Docker

## Licence

MIT

---

**Auteurs** :
Dr EPL