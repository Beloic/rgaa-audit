# 🔍 RGAA Audit - Outil d'Audit d'Accessibilité

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![RGAA](https://img.shields.io/badge/RGAA-4.1-green)](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)

**Outil d'audit d'accessibilité web** conforme au **Référentiel Général d'Amélioration de l'Accessibilité (RGAA 4.1)** français.

## ✨ Fonctionnalités principales

- **🚀 Analyse rapide** : Audit instantané via l'API WAVE
- **📊 Rapports détaillés** : Analyse complète des violations d'accessibilité
- **🎯 Conformité RGAA** : Mapping précis avec les 106 critères RGAA 4.1
- **🌐 Interface bilingue** : Français / Anglais
- **📱 Design responsif** : Expérience optimale sur tous les appareils

## 🛠️ Analyse exhaustive

- **Audit automatisé** : Détection automatique des problèmes d'accessibilité
- **Analyse exhaustive** : Vérification selon les **106 critères RGAA 4.1**
- **Recommandations** : Conseils pratiques pour corriger les violations
- **Priorisation** : Classification par niveau de criticité

## 🚀 Technologies

- **Frontend** : Next.js 15.3.3 avec TypeScript
- **Styling** : Tailwind CSS pour un design moderne
- **Accessibilité** : Respect des standards WCAG 2.1 / RGAA 4.1
- **API d'analyse** : WAVE (Web Accessibility Evaluation Tool)
- **Déploiement** : Vercel

## 📋 Prérequis

- Node.js 18+ et npm
- Clé API WAVE (gratuite avec limitations)

## ⚡ Installation

```bash
# Cloner le repository
git clone [url-du-repo]
cd rgaa-audit-app

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp env.example .env.local

# Éditer .env.local avec votre clé API WAVE
WAVE_API_KEY=your_wave_api_key_here

# Démarrer en développement
npm run dev
```

## 🔧 Configuration

Créez un fichier `.env.local` avec :

```env
# Configuration WAVE API
WAVE_API_KEY=your_wave_api_key_here

# Configuration Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
```

## 📁 Structure du projet

```
rgaa-audit-app/
├── src/
│   ├── app/                    # Routes Next.js App Router
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── blog/              # Blog d'accessibilité
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Composants React
│   │   ├── AuditForm.tsx      # Formulaire d'analyse
│   │   ├── AuditResults.tsx   # Affichage des résultats
│   │   ├── TopBar.tsx         # Navigation principale
│   │   └── RGAAReference.tsx  # Référentiel RGAA
│   ├── contexts/              # Contextes React
│   │   └── LanguageContext.tsx # Gestion i18n
│   ├── lib/                   # Utilitaires
│   │   └── wave-analyzer.ts   # Intégration WAVE API
│   └── types/                 # Types TypeScript
│       └── audit.ts           # Types pour l'audit
├── public/                    # Assets statiques
└── README.md
```

## 🎯 API d'analyse

L'application utilise l'API WAVE pour générer des analyses d'accessibilité structurées :

### Critères analysés
- **Images** : Alternatives textuelles, images décoratives
- **Navigation** : Structure des liens, navigation au clavier  
- **Formulaires** : Étiquettes, validation, groupement
- **Structure** : Hiérarchie des titres, landmarks ARIA
- **Couleurs** : Contraste, information véhiculée par la couleur
- **Multimédia** : Sous-titres, alternatives audio/vidéo

## 🌐 Déploiement

L'application est optimisée pour Vercel :

```bash
# Build de production
npm run build

# Déploiement automatique via Vercel
```

## 📚 Ressources RGAA

- [RGAA 4.1 Officiel](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/)
- [Design System Gouvernement](https://design.numerique.gouv.fr/)
- [WAVE API Documentation](https://wave.webaim.org/api/)

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ pour améliorer l'accessibilité du web français**
