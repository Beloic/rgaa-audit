const puppeteer = require('puppeteer');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Entrez l\'URL à auditer avec WAVE : ', async (url) => {
  if (!/^https?:\/\//.test(url)) {
    console.log('Veuillez entrer une URL valide (commençant par http:// ou https://)');
    rl.close();
    process.exit(1);
  }
  const waveUrl = `https://wave.webaim.org/report?url=${encodeURIComponent(url)}`;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(waveUrl);
  console.log(`WAVE ouvert sur : ${waveUrl}`);
  // Laisser le navigateur ouvert pour l'utilisateur
  // rl.close() n'est pas appelé pour garder le script vivant tant que le navigateur est ouvert
}); 