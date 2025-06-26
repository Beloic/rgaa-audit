# 🚀 RGAA Audit - Outil d'audit d'accessibilité

Une application Next.js moderne pour l'audit d'accessibilité RGAA avec des moteurs d'analyse automatisée pour rendre le web plus inclusif.

## ✨ Fonctionnalités

- **🔍 Audit automatisé** : Analyse complète avec WAVE et Axe Core
- **📊 Rapports détaillés** : Violations détectées avec recommandations de correction
- **🎯 Conformité RGAA** : Respect des critères d'accessibilité français
- **🚦 Score d'accessibilité** : Évaluation instantanée de votre site
- **📋 Export PDF** : Rapports professionnels téléchargeables
- **🌐 Multilingue** : Interface disponible en français et anglais
- **⚡ Performance** : Analyse rapide et optimisée
- **🔒 Sécurisé** : Aucune donnée sensible stockée

## 🛠️ Architecture technique

### Moteurs d'analyse
- **WAVE** : WebAIM's Web Accessibility Evaluation Tool
- **Axe Core** : Analyseur d'accessibilité Deque Systems
- **RGAA** : Référentiel Général d'Amélioration de l'Accessibilité

### Technologies
- **Frontend** : Next.js 15.3, React 18, TypeScript
- **Styling** : Tailwind CSS 4.0
- **Icons** : Lucide React
- **Analytics** : Vercel Analytics
- **Deployment** : Vercel

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/your-username/rgaa-audit-app.git
cd rgaa-audit-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp env.example .env.local
```

Éditer `.env.local` :
```env
# Configuration RGAA Audit
BETA_PASSWORD=rgaa2025beta

# Configuration WAVE API
WAVE_API_KEY=your_wave_api_key_here

# Configuration Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

5. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 📁 Structure du projet

```
rgaa-audit-app/
├── src/
│   ├── app/                          # App Router Next.js 15
│   │   ├── api/                      # API Routes
│   │   │   └── analyze/              # Endpoint d'analyse
│   │   ├── blog/                     # Blog sur l'accessibilité
│   │   ├── globals.css               # Styles globaux
│   │   ├── layout.tsx                # Layout principal
│   │   └── page.tsx                  # Page d'accueil
│   ├── components/                   # Composants React
│   │   ├── AuditForm.tsx            # Formulaire d'audit
│   │   ├── AuditResults.tsx         # Affichage des résultats
│   │   ├── BetaProtection.tsx       # Protection beta
│   │   ├── ClientLayout.tsx         # Layout client
│   │   ├── Footer.tsx               # Pied de page
│   │   ├── RGAAReference.tsx        # Référentiel RGAA
│   │   └── TopBar.tsx               # Barre de navigation
│   ├── contexts/                     # Contexts React
│   │   └── LanguageContext.tsx      # Gestion multilingue
│   ├── lib/                         # Utilitaires
│   │   ├── constants.ts             # Constantes RGAA
│   │   ├── report-generator.ts      # Générateur de rapports
│   │   └── wave-analyzer.ts         # Analyseur WAVE
│   └── types/                       # Types TypeScript
│       └── audit.ts                 # Types d'audit
├── public/                          # Assets statiques
├── .eslintrc.json                   # Configuration ESLint
├── next.config.js                   # Configuration Next.js
├── package.json                     # Dépendances
├── README.md                        # Documentation
├── tailwind.config.ts               # Configuration Tailwind
└── tsconfig.json                    # Configuration TypeScript
```

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev                # Lancer en mode développement
npm run build             # Build de production
npm run start             # Lancer en mode production
npm run lint              # Linter le code
npm run type-check        # Vérification TypeScript
npm run clean             # Nettoyer les caches
```

## 📊 Fonctionnement de l'audit

### 1. Analyse automatisée
- **WAVE** : Détection des violations d'accessibilité via l'API WebAIM
- **Axe Core** : Analyse complémentaire avec le moteur Deque Systems
- **RGAA** : Vérification des 106 critères du référentiel français

### 2. Génération de rapport
- Compilation des résultats de tous les moteurs
- Classification par niveau de gravité (A, AA, AAA)
- Recommandations de correction pour chaque violation
- Score d'accessibilité global

### 3. Export et partage
- Génération de rapports PDF professionnels
- Interface web responsive pour consultation
- Liens de partage sécurisés

## 🌐 Gestion multilingue

L'application supporte le français et l'anglais :
- Interface utilisateur complètement traduite
- Rapports d'audit dans les deux langues
- Métadonnées SEO localisées
- Contexte de langue React centralisé

## 🔒 Sécurité et confidentialité

- Aucune donnée utilisateur stockée
- Analyses effectuées côté client quand possible
- Variables d'environnement pour les clés API
- Validation stricte des entrées utilisateur
- Protection CSRF et XSS

## 📋 Critères RGAA supportés

L'application vérifie les 106 critères RGAA 4.1 répartis en 13 thématiques :
- Images (9 critères)
- Cadres (2 critères)
- Couleurs (3 critères)
- Multimédia (13 critères)
- Tableaux (8 critères)
- Liens (2 critères)
- Scripts (5 critères)
- Éléments obligatoires (10 critères)
- Structuration de l'information (4 critères)
- Présentation de l'information (14 critères)
- Formulaires (13 critères)
- Navigation (11 critères)
- Consultation (12 critères)

## 🚀 Déploiement

### Vercel (recommandé)
```bash
# Connecter le repository à Vercel
npx vercel

# Configurer les variables d'environnement dans Vercel Dashboard
# Déployer
npx vercel --prod
```

### Docker
```bash
# Build de l'image
docker build -t rgaa-audit-app .

# Lancer le container
docker run -p 3000:3000 rgaa-audit-app
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- 📧 Email : support@rgaa-audit.fr
- 📖 Documentation : [wiki](https://github.com/your-username/rgaa-audit-app/wiki)
- 🐛 Issues : [GitHub Issues](https://github.com/your-username/rgaa-audit-app/issues)

## 🙏 Remerciements

- [WebAIM](https://webaim.org/) pour l'API WAVE
- [Deque Systems](https://www.deque.com/) pour Axe Core
- [DINUM](https://www.numerique.gouv.fr/) pour le référentiel RGAA
- [Next.js team](https://nextjs.org/) pour le framework
- [Vercel](https://vercel.com/) pour l'hébergement
