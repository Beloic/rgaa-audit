# Administration RGAA Audit - Bêta Fermée

## Vue d'ensemble

Cette application dispose d'un système de login en bêta fermée avec suivi complet des visiteurs et statistiques administratives.

## Système de Login Bêta

### Mot de passe d'accès
- **Mot de passe par défaut** : `RGAA_Audit_2025!Beta#Secure`
- **Configuration** : Variable d'environnement `NEXT_PUBLIC_BETA_PASSWORD`
- **Sécurité** : Mot de passe complexe avec caractères spéciaux

### Fonctionnalités de sécurité
- Session persistante avec localStorage
- Gestion d'erreurs détaillée
- Interface utilisateur moderne et accessible
- Protection de toutes les pages (accueil, blog, quiz)

## Système de Statistiques

### Données collectées
- **IP des visiteurs** (pour comptage unique)
- **User-Agent** (navigateur/système)
- **Timestamp** de chaque tentative
- **Succès/Échec** des connexions
- **Raison des échecs** (mot de passe incorrect, erreur système)

### Métriques disponibles
- Nombre total de tentatives
- Connexions réussies vs échecs
- Visiteurs uniques (basé sur IP)
- Taux de succès global
- Activité des dernières 24h
- Activité des 7 derniers jours
- Graphique quotidien d'activité

## Page d'Administration

### Accès
- **URL** : `/admin`
- **Mot de passe admin par défaut** : `RGAAAudit2025Admin!Stats`
- **Configuration** : Variables `NEXT_PUBLIC_ADMIN_PASSWORD` et `ADMIN_STATS_PASSWORD`

### Interface administrateur
- **Dashboard complet** avec métriques clés
- **Graphiques d'activité** quotidienne
- **Journal des visiteurs** (50 derniers)
- **Actualisation automatique** (toutes les 30 secondes)
- **Interface responsive** adaptée mobile/desktop

### Données affichées
1. **Cartes statistiques principales**
   - Visiteurs uniques
   - Tentatives totales
   - Connexions réussies
   - Taux de succès

2. **Analyse temporelle**
   - Activité des dernières 24h
   - Activité des 7 derniers jours

3. **Graphique d'activité**
   - Barres de progression par jour
   - Répartition succès/échecs

4. **Journal détaillé**
   - Date/heure de chaque tentative
   - Adresse IP du visiteur
   - Statut (succès/échec)
   - Raison de l'échec
   - Navigateur utilisé

## Configuration

### Variables d'environnement requises

```bash
# Mot de passe bêta utilisateur
NEXT_PUBLIC_BETA_PASSWORD=RGAA_Audit_2025!Beta#Secure

# Mots de passe administrateur
NEXT_PUBLIC_ADMIN_PASSWORD=RGAAAudit2025Admin!Stats
ADMIN_STATS_PASSWORD=RGAAAudit2025Admin!Stats
```

### Fichiers de données
- **Emplacement** : `data/visitor-stats.json`
- **Format** : JSON avec historique complet
- **Sécurité** : Exclu du contrôle de version (`.gitignore`)
- **Limite** : 1000 entrées maximum (rotation automatique)

## API de Statistiques

### Endpoint `/api/stats`

#### POST - Enregistrer une tentative
```typescript
{
  success: boolean,
  failureReason?: string
}
```

#### GET - Récupérer les statistiques
- **Autorisation** : Header `x-admin-password` requis
- **Réponse** : Données complètes avec analytics

### Sécurité API
- Protection par mot de passe admin
- Validation des données d'entrée
- Gestion d'erreurs robuste
- Logs d'activité

## Déploiement

### Variables d'environnement production
1. Changer tous les mots de passe par défaut
2. Utiliser des mots de passe encore plus complexes
3. Configurer les variables dans votre plateforme de déploiement

### Recommandations sécurité
- **Mots de passe forts** : Minimum 20 caractères
- **Rotation régulière** des mots de passe
- **Monitoring** des tentatives d'accès
- **Sauvegarde** régulière du fichier de stats

### Exemple variables production
```bash
NEXT_PUBLIC_BETA_PASSWORD=VotreMotDePasseSuperComplexe123!@#
NEXT_PUBLIC_ADMIN_PASSWORD=AdminPasswordTresSecurise456$%^
ADMIN_STATS_PASSWORD=AdminPasswordTresSecurise456$%^
```

## Support

Pour toute question ou assistance :
- **Email** : hello@loicbernard.com
- **Demande d'accès bêta** : Contactez l'email ci-dessus

## Notes techniques

- **Next.js 15.3.3** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour l'interface
- **Lucide React** pour les icônes
- **Stockage local** pour les statistiques (JSON)
- **API Routes** pour les endpoints backend 