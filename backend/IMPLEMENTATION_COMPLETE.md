# Implémentation du Backend AarTangaay

Applications Créées

### 1. **zones_geographiques**
- **Modèle** : `ZoneGeographique` avec les champs ville, rue, numero, latitude, longitude, rayon
- **Relations** : Liste d'habitants (utilisateurs)
- **API Endpoints** :
  - CRUD complet : GET, POST, PUT, DELETE
  - Actions spéciales : ajouter/retirer des habitants

### 2. **vagues_chaleur**
- **Modèle** : `VagueChaleur` avec température_max, intensité, humidité, dates, durée
- **Relations** : Liée à une zone géographique
- **API Endpoints** :
  - CRUD complet
  - Filtrage par zone géographique
  - Récupération des vagues actives

### 3. **notifications**
- **Modèle** : `Notification` avec libelle, type, date_envoi, statut de lecture
- **Relations** : Liée à un utilisateur et une vague de chaleur
- **API Endpoints** :
  - CRUD complet
  - Filtrage par utilisateur
  - Notifications non lues
  - Marquer comme lue

### 4. **recommandations**
- **Modèle** : `Recommandation` avec libelle et description
- **Relations** : Liée à une zone géographique
- **API Endpoints** :
  - CRUD complet
  - Filtrage par zone géographique

### 5. **statistiques**
- **Modèle** : `Statistique` avec température_moyenne et nombre_vague
- **Relations** : Liée à une vague de chaleur (relation 1:1)
- **API Endpoints** :
  - CRUD complet
  - Filtrage par vague de chaleur
  - Résumé global des statistiques

## Améliorations Techniques

### Enum TypeNotification
Ajouté dans `utils/enums.py` :
- SMS
- NOTIFICATION_PUSH  
- EMAIL

### Sérialiseurs Personnalisés
- Sérialiseurs manuels pour tous les modèles (compatible avec MongoEngine)
- Gestion des relations avec validation
- Représentation enrichie des données liées

### ViewSets Complets
- Actions CRUD standard pour tous les modèles
- Actions personnalisées pour des fonctionnalités spécifiques
- Gestion d'erreurs appropriée
- Filtrage et recherche

### Configuration URLs
- Routage automatique avec Django REST Framework
- Documentation Swagger/OpenAPI intégrée
- URLs organisées par application

## Endpoints API Disponibles

### Zones Géographiques
- `GET/POST /api/zones-geographiques/`
- `GET/PUT/DELETE /api/zones-geographiques/{id}/`
- `POST /api/zones-geographiques/{id}/ajouter_habitant/`
- `DELETE /api/zones-geographiques/{id}/retirer_habitant/`

### Vagues de Chaleur
- `GET/POST /api/vagues-chaleur/`
- `GET/PUT/DELETE /api/vagues-chaleur/{id}/`
- `GET /api/vagues-chaleur/par_zone/?zone_id={id}`
- `GET /api/vagues-chaleur/actives/`

### Notifications
- `GET/POST /api/notifications/`
- `GET/PUT/DELETE /api/notifications/{id}/`
- `GET /api/notifications/par_utilisateur/?utilisateur_id={id}`
- `GET /api/notifications/non_lues/?utilisateur_id={id}`
- `PATCH /api/notifications/{id}/marquer_comme_lue/`

### Recommandations
- `GET/POST /api/recommandations/`
- `GET/PUT/DELETE /api/recommandations/{id}/`
- `GET /api/recommandations/par_zone/?zone_id={id}`

### Statistiques
- `GET/POST /api/statistiques/`
- `GET/PUT/DELETE /api/statistiques/{id}/`
- `GET /api/statistiques/par_vague/?vague_id={id}`
- `GET /api/statistiques/resume_global/`

## Documentation API

La documentation Swagger est disponible aux URLs :
- `/swagger/` - Interface Swagger UI
- `/redoc/` - Interface ReDoc
- `/swagger.json` - Schéma JSON

## Instructions de Démarrage

1. **Activer l'environnement virtuel** :
   ```bash
   source .venv/bin/activate
   ```

2. **Démarrer le serveur** :
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

3. **Accéder à la documentation** :
   - Swagger UI : http://localhost:8000/swagger/
   - API Root : http://localhost:8000/api/

## Base de Données

Le projet utilise MongoDB avec MongoEngine. La configuration est déjà présente dans `settings.py` pour se connecter à une instance MongoDB.

## Tests

Le serveur a été testé et fonctionne correctement. Tous les endpoints sont accessibles et la documentation Swagger est générée automatiquement.

## Conformité au Diagramme

L'implémentation respecte fidèlement le diagramme de classe fourni :
- Toutes les entités sont implémentées
- Les relations sont correctement établies
- Les types de données correspondent
- L'enum TypeNotification est implémenté
