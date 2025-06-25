# Audit d'Accessibilité RGAA/WCAG

Une application web moderne pour effectuer des audits d'accessibilité automatisés selon les standards RGAA (Référentiel Général d'Amélioration de l'Accessibilité) et WCAG (Web Content Accessibility Guidelines) en utilisant l'intelligence artificielle de ChatGPT.

## 🚀 Fonctionnalités

- **Analyse exhaustive** : Audit complet selon les **106 critères RGAA 4.1** via l'API OpenAI
- **Couverture totale WCAG 2.1** : Tous les niveaux A, AA et AAA analysés
- **Standards RGAA/WCAG** : Conformité aux référentiels français et internationaux
- **Interface multilingue** : Support français et anglais
- **Analyse flexible** : Analyse par URL ou code HTML direct
- **Rapports détaillés** : Résultats structurés avec recommandations techniques précises
- **Interface moderne** : Design responsive avec Tailwind CSS
- **Sécurité intégrée** : Sanitisation HTML et rate limiting

## 🛠️ Technologies

- **Frontend** : Next.js 14, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, Node.js
- **IA** : OpenAI GPT-3.5-turbo API
- **Sécurité** : DOMPurify, JSDOM, Rate limiting
- **UI** : Lucide React icons, Headless UI

## 📋 Prérequis

- Node.js 18+ et npm
- Clé API OpenAI (GPT-3.5-turbo access requis)

## 🔧 Installation

