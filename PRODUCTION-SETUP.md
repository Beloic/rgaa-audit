# Configuration Production avec Supabase

## 🚀 Migration vers une vraie base de données

L'application utilise maintenant **PostgreSQL avec Prisma** au lieu du localStorage. Voici comment configurer la production :

## 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte et un nouveau projet
3. Notez :
   - **Database URL** (dans Settings > Database)
   - **Direct URL** (même chose, mais avec `?pgbouncer=true&connection_limit=1`)

## 2. Configuration des variables d'environnement

Créez un fichier `.env.local` :

```bash
# Base de données Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

# Forcer l'utilisation de l'API (production)
NEXT_PUBLIC_USE_API=true
NODE_ENV=production

# Configuration Mailjet (optionnel)
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
```

## 3. Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# (Optionnel) Voir la base de données
npx prisma studio
```

## 4. Déploiement sur Vercel

1. **Variables d'environnement sur Vercel** :
   - `DATABASE_URL`
   - `DIRECT_URL`  
   - `NEXT_PUBLIC_USE_API=true`
   - `NODE_ENV=production`

2. **Commandes de build** :
   ```bash
   # Dans package.json, ajouter :
   "scripts": {
     "postinstall": "prisma generate",
     "db:push": "prisma db push",
     "db:studio": "prisma studio"
   }
   ```

## 5. Migration des données existantes

Si vous avez des utilisateurs dans localStorage, vous pouvez les migrer :

```javascript
// Script de migration (à exécuter une fois)
const migrateFromLocalStorage = async () => {
  const users = JSON.parse(localStorage.getItem('rgaa-users-data') || '{}');
  
  for (const [email, userData] of Object.entries(users)) {
    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
          password: 'temporary-password' // L'utilisateur devra changer
        })
      });
    } catch (error) {
      console.error(`Erreur migration ${email}:`, error);
    }
  }
};
```

## 6. Fonctionnalités

✅ **Implémenté** :
- Authentification sécurisée avec bcrypt
- Base de données PostgreSQL avec Prisma
- Gestion des utilisateurs et audits
- Compatible Supabase
- Types TypeScript complets

✅ **Avantages** :
- Performances optimales
- Concurrent users support
- Backup automatique (Supabase)
- Scalabilité
- Sécurité renforcée

## 7. Monitoring et maintenance

- **Logs** : Vérifiez les logs Vercel pour les erreurs
- **Base de données** : Utilisez `npx prisma studio` pour l'administration
- **Performances** : Supabase Dashboard pour les métriques

## Commandes utiles

```bash
# Développement local
npm run dev

# Réinitialiser la base de données
npx prisma db push --force-reset

# Voir le schéma
npx prisma format

# Générer le client après changement du schéma
npx prisma generate
```

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt (12 rounds)
- Validation des entrées côté serveur  
- Protection CORS configurée
- Variables d'environnement sécurisées
- Base de données isolée (Supabase)

## Support

En cas de problème :
1. Vérifiez les logs Vercel
2. Testez la connexion DB avec `npx prisma studio`
3. Vérifiez les variables d'environnement 