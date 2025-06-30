# Configuration MailJet

## 🚀 Intégration MailJet pour l'envoi d'emails

MailJet est maintenant intégré dans l'application pour l'envoi des emails de confirmation. Le système fonctionne avec un fallback automatique vers la simulation si MailJet n'est pas configuré.

## 📋 Variables d'environnement requises

Ajoutez ces variables dans votre fichier `.env.local` :

```bash
# Configuration MailJet
MAILJET_API_KEY=your_mailjet_api_key_here
MAILJET_SECRET_KEY=your_mailjet_secret_key_here
MAILJET_FROM_EMAIL=noreply@votre-domaine.com

# URL de l'application (optionnel, par défaut localhost:3002)
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

## 🔑 Comment obtenir vos clés MailJet

1. **Créez un compte MailJet** : https://app.mailjet.com/signup
2. **Plan gratuit** : 6 000 emails/mois gratuits
3. **Récupérez vos clés** : https://app.mailjet.com/account/apikeys
   - **API Key** : Clé publique (commence par un nombre)
   - **Secret Key** : Clé privée (chaîne alphanuméririque)

## 📧 Configuration de l'expéditeur

- **Email expéditeur** : Utilisez un email de votre domaine
- **Nom expéditeur** : "RGAA Audit" (automatique)
- **Vérification domaine** : Recommandée pour éviter le spam

## 🔄 Fonctionnement

- **Avec MailJet configuré** : Envoi réel d'emails
- **Sans configuration** : Mode simulation (logs console)
- **En cas d'erreur MailJet** : Fallback automatique vers simulation

## ✅ Test de fonctionnement

1. Configurez les variables d'environnement
2. Redémarrez le serveur : `npm run dev`
3. Inscrivez-vous avec un email réel
4. Vérifiez la réception de l'email

## 📊 Limites du plan gratuit

- **6 000 emails/mois**
- **200 emails/jour**
- Support des domaines personnalisés
- Statistiques détaillées

## 🚨 En cas de problème

- Vérifiez vos clés API dans la console MailJet
- Confirmez que votre domaine expéditeur est vérifié
- Consultez les logs de l'application pour les erreurs détaillées

---

**Note** : Le système continuera de fonctionner en mode simulation même sans MailJet configuré, permettant un développement sans interruption. 