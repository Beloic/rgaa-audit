# Configuration des variables d'environnement MailJet sur Vercel

## 🚨 Problème identifié
Les variables d'environnement MailJet ne sont pas configurées sur Vercel, ce qui empêche l'envoi d'emails en production.

## 🔧 Solution : Configuration manuelle sur Vercel

### 1. Accéder au dashboard Vercel
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet `rgaa-audit`
3. Allez dans l'onglet **Settings**

### 2. Ajouter les variables d'environnement
Dans **Environment Variables**, ajoutez :

#### Variable 1 :
- **Name** : `MAILJET_API_KEY`
- **Value** : `c9fc62becdc0f459ccf6d28bc8a17c01`
- **Environment** : Production, Preview, Development

#### Variable 2 :
- **Name** : `MAILJET_SECRET_KEY`
- **Value** : `bd433114fe17d9846ee0b9f1d89dcc34`
- **Environment** : Production, Preview, Development

#### Variable 3 :
- **Name** : `MAILJET_FROM_EMAIL`
- **Value** : `hello@loicbernard.com`
- **Environment** : Production, Preview, Development

### 3. Redéployer l'application
1. Cliquez sur **Redeploy** dans l'onglet **Deployments**
2. Ou faites un nouveau commit pour déclencher un déploiement automatique

## ✅ Vérification
Après le redéploiement, testez l'inscription sur https://rgaa-audit.vercel.app

## 🔍 Variables d'environnement actuelles sur Vercel
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ❌ `MAILJET_API_KEY` (à ajouter)
- ❌ `MAILJET_SECRET_KEY` (à ajouter)
- ❌ `MAILJET_FROM_EMAIL` (à ajouter)

## 📧 Test en local (fonctionne)
- ✅ MailJet configuré dans `.env.local`
- ✅ Test d'envoi réussi (Message ID: 1152921535583856769)
- ✅ Email reçu en local

## 🚀 Test en production (à corriger)
- ❌ Variables MailJet manquantes sur Vercel
- ❌ Emails non envoyés en production
- ✅ Base de données Supabase fonctionnelle 