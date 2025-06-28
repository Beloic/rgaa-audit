# 📧 Guide Anti-Spam Complet - MailJet + RGAA Audit

## 🎯 **Objectif : Faire en sorte que vos emails arrivent en boîte de réception**

Adresse configurée : **hello@loicbernard.com**

---

## 🔐 **1. Validation de l'adresse dans MailJet**

### ✅ **Étapes obligatoires :**

1. **Connectez-vous** : https://app.mailjet.com/senders
2. **Ajoutez l'adresse** : `hello@loicbernard.com`
3. **Vérifiez votre boîte** : Cliquez sur le lien de validation
4. **Statut "Validé"** : Attendez la validation complète

⚠️ **Sans validation, MailJet bloque l'envoi !**

---

## 🌐 **2. Configuration DNS Anti-Spam**

### 📋 **Enregistrements DNS à ajouter chez votre hébergeur (loicbernard.com) :**

#### **A. Enregistrement SPF (obligatoire)**
```dns
Type: TXT
Nom: @
Valeur: v=spf1 include:spf.mailjet.com ~all
```

#### **B. Enregistrement DKIM (recommandé)**
```dns
Type: TXT  
Nom: mailjet._domainkey
Valeur: [Récupérez la clé DKIM depuis MailJet > Senders > Domain authentication]
```

#### **C. Enregistrement DMARC (fortement recommandé)**
```dns
Type: TXT
Nom: _dmarc
Valeur: v=DMARC1; p=quarantine; rua=mailto:hello@loicbernard.com
```

### 🔍 **Comment récupérer les valeurs exactes :**
1. **SPF/DKIM** : https://app.mailjet.com/senders → "Domain authentication"
2. **Vérification** : https://mxtoolbox.com/spf.aspx (testez votre domaine)

---

## 📝 **3. Optimisation du Contenu Email**

### ✅ **Bonnes pratiques appliquées dans le template :**

- **Ratio texte/HTML équilibré** (60% texte, 40% HTML)
- **Pas de mots spam** ("gratuit", "urgent", "cliquez ici")
- **Images optimisées** avec texte alternatif
- **Liens courts et explicites**
- **Structure HTML propre**

### 🚫 **Mots à éviter absolument :**
- Gratuit, Free, Urgent, Limitée
- $$$ ou prix barrés
- RE: ou FW: dans le sujet
- Trop de majuscules ou d'exclamations

---

## 🛡️ **4. Configuration MailJet Pro**

### 📊 **Recommandations :**

1. **IP dédiée** : Passez au plan Business (89€/mois) pour une IP propre
2. **Réputation** : Commencez avec un faible volume (50 emails/jour)
3. **Authentification** : Activez la double authentification
4. **Monitoring** : Surveillez les taux de rebond et plaintes

### 📈 **Montée en volume progressive :**
- **Semaine 1** : 50 emails/jour
- **Semaine 2** : 100 emails/jour  
- **Semaine 3** : 200 emails/jour
- **Semaine 4+** : Volume normal

---

## 🎨 **5. Template Email Optimisé**

### ✅ **Améliorations appliquées :**

- **Texte/Image ratio** : 70/30
- **Sujet clair** : "Confirmez votre compte RGAA Audit"
- **Expéditeur** : "RGAA Audit" <hello@loicbernard.com>
- **Footer obligatoire** : Adresse physique + désabonnement
- **Liens trackés** : Via MailJet pour analyser l'engagement

---

## 🔍 **6. Tests et Monitoring**

### 🧪 **Outils de test gratuits :**

1. **Mail-tester** : https://www.mail-tester.com (score sur 10)
2. **GlockApps** : Test de délivrabilité
3. **MXToolbox** : Vérification DNS
4. **MailJet Analytics** : Taux d'ouverture et plaintes

### 📊 **KPIs à surveiller :**
- **Taux de délivrabilité** : >95%
- **Taux d'ouverture** : >20%
- **Taux de plainte** : <0.1%
- **Taux de rebond** : <5%

---

## ⚡ **7. Actions Immédiates**

### 🚀 **À faire maintenant :**

1. **Validez** `hello@loicbernard.com` dans MailJet
2. **Configurez SPF** : `v=spf1 include:spf.mailjet.com ~all`  
3. **Activez DKIM** depuis MailJet
4. **Testez un email** sur mail-tester.com
5. **Surveillez** les premiers envois

### 📞 **Support MailJet :**
- **Chat** : Disponible dans votre dashboard
- **Email** : support@mailjet.com
- **Documentation** : https://dev.mailjet.com

---

## 🎯 **Checklist de Validation**

- [ ] Adresse hello@loicbernard.com validée dans MailJet
- [ ] Enregistrement SPF configuré
- [ ] DKIM activé et configuré  
- [ ] DMARC configuré
- [ ] Premier email testé sur mail-tester.com
- [ ] Score >8/10 obtenu
- [ ] Monitoring MailJet activé

---

**🎉 Avec cette configuration, vos emails arriveront en boîte de réception !** 