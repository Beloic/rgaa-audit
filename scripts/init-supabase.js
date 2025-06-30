#!/usr/bin/env node

const SUPABASE_URL = 'https://ntzppsdyidqonusibocc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50enBwc2R5aWRxb251c2lib2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc3NjEsImV4cCI6MjA2NjY4Mzc2MX0.XybM_Rjat5A3EZGHHP_oUNtePrB_krvysqCtuOJtcws';

async function checkUsersTable() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (response.ok) {
      console.log('✅ Table users détectée - Authentification prête !');
      return true;
    } else {
      console.log('⚠️  Table users non trouvée');
      return false;
    }
  } catch (error) {
    console.log('🔍 Vérification en cours...');
    return false;
  }
}

async function main() {
  console.log('🚀 Vérification Supabase\n');
  
  const tableExists = await checkUsersTable();
  
  if (!tableExists) {
    console.log('\n📋 Pour activer l\'authentification:');
    console.log('1. Aller sur: https://ntzppsdyidqonusibocc.supabase.co');
    console.log('2. SQL Editor > Copier le fichier supabase-setup.sql');
    console.log('3. Exécuter le script');
  }
}

main(); 