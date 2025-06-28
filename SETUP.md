# Configuration du système de stockage

## Modes de fonctionnement

L'application supporte deux modes de stockage des utilisateurs :

### 1. Mode localStorage (Développement)
- **Quand** : `NODE_ENV !== 'production'` et `NEXT_PUBLIC_USE_API !== 'true'`
- **Stockage** : Navigateur (localStorage)
- **Usage** : Développement local uniquement

### 2. Mode API/Fichiers (Production)
- **Quand** : `NODE_ENV === 'production'` ou `NEXT_PUBLIC_USE_API === 'true'`
- **Stockage** : Fichiers JSON côté serveur
- **Usage** : Production et tests avec données persistantes

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` avec :

```bash
# Configuration de l'authentification
NEXT_PUBLIC_USE_API=false  # true pour forcer l'utilisation de l'API

# Configuration Mailjet (optionnel)
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
```

### Structure des fichiers (Mode API)

```
rgaa-audit-app/
├── data/              # Créé automatiquement
│   ├── users.json     # Données des utilisateurs
│   └── audits.json    # Historique des audits
```

## API Routes

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/user/update` - Mise à jour utilisateur

### Format des données

**users.json** :
```json
{
  "users": {
    "email@example.com": {
      "id": "user-123",
      "email": "email@example.com",
      "name": "Nom Utilisateur",
      "password": "hash...",
      // ... autres données utilisateur
    }
  }
}
```

## Migration localStorage → API

Pour migrer les données existantes :

1. Exportez les données localStorage
2. Configurez `NEXT_PUBLIC_USE_API=true`
3. Redémarrez l'application
4. Les données seront créées via l'API

## Sécurité

⚠️ **Important pour la production** :
- Les mots de passe sont hachés avec SHA-256 + salt
- Le dossier `data/` ne doit pas être accessible publiquement
- Configurez les permissions serveur appropriées
- Considérez l'usage d'une vraie base de données pour un usage intensif 