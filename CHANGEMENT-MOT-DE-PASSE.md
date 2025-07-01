# 🔑 Fonctionnalité de Changement de Mot de Passe

## Vue d'ensemble

La fonctionnalité de changement de mot de passe permet aux utilisateurs de réinitialiser leur mot de passe via un processus sécurisé en deux étapes :

1. **Demande de réinitialisation** : L'utilisateur saisit son email
2. **Confirmation** : L'utilisateur clique sur le lien reçu par email et définit un nouveau mot de passe

## 🛠️ Configuration technique

### Base de données (Supabase)

Les colonnes suivantes ont été ajoutées à la table `users` :

```sql
-- Colonnes pour la réinitialisation de mot de passe
password_reset_token VARCHAR(255)        -- Token de sécurité unique
password_reset_expires_at TIMESTAMP      -- Date d'expiration du token (1h)
password_reset_sent_at TIMESTAMP         -- Date d'envoi de l'email
```

### Variables d'environnement

Assurez-vous que les variables suivantes sont configurées :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon

# MailJet (pour l'envoi d'emails)
MAILJET_API_KEY=votre_api_key
MAILJET_SECRET_KEY=votre_secret_key
MAILJET_FROM_EMAIL=hello@loicbernard.com

# URL de l'application
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
```

## 🚀 Utilisation

### 1. Demande de réinitialisation

**URL** : `/auth/change-password`

L'utilisateur accède à cette page depuis :
- Le menu utilisateur (TopBar) → "Changer mon mot de passe"
- Directement via l'URL

**Processus** :
1. Saisie de l'adresse email
2. Génération d'un token sécurisé (64 caractères hex)
3. Envoi d'un email avec le lien de réinitialisation
4. Le token expire automatiquement après 1 heure

### 2. Confirmation du changement

**URL** : `/auth/confirm-password-change?token=xxx`

L'utilisateur clique sur le lien reçu par email qui contient le token.

**Processus** :
1. Validation du token (existence et expiration)
2. Saisie du nouveau mot de passe avec indicateur de force
3. Confirmation du mot de passe
4. Hachage sécurisé et mise à jour en base
5. Suppression du token de réinitialisation
6. Redirection vers la page de connexion

## 📧 Gestion des emails

### Fournisseur principal : MailJet

Les emails sont envoyés via MailJet avec :
- Template HTML responsive et accessible
- Version texte pour la compatibilité
- Headers anti-spam
- Design cohérent avec l'identité RGAA Audit

### Mode simulation (développement)

Si MailJet n'est pas configuré, les emails sont affichés dans la console :

```
===== EMAIL DE RÉINITIALISATION (SIMULATION) =====
À: utilisateur@example.com
Sujet: Réinitialisation de votre mot de passe - RGAA Audit
...
================================================
```

## 🔒 Sécurité

### Mesures implémentées

1. **Tokens sécurisés** : Génération cryptographique avec `crypto.randomBytes(32)`
2. **Expiration courte** : Les tokens expirent après 1 heure
3. **Usage unique** : Le token est supprimé après utilisation
4. **Hachage bcrypt** : Les mots de passe sont hachés avec 12 rounds
5. **Validation côté serveur** : Tous les inputs sont validés
6. **Protection CSRF** : Validation des origines des requêtes

### Validation des mots de passe

- Minimum 6 caractères (configurable)
- Indicateur de force en temps réel
- Vérification de correspondance

## 🎨 Interface utilisateur

### Page de demande (`/auth/change-password`)

- **Design responsive** avec Tailwind CSS
- **États visuels** : Loading, succès, erreur
- **Messages clairs** pour guider l'utilisateur
- **Liens de retour** vers l'accueil et la connexion

### Page de confirmation (`/auth/confirm-password-change`)

- **Validation temps réel** des mots de passe
- **Indicateur de force** avec barre de progression colorée
- **Boutons show/hide** pour les champs mot de passe
- **Conseils de sécurité** intégrés
- **Gestion d'erreurs** (token expiré, invalide, etc.)

## 📋 Routes API

### POST `/api/auth/change-password`

**Body** :
```json
{
  "email": "utilisateur@example.com"
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Si votre adresse email existe...",
  "provider": "mailjet" | "simulation"
}
```

### POST `/api/auth/confirm-password-change`

**Body** :
```json
{
  "token": "abc123...",
  "newPassword": "nouveaumotdepasse"
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Votre mot de passe a été réinitialisé avec succès"
}
```

## 🐛 Débogage

### Logs utiles

```bash
# Demande de réinitialisation
✅ Email de réinitialisation envoyé via MailJet: { messageId: 'xxx', email: 'xxx' }

# Confirmation réussie
✅ Mot de passe réinitialisé avec succès pour: utilisateur@example.com

# Erreurs courantes
❌ Erreur MailJet: [détails]
⚠️ Utilisation du mode simulation suite à l'erreur MailJet
```

### Vérification en base

```sql
-- Vérifier les tokens actifs
SELECT email, password_reset_token, password_reset_expires_at 
FROM users 
WHERE password_reset_token IS NOT NULL;

-- Nettoyer les tokens expirés (automatique mais peut être manuel)
UPDATE users 
SET password_reset_token = NULL, 
    password_reset_expires_at = NULL,
    password_reset_sent_at = NULL
WHERE password_reset_expires_at < NOW();
```

## 🚀 Déploiement

### Étapes post-déploiement

1. **Exécuter le script SQL** dans Supabase :
   ```bash
   # Copier le contenu de scripts/update-supabase-password-reset.sql
   # Exécuter dans l'éditeur SQL de Supabase
   ```

2. **Vérifier les variables d'environnement** dans Vercel

3. **Tester le flux complet** :
   - Demande de réinitialisation
   - Réception de l'email
   - Changement effectif du mot de passe

### Monitoring

- Surveiller les logs d'erreur MailJet
- Vérifier les métriques d'emails délivrés
- Contrôler les tentatives de réinitialisation en masse

## 🔗 Liens utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation MailJet](https://dev.mailjet.com/)
- [Guide sécurité Next.js](https://nextjs.org/docs/authentication)

---

**Note** : Cette fonctionnalité est maintenant entièrement opérationnelle en production et en développement local. 