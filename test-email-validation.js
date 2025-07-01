// Test de validation email
const isValidEmail = (email) => {
  // Regex identique à celle de auth.ts
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Vérifications supplémentaires
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false; // RFC 5321 limite
  if (email.includes('..')) return false; // Pas de points consécutifs
  
  return emailRegex.test(email.trim());
};

// Tests des emails problématiques
const emails = [
  'hello@loicbernard.com',
  'test@gmail.com',
  'user.test@gmail.com',
  'john.doe+work@company.fr',
  'contact@example.org',
  'email@domain-name.com',
  'firstname.lastname@example.com',
  'test.email.with+symbol@example.com',
  'user@sub.domain.com',
  'simple@example.com'
];

console.log('🧪 Test de validation email\n');

emails.forEach(email => {
  const isValid = isValidEmail(email);
  console.log(`${isValid ? '✅' : '❌'} ${email} - ${isValid ? 'VALIDE' : 'INVALIDE'}`);
  
  if (!isValid) {
    console.log(`   📝 Email trim: "${email.trim()}"`);
    console.log(`   📏 Longueur: ${email.length}`);
    console.log(`   🔍 Points consécutifs: ${email.includes('..') ? 'OUI' : 'NON'}`);
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    console.log(`   🎯 Regex match: ${emailRegex.test(email.trim()) ? 'OUI' : 'NON'}`);
    console.log('');
  }
}); 