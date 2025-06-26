'use client';

import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function QuizPage() {
  const { language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [score, setScore] = useState(0);
  const [resultsChart, setResultsChart] = useState<any>(null);

  const totalQuestions = 20;

  // Questions du quiz
  const questions = [
    {
      id: 1,
      question: 'Qu\'est-ce que le RGAA ?',
      options: [
        { value: 'a', label: 'Référentiel Général d\'Amélioration de l\'Accessibilité' },
        { value: 'b', label: 'Règlement Général sur l\'Accessibilité Appliquée' },
        { value: 'c', label: 'Référentiel Géographique d\'Accès Adapté' },
        { value: 'd', label: 'Règles Générales d\'Accessibilité Avancée' }
      ],
      correct: 'a',
      explanation: "Le RGAA (Référentiel Général d'Amélioration de l'Accessibilité) est le référentiel français pour l'accessibilité numérique, basé sur les standards internationaux."
    },
    {
      id: 2,
      question: 'Quel niveau de conformité RGAA est exigé pour les organismes publics ?',
      options: [
        { value: 'a', label: 'Niveau A' },
        { value: 'b', label: 'Niveau AA' },
        { value: 'c', label: 'Niveau AAA' },
        { value: 'd', label: 'Tous les niveaux' }
      ],
      correct: 'b',
      explanation: "Le niveau AA est le niveau de conformité exigé par la loi pour les organismes publics et entreprises privées relevant du service public."
    },
    {
      id: 'q3',
      question: 'Quelle loi française impose l\'accessibilité des sites publics et de certains sites privés ?',
      options: [
        { value: 'a', label: 'Loi Informatique et Libertés' },
        { value: 'b', label: 'Loi pour une République Numérique' },
        { value: 'c', label: 'Loi Hadopi' }
      ]
    },
    {
      id: 'q4',
      question: 'Quelle est la déclaration obligatoire à publier sur un site conforme au RGAA ?',
      options: [
        { value: 'a', label: 'Déclaration de confidentialité' },
        { value: 'b', label: "Déclaration d'accessibilité" },
        { value: 'c', label: 'Déclaration de conformité RGPD' }
      ]
    },
    {
      id: 'q5',
      question: 'À quoi sert l\'attribut "alt" dans une balise image ?',
      options: [
        { value: 'a', label: "À afficher un texte alternatif quand l'image ne peut pas être chargée" },
        { value: 'b', label: "À fournir un texte descriptif pour les technologies d'assistance" },
        { value: 'c', label: 'Les deux réponses précédentes sont correctes' }
      ]
    },
    {
      id: 'q6',
      question: 'Quel niveau de conformité WCAG est exigé par le RGAA ?',
      options: [
        { value: 'a', label: 'Niveau A' },
        { value: 'b', label: 'Niveau AA' },
        { value: 'c', label: 'Niveau AAA' }
      ]
    },
    {
      id: 'q7',
      question: 'Pourquoi est-il important de définir une hiérarchie de titres cohérente (h1, h2, h3...) ?',
      options: [
        { value: 'a', label: 'Pour améliorer le référencement SEO uniquement' },
        { value: 'b', label: "Pour permettre une navigation facile avec les lecteurs d'écran" },
        { value: 'c', label: "Pour économiser de l'espace dans le code HTML" }
      ]
    },
    {
      id: 'q8',
      question: 'Quel pourcentage minimal de contraste est recommandé entre le texte et son arrière-plan pour le niveau AA ?',
      options: [
        { value: 'a', label: '3:1' },
        { value: 'b', label: '4.5:1' },
        { value: 'c', label: '7:1' }
      ]
    },
    {
      id: 'q9',
      question: 'Quelle est une bonne pratique pour rendre un formulaire accessible ?',
      options: [
        { value: 'a', label: 'Utiliser des attributs placeholder au lieu de labels' },
        { value: 'b', label: 'Associer explicitement les labels aux champs avec l\'attribut "for"' },
        { value: 'c', label: 'Utiliser uniquement des captchas basés sur des images' }
      ]
    },
    {
      id: 'q10',
      question: 'Que signifie ARIA dans le contexte de l\'accessibilité web ?',
      options: [
        { value: 'a', label: 'Accessible Rich Internet Applications' },
        { value: 'b', label: 'Alternative Renderings for Internet Access' },
        { value: 'c', label: 'Automated Reading Interface Application' }
      ]
    },
    {
      id: 'q11',
      question: 'Quelle version du RGAA est actuellement en vigueur en France ?',
      options: [
        { value: 'a', label: 'RGAA 3' },
        { value: 'b', label: 'RGAA 4' },
        { value: 'c', label: 'RGAA 5' }
      ]
    },
    {
      id: 'q12',
      question: 'Quelle directive européenne encadre l\'accessibilité numérique des sites et applications mobiles du secteur public ?',
      options: [
        { value: 'a', label: 'Directive (UE) 2016/2102' },
        { value: 'b', label: 'Directive RGPD' },
        { value: 'c', label: 'Directive ePrivacy' }
      ]
    },
    {
      id: 'q13',
      question: 'Qu\'est-ce que l\'European Accessibility Act (EAA) ?',
      options: [
        { value: 'a', label: 'Une certification européenne volontaire pour les sites web' },
        { value: 'b', label: "Une directive qui étend les exigences d'accessibilité au secteur privé" },
        { value: 'c', label: "Un outil de test automatisé d'accessibilité" }
      ]
    },
    {
      id: 'q14',
      question: 'Quel est le principal avantage de l\'utilisation des landmarks ARIA ?',
      options: [
        { value: 'a', label: 'Ils améliorent le positionnement SEO' },
        { value: 'b', label: "Ils permettent aux utilisateurs de lecteurs d'écran de naviguer rapidement entre les sections" },
        { value: 'c', label: 'Ils accélèrent le chargement des pages' }
      ]
    },
    {
      id: 'q15',
      question: 'Comment rendre une vidéo accessible selon le RGAA ?',
      options: [
        { value: 'a', label: 'Ajouter des sous-titres suffit dans tous les cas' },
        { value: 'b', label: 'Fournir une transcription textuelle uniquement' },
        { value: 'c', label: 'Proposer des sous-titres, une audiodescription si nécessaire et une transcription' }
      ]
    },
    {
      id: 'q16',
      question: 'Quelle est la meilleure façon de tester l\'accessibilité d\'un site web ?',
      options: [
        { value: 'a', label: 'Utiliser uniquement des outils automatisés' },
        { value: 'b', label: 'Combiner les tests automatisés, manuels et les tests utilisateurs avec des personnes en situation de handicap' },
        { value: 'c', label: 'Se fier uniquement à la validation W3C du code' }
      ]
    },
    {
      id: 'q17',
      question: 'Pourquoi est-il important de permettre le redimensionnement du texte jusqu\'à 200% ?',
      options: [
        { value: 'a', label: 'Pour les personnes ayant une déficience visuelle' },
        { value: 'b', label: "Pour économiser l'espace d'écran sur mobile" },
        { value: 'c', label: 'Pour améliorer la lisibilité sur les écrans à faible résolution' }
      ]
    },
    {
      id: 'q18',
      question: 'Quelle pratique n\'est PAS recommandée pour l\'accessibilité des sites web ?',
      options: [
        { value: 'a', label: 'Naviguer exclusivement avec le clavier' },
        { value: 'b', label: 'Créer des animations qui clignotent rapidement' },
        { value: 'c', label: 'Utiliser des listes pour structurer les menus' }
      ]
    },
    {
      id: 'q19',
      question: 'Quel élément est essentiel pour une page web accessible ?',
      options: [
        { value: 'a', label: 'Un titre h1 unique et descriptif' },
        { value: 'b', label: 'Des polices de caractères décoratives' },
        { value: 'c', label: "Un menu qui s'affiche uniquement au survol" }
      ]
    },
    {
      id: 7,
      question: 'Quelle organisation française est responsable du RGAA ?',
      options: [
        { value: 'a', label: 'ANSSI' },
        { value: 'b', label: 'DINUM' },
        { value: 'c', label: 'CNIL' },
        { value: 'd', label: 'ARCEP' }
      ],
      correct: 'b',
      explanation: "La DINUM (Direction Interministérielle du Numérique) est responsable de la maintenance et de l'évolution du RGAA en France."
    }
  ];

  // Réponses correctes
  const answers = {
    q1: 'b', q2: 'b', q3: 'b', q4: 'b', q5: 'c', q6: 'b', q7: 'b', q8: 'b', q9: 'b', q10: 'a',
    q11: 'b', q12: 'a', q13: 'b', q14: 'b', q15: 'c', q16: 'b', q17: 'a', q18: 'b', q19: 'a', q20: 'b'
  };

  // Explications
  const explanations = {
    1: {
      title: "Qu'est-ce que le RGAA ?",
      text: "Le RGAA est le référentiel français pour l'accessibilité numérique. Ces normes définissent les critères de succès à respecter pour rendre le contenu web accessible à tous, y compris aux personnes en situation de handicap.",
      link: "https://www.numerique.gouv.fr/publications/rgaa-accessibilite/"
    },
    2: {
      title: "Niveau de conformité requis",
      text: "Le RGAA exige le niveau AA de conformité, qui représente un niveau intermédiaire d'accessibilité permettant de répondre aux besoins essentiels des utilisateurs en situation de handicap.",
      link: "https://accessibilite.numerique.gouv.fr/"
    },
    q3: {
      text: "La loi pour une République numérique (loi n° 2016-1321 du 7 octobre 2016) impose aux services publics en ligne et à certains services privés d'être accessibles aux personnes handicapées.",
      link: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000033202746/"
    },
    q4: {
      text: "Tout site conforme au RGAA doit publier une déclaration d'accessibilité qui précise le niveau de conformité atteint et les dérogations éventuelles.",
      link: "https://accessibilite.numerique.gouv.fr/obligations/declaration-d-accessibilite/"
    },
    q5: {
      text: "L'attribut 'alt' sert à la fois à fournir un texte descriptif de l'image pour les utilisateurs de technologies d'assistance (comme les lecteurs d'écran) et à afficher un texte alternatif lorsque l'image ne peut pas être chargée.",
      link: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/1-images/"
    },
    q6: {
      text: "Le RGAA exige le niveau AA de conformité WCAG, qui représente un niveau intermédiaire d'accessibilité permettant de répondre aux besoins essentiels des utilisateurs en situation de handicap.",
      link: "https://accessibilite.numerique.gouv.fr/methode/introduction-RGAA/"
    },
    q7: {
      text: "Une hiérarchie de titres cohérente (h1, h2, h3...) permet aux utilisateurs de lecteurs d'écran de naviguer facilement dans la structure du document et de comprendre l'organisation du contenu.",
      link: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/9-structuration-de-l-information/"
    },
    q8: {
      text: "Pour le niveau AA, un ratio de contraste de 4.5:1 est exigé pour le texte normal et de 3:1 pour le texte de grande taille, afin d'assurer une lisibilité adéquate pour les personnes ayant des déficiences visuelles.",
      link: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/3-couleurs/"
    },
    q9: {
      text: "Pour rendre un formulaire accessible, il est essentiel d'associer explicitement les labels aux champs de formulaire avec l'attribut 'for', ce qui permet aux technologies d'assistance d'identifier correctement la fonction de chaque champ.",
      link: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/11-formulaires/"
    },
    q10: {
      text: "ARIA signifie Accessible Rich Internet Applications. C'est une spécification du W3C qui définit des attributs permettant d'améliorer l'accessibilité des applications web dynamiques pour les technologies d'assistance.",
      link: "https://www.w3.org/WAI/standards-guidelines/aria/"
    },
    q11: {
      text: "La version 4 du RGAA est actuellement en vigueur en France. Cette version est alignée sur les WCAG 2.1 et a été publiée en 2019, avec des mises à jour ultérieures.",
      link: "https://accessibilite.numerique.gouv.fr/methode/introduction-RGAA/"
    },
    q12: {
      text: "La directive européenne 2016/2102 encadre l'accessibilité des sites web et applications mobiles du secteur public. Elle exige que ces services respectent les normes d'accessibilité et publient une déclaration d'accessibilité.",
      link: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32016L2102"
    },
    q13: {
      text: "L'European Accessibility Act (EAA) est une directive qui étend les exigences d'accessibilité au secteur privé pour certains produits et services numériques, comme les services bancaires, les livres électroniques et le commerce en ligne.",
      link: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32019L0882"
    },
    q14: {
      text: "Les landmarks ARIA permettent aux utilisateurs de lecteurs d'écran de naviguer rapidement entre les principales sections d'une page web, comme l'en-tête, le menu de navigation, le contenu principal et le pied de page.",
      link: "https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/"
    },
    q15: {
      text: "Pour rendre une vidéo pleinement accessible selon le RGAA, il faut proposer des sous-titres pour les personnes sourdes, une audiodescription si des informations visuelles importantes ne sont pas accessibles par l'audio, et une transcription textuelle.",
      link: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/4-medias/"
    },
    q16: {
      text: "La meilleure façon de tester l'accessibilité d'un site web est de combiner différentes méthodes : des tests automatisés (outils de validation), des tests manuels (vérification des critères RGAA) et des tests utilisateurs avec des personnes en situation de handicap.",
      link: "https://accessibilite.numerique.gouv.fr/methode/cadre-technique/"
    },
    q17: {
      text: "Permettre le redimensionnement du texte jusqu'à 200% est important pour les personnes ayant une déficience visuelle, car cela leur permet d'adapter la taille du texte à leurs besoins sans perte de contenu ou de fonctionnalité.",
      link: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/10-presentation/"
    },
    q18: {
      text: "Créer des animations qui clignotent rapidement n'est PAS recommandé pour l'accessibilité, car cela peut provoquer des crises chez les personnes épileptiques et être gênant pour celles souffrant de troubles de l'attention.",
      link: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/13-consultation/"
    },
    q19: {
      text: "Un titre h1 unique et descriptif est essentiel pour une page web accessible, car il aide les utilisateurs à comprendre immédiatement le sujet principal de la page et fournit un point de repère pour les technologies d'assistance.",
      link: "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/9-structuration-de-l-information/"
    },
    7: {
      title: "Organisation responsable du RGAA",
      text: "La DINUM développe et maintient le RGAA en France. Elle travaille en étroite collaboration avec les acteurs du secteur pour faire évoluer ce référentiel.",
      link: "https://www.numerique.gouv.fr/"
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    let correctCount = 0;
    Object.keys(answers).forEach(questionId => {
      if (userAnswers[questionId] === answers[questionId as keyof typeof answers]) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(1);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const currentQuestionData = questions[currentQuestion - 1];
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const scorePercentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Skip to main content link pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:ring-2 focus:ring-blue-300"
      >
        Aller au contenu principal
      </a>

      {/* Topbar Navigation */}
      <TopBar />

      {/* Main Content */}
      <main id="main-content" className="relative z-10">
        {/* Header */}
        <header className="text-center px-6 pt-16 pb-8 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900">
            Testez vos connaissances sur le RGAA et l'accessibilité numérique
          </h1>
        </header>

        {/* Quiz Section */}
        <section className="max-w-4xl mx-auto px-6 pb-20">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!showResults ? (
              <>
                {/* Barre de progression */}
                <div className="h-1 bg-gray-200 rounded-full mb-8 overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <p className="text-center text-gray-600 mb-8">
                  Question {currentQuestion}/{totalQuestions}
                </p>

                {/* Question actuelle */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {currentQuestionData.question}
                  </h2>

                  <div className="space-y-4">
                    {currentQuestionData.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name={currentQuestionData.id.toString()}
                          value={option.value}
                          checked={userAnswers[currentQuestionData.id.toString()] === option.value}
                          onChange={(e) => handleAnswerChange(currentQuestionData.id.toString(), e.target.value)}
                          className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-900">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Boutons de navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={goToPrevQuestion}
                    disabled={currentQuestion === 1}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={goToNextQuestion}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    {currentQuestion === totalQuestions ? 'Terminer le quiz' : 'Suivant'}
                  </button>
                </div>
              </>
            ) : (
              /* Résultats */
              <div className="text-center">
                <div className="bg-blue-600 text-white p-6 rounded-t-lg mb-6">
                  <h2 className="text-2xl font-bold mb-2">Vos résultats</h2>
                  <p className="text-lg">
                    {scorePercentage === 100 ? "C'est un perfect !" : 
                     scorePercentage >= 50 ? "Joli score !" : "Il faut réviser !"}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {scorePercentage}%
                  </div>
                  <p className="text-gray-600">
                    {score} bonnes réponses sur {totalQuestions}
                  </p>
                </div>

                {/* Feedback détaillé */}
                <div className="text-left space-y-4 mb-8">
                  {questions.map((question, index) => {
                    const questionId = question.id.toString();
                    const userAnswer = userAnswers[questionId];
                    const correctAnswer = answers[questionId as keyof typeof answers];
                    const isCorrect = userAnswer === correctAnswer;
                    const explanation = explanations[questionId as keyof typeof explanations];

                    return (
                      <div key={questionId} className="border rounded-lg p-4">
                        <div className={`p-3 rounded mb-3 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          Question {index + 1}: {isCorrect ? 'Correct!' : 'Incorrect.'}
                        </div>
                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                          <p className="mb-2">{explanation.text}</p>
                          <a 
                            href={explanation.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            En savoir plus sur le RGAA
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={restartQuiz}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Recommencer le quiz
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}