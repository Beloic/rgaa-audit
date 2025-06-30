# Configuration Supabase pour RGAA Audit

## Variables d'environnement nécessaires

Ajoutez ces variables à votre fichier `.env.local` ou `.env` :

```bash
# Configuration Supabase pour l'authentification
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optionnel - pour les opérations admin
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Autres variables existantes
MAILJET_API_KEY=your-mailjet-api-key
MAILJET_SECRET_KEY=your-mailjet-secret-key
MAILJET_SENDER_EMAIL=your-sender@email.com
MAILJET_SENDER_NAME="RGAA Audit"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez l'URL et la clé anonyme dans Settings > API

### 2. Exécuter le script SQL

1. Dans votre dashboard Supabase, allez dans l'éditeur SQL
2. Copiez/collez le contenu du fichier `supabase-setup.sql`
3. Exécutez le script pour créer la table `users`

### 3. Configuration des politiques RLS

Le script crée automatiquement les politiques Row Level Security pour sécuriser l'accès aux données.

### 4. Tester la configuration

Une fois les variables d'environnement configurées et la table créée, l'authentification fonctionnera automatiquement.

## Migration depuis Prisma

L'application utilise maintenant Supabase au lieu de Prisma pour :
- Authentification (login/register)
- Gestion des utilisateurs
- Stockage des données de profil

## Avantages de Supabase

- ✅ Pas de configuration de base de données locale
- ✅ Fonctionne directement en production
- ✅ Interface d'administration intégrée
- ✅ Backup automatique
- ✅ Scaling automatique
- ✅ RLS (Row Level Security) intégré 