1. **Cloner le projet**
   \`\`\`bash
   git clone <url-du-repo>
   cd rgaa-audit-app
   \`\`\`

2. **Installer les dépendances**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configuration des variables d'environnement**
   \`\`\`bash
   cp env.example .env.local
   \`\`\`

   Éditer le fichier \`.env.local\` :
   \`\`\`env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   \`\`\`

4. **Lancer l'application**
   \`\`\`bash
   npm run dev
   \`\`\`

   L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🎯 Utilisation

### Analyse par URL
1. Sélectionner "URL" dans le formulaire
2. Entrer l'URL de la page à analyser
3. Choisir la langue d'analyse (FR/EN)
4. Cliquer sur "Analyser l'accessibilité"

### Analyse par code HTML
1. Sélectionner "HTML" dans le formulaire
 2. Coller le code HTML (max 1MB)
3. Choisir la langue d'analyse
4. Lancer l'analyse

### Résultats
L'audit génère un rapport comprenant :
- **Score global** sur 100
- **Statistiques** par niveau WCAG et impact
- **Liste détaillée** des non-conformités
- **Recommandations** pour chaque problème

## 📊 Critères d'Audit

L'application analyse selon les critères RGAA 4.1 et WCAG 2.1 :

### Domaines d'analyse
- **Images** : Alternatives textuelles, descriptions
- **Couleurs** : Contrastes, information par la couleur
- **Multimédia** : Transcriptions, sous-titres
- **Tableaux** : Structure, en-têtes
- **Liens** : Intitulés explicites
- **Scripts** : Accessibilité au clavier
- **Éléments obligatoires** : Titre, langue
- **Structure** : Hiérarchie des titres
- **Formulaires** : Labels, aide à la saisie
- **Navigation** : Mécanismes de navigation

### Niveaux de conformité
- **A** : Niveau de base
- **AA** : Niveau standard (requis légalement)
- **AAA** : Niveau avancé

### Impacts
- **Critique** : Bloque complètement l'accès
- **Élevé** : Rend l'accès très difficile
- **Moyen** : Complique l'utilisation
- **Faible** : Problème mineur

## 🔒 Sécurité

- **Sanitisation HTML** : DOMPurify nettoie le contenu
- **Rate limiting** : 10 requêtes/heure par IP
- **Validation** : Contrôles stricts des entrées
- **Timeout** : Limite de 60 secondes par requête

## 📁 Structure du projet

\`\`\`
rgaa-audit-app/
├── src/
│   ├── app/
│   │   ├── api/analyze/route.ts    # API d'analyse
│   │   └── page.tsx                # Page principale
│   ├── components/
│   │   ├── AuditForm.tsx           # Formulaire d'audit
│   │   └── AuditResults.tsx        # Affichage des résultats
│   ├── lib/
│   │   ├── constants.ts            # Constantes RGAA/WCAG
│   │   ├── html-utils.ts           # Utilitaires HTML
│   │   └── openai-utils.ts         # Intégration OpenAI
│   └── types/
│       └── audit.ts                # Types TypeScript
├── env.example                     # Variables d'environnement
└── README.md
\`\`\`

## 🤖 Exemples de prompts

L'application génère automatiquement des prompts structurés pour GPT-3.5-turbo :

### Prompt système (français)
\`\`\`
Tu es un expert en accessibilité numérique spécialisé dans les audits RGAA et WCAG.
Analyse le code HTML fourni et identifie toutes les non-conformités selon les critères RGAA et WCAG.
[...critères détaillés...]
\`\`\`

### Réponse attendue
\`\`\`json
{
  "violations": [
    {
      "criterion": "1.1",
      "level": "A",
      "description": "Images sans alternative textuelle",
      "element": "img[src='image.jpg']",
      "recommendation": "Ajouter un attribut alt descriptif",
      "impact": "high"
    }
  ],
  "summary": "L'audit révèle 5 problèmes majeurs...",
  "score": 75
}
\`\`\`

## 🚀 Déploiement

### Vercel (recommandé)
\`\`\`bash
npm run build
vercel --prod
\`\`\`

### Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit les changements (\`git commit -m 'Add AmazingFeature'\`)
4. Push sur la branche (\`git push origin feature/AmazingFeature\`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier \`LICENSE\` pour plus de détails.

## 🆘 Support

- **Documentation RGAA** : [rgaa.numerique.gouv.fr](https://rgaa.numerique.gouv.fr/)
- **WCAG Guidelines** : [w3.org/WAI/WCAG21](https://www.w3.org/WAI/WCAG21/)
- **Ressource de référence** : [boscop.fr/audit-rgaa-wcag](https://boscop.fr/audit-rgaa-wcag/)

## ⚠️ Limitations

- L'analyse automatisée ne remplace pas un audit manuel
- Certains critères nécessitent une validation humaine
- Les contrastes de couleurs doivent être vérifiés avec des outils spécialisés
- L'analyse se base sur le DOM statique (pas d'interactions dynamiques)

## 🔮 Roadmap

- [ ] Historique des audits persistant
- [ ] Export PDF des rapports
- [ ] Tests de contrastes automatisés
- [ ] Analyse de performance
- [ ] API publique
- [ ] Plugins navigateur

## 📋 Analyse Exhaustive - 106 Critères RGAA 4.1

L'application analyse **TOUS** les critères RGAA selon les 13 thématiques officielles :

### 🖼️ Images (9 critères : 1.1 à 1.9)
- Alternatives textuelles manquantes, inadéquates ou trop longues
- Images décoratives avec texte alternatif non vide
- Images complexes sans description détaillée
- Images-liens sans intitulé approprié
- Images légendées incorrectement
- Images SVG sans alternatives
- Images bitmap contenant du texte
- Images objets sans alternatives

### 🖼️ Cadres (2 critères : 2.1 à 2.2)
- Frames/iframes sans titre ou avec titres non pertinents

### 🎨 Couleurs (3 critères : 3.1 à 3.3)
- Information véhiculée uniquement par la couleur
- Contrastes insuffisants (4.5:1 minimum, 3:1 pour gros texte)
- Contrastes éléments d'interface (3:1 minimum)

### 📺 Multimédia (13 critères : 4.1 à 4.13)
- Médias temporels sans transcription/sous-titres
- Médias synchronisés sans audio-description
- Contrôles de lecture inaccessibles
- Auto-play sans contrôle utilisateur
- Clignotements dangereux

### 📊 Tableaux (8 critères : 5.1 à 5.8)
- Tableaux de données sans en-têtes appropriés
- Cellules mal associées aux en-têtes
- Résumés/titres manquants
- Tableaux de mise en forme non linéarisables
- Navigation clavier dans tableaux complexes

### 🔗 Liens (2 critères : 6.1 à 6.2)
- Liens sans intitulé explicite
- Liens vides ou ambigus
- Liens identiques avec destinations différentes

### ⚙️ Scripts (5 critères : 7.1 à 7.5)
- Contenus générés inaccessibles au clavier
- Scripts modifiant le contenu sans prévenir l'utilisateur
- Fonctionnalités JavaScript inaccessibles
- Changements de contexte sans action utilisateur
- Gestion du focus incorrecte

### 📋 Éléments obligatoires (10 critères : 8.1 à 8.10)
- Titre de page manquant/inadéquat
- Langue de la page non définie/invalide
- Changements de langue non indiqués
- Balises mal utilisées (détournement sémantique)
- Ouverture de nouvelle fenêtre non signalée

### 🏗️ Structuration (4 critères : 9.1 à 9.4)
- Hiérarchie des titres incorrecte
- Structure HTML non sémantique
- Listes non balisées comme listes
- Citations non balisées appropriément

### 🎨 Présentation (14 critères : 10.1 à 10.14)
- CSS obligatoire pour la mise en forme
- Taille de texte non redimensionnable
- Largeur non responsive
- Texte justifié trop dense
- Propriétés d'espacement forcées
- Contenus cachés/tronqués
- Effet de survol/focus sans équivalent
- Éléments décoratifs non CSS

### 📝 Formulaires (13 critères : 11.1 à 11.13)
- Champs sans étiquettes appropriées
- Étiquettes mal associées aux contrôles
- Regroupements fieldset manquants
- Contrôles de saisie sans aide
- Messages d'erreur non explicitées
- Contrôle de saisie utilisateur défaillant
- Aide contextuelle inaccessible
- Listes de choix multiples problématiques
- Boutons sans intitulé
- Validation automatique problématique

### 🧭 Navigation (11 critères : 12.1 à 12.11)
- Liens d'évitement manquants
- Plan du site absent
- Barre de navigation incohérente
- Fil d'Ariane manquant
- Regroupements de liens inappropriés
- Raccourcis clavier conflictuels
- Landmarks ARIA manquants
- Ordre de tabulation incorrect
- Systèmes de navigation non évidents
- Moteur de recherche manquant

### 📖 Consultation (12 critères : 13.1 à 13.12)
- Limites de temps sans contrôle utilisateur
- Ouverture forcée de nouvelle fenêtre
- Fichiers téléchargeables non identifiés
- Services/plugins sans alternatives
- Contenus flash/animés non pausables
- Captcha sans alternative
- Messages d'alerte temporaires
- Redirections automatiques
- Rafraîchissement automatique sans contrôle
- Contenus additionnels inaccessibles au clavier
