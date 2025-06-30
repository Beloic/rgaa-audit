# Instructions pour configurer Supabase

## ⚠️ IMPORTANT : Configuration de la base de données

La base de données Supabase doit être configurée avec le bon schéma avant d'utiliser l'application.

### Étapes obligatoires :

1. **Connectez-vous au tableau de bord Supabase** :
   - URL : https://ntzppsdyidqonusibocc.supabase.co
   - Allez dans l'onglet "SQL Editor"

2. **Exécutez le script SQL de création** :
   ```sql
   -- Copiez et collez le contenu du fichier supabase-setup-clean.sql
   -- dans l'éditeur SQL de Supabase et exécutez-le
   ```

3. **Vérifiez la création de la table** :
   ```sql
   SELECT table_name, column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'users' 
   ORDER BY ordinal_position;
   ```

### Structure attendue de la table `users` :

- ✅ `audits_this_month` (INTEGER)
- ✅ `audits_total` (INTEGER) 
- ✅ `subscription_plan` (VARCHAR)
- ✅ `subscription_status` (VARCHAR)
- ✅ Et toutes les autres colonnes définies dans `supabase-setup-clean.sql`

### En cas d'erreur "Column not found" :

1. La table n'a pas été créée correctement
2. Réexécutez le script `supabase-setup-clean.sql` 
3. Vérifiez que toutes les colonnes sont présentes

### Variables d'environnement requises :

```
NEXT_PUBLIC_SUPABASE_URL=https://ntzppsdyidqonusibocc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50enBwc2R5aWRxb251c2lib2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc3NjEsImV4cCI6MjA2NjY4Mzc2MX0.XybM_Rjat5A3EZGHHP_oUNtePrB_krvysqCtuOJtcws
```

⚠️ **Si l'erreur persiste, c'est que le script SQL n'a pas été exécuté dans Supabase.** 