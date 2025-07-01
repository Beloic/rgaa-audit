'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useAuth, PRICING_PLANS } from '@/contexts/AuthContext';
import { 
  Check, Crown, Zap, Shield, Star, ArrowRight, Sparkles, Building2, 
  Server, Database, Cpu, TrendingUp, AlertCircle, CreditCard
} from 'lucide-react';

export default function TarifsPage() {
  const { user, isAuthenticated, getCurrentPlan } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);
  const currentPlan = user ? getCurrentPlan() : null;

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Zap className="w-6 h-6" />;
      case 'pro':
        return <Crown className="w-6 h-6" />;
      case 'enterprise':
        return <Building2 className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  const getFeatureIcon = (feature: string) => {
    return <Check className="w-4 h-4 text-green-600" />;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuit';
    const finalPrice = isAnnual ? Math.round(price * 10) : price; // -20% si annuel
    return `${finalPrice}€`;
  };

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      // Rediriger vers la page d'inscription avec le plan sélectionné
      window.location.href = `/auth/register?plan=${planId}`;
      return;
    }

    if (planId === 'free') {
      // Downgrade vers gratuit
      alert('Fonctionnalité en cours de développement');
      return;
    }

    // Rediriger vers Stripe pour l'upgrade
    alert(`Redirection vers le paiement pour le plan ${planId}`);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <TopBar />

      {/* Hero Section */}
      <section className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Lancement spécial - 20% de réduction la première année
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Tarification simple et
            <span className="text-blue-600"> transparente</span>
            <span className="text-xs block mt-2 text-gray-500">Mise à jour: 2024-12-29</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Commencez gratuitement, 
            évoluez quand vous voulez, annulez à tout moment.
          </p>

          {/* Toggle Mensuel/Annuel */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Mensuel
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Annuel
            </span>
            {isAnnual && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                -20%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Section explicative sur la consommation API */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <Server className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Pourquoi des plans payants ?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-3xl mx-auto">
                Notre plateforme utilise des services externes payants pour vous offrir la meilleure qualité d'audit d'accessibilité.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <Database className="w-10 h-10 text-blue-200 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">APIs Externes</h3>
                <p className="text-blue-100 text-sm">
                  Intégration avec WAVE, Axe Core et nos propres moteurs d'analyse avancés
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <Cpu className="w-10 h-10 text-blue-200 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Puissance de calcul</h3>
                <p className="text-blue-100 text-sm">
                  Analyse en temps réel de vos pages web avec des algorithmes optimisés
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                <TrendingUp className="w-10 h-10 text-blue-200 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Infrastructure premium</h3>
                <p className="text-blue-100 text-sm">
                  Serveurs dédiés, sauvegardes automatiques et monitoring 24/7
                </p>
              </div>
            </div>

            <div className="mt-8 bg-white/10 backdrop-blur rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-6 h-6 text-blue-200 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Consommation de crédits</h4>
                  <p className="text-blue-100 text-sm">
                    Chaque audit consomme des crédits API auprès de nos partenaires (WebAIM, Deque Systems). 
                    Nos tarifs reflètent ces coûts réels et nous permettent de maintenir un service de qualité professionnelle 
                    accessible au plus grand nombre.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Des plans adaptés à tous vos besoins
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Du développeur indépendant à la grande entreprise, trouvez le plan qui vous convient. 
              Tous les plans incluent les mêmes fonctionnalités de base avec des limites adaptées.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan) => {
              const isCurrentPlan = currentPlan?.id === plan.id;
              const isPopular = plan.popular;
              
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                    isPopular
                      ? 'border-blue-500 shadow-blue-100'
                      : 'border-gray-200'
                  } ${
                    isCurrentPlan ? 'ring-2 ring-green-500 ring-offset-2' : ''
                  }`}
                >
                  {/* Badge populaire */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full shadow-lg">
                        <Star className="w-4 h-4 mr-2" />
                        Le plus populaire
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Header du plan */}
                    <div className="text-center mb-8">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                        plan.id === 'free' ? 'bg-gray-100 text-gray-600' :
                        plan.id === 'pro' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {getPlanIcon(plan.id)}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                      
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900">
                          {formatPrice(plan.price)}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-gray-500 text-sm">
                            /{isAnnual ? 'an' : 'mois'}
                          </span>
                        )}
                      </div>

                      {isAnnual && plan.price > 0 && (
                        <div className="text-sm text-green-600 font-medium">
                          Économisez {Math.round(plan.price * 2.4)}€ par an
                        </div>
                      )}

                      {/* Indicateur de coût API */}
                      {plan.id !== 'free' && (
                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center justify-center space-x-2">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800 text-xs font-medium">
                              Inclut les coûts API externes
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Fonctionnalités */}
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                              {getFeatureIcon(feature)}
                            </div>
                          </div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bouton CTA */}
                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isCurrentPlan}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                        isCurrentPlan
                          ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                          : isPopular
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {isCurrentPlan ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Plan actuel</span>
                        </>
                      ) : (
                        <>
                          <span>
                            {plan.id === 'free' ? 'Commencer gratuitement' : 
                             plan.id === 'pro' ? 'Passer au Pro' : 
                             'Contacter les ventes'}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {plan.id === 'enterprise' && (
                      <div className="text-center mt-4">
                        <Link 
                          href="/contact"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Ou contactez-nous pour un devis personnalisé
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Note sur la transparence des coûts */}
          <div className="mt-12 bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Transparence totale sur nos coûts</h3>
            <p className="text-gray-600 text-sm max-w-3xl mx-auto">
              Contrairement à d'autres solutions, nous vous donnons accès aux meilleurs outils d'audit d'accessibilité 
              (WAVE, Axe Core, moteur RGAA propriétaire) sans vous faire payer le prix fort. Nos tarifs couvrent 
              uniquement les coûts réels d'infrastructure et d'APIs externes.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-gray-600">
              Tout ce que vous devez savoir sur nos plans et tarifs
            </p>
          </div>

          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Pourquoi proposez-vous des plans payants ?
              </h3>
              <p className="text-gray-600">
                Notre plateforme utilise des APIs externes payantes (WAVE de WebAIM, Axe Core de Deque Systems) 
                et nécessite une infrastructure robuste pour traiter les audits en temps réel. Nos tarifs 
                reflètent ces coûts réels et nous permettent de vous offrir le meilleur service possible.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Puis-je changer de plan à tout moment ?
              </h3>
              <p className="text-gray-600">
                Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. 
                Les changements prennent effet immédiatement et nous calculons la facturation au prorata.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Que se passe-t-il si je dépasse ma limite d'audits ?
              </h3>
              <p className="text-gray-600">
                Pour le plan gratuit, vous devrez attendre le lendemain pour effectuer de nouveaux audits. 
                Nous vous notifierons lorsque vous approchez de votre limite et vous pourrez passer 
                à un plan supérieur pour continuer immédiatement.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Les coûts API sont-ils vraiment inclus ?
              </h3>
              <p className="text-gray-600">
                Oui, absolument ! Tous nos plans payants incluent les coûts des APIs externes (WAVE, Axe Core). 
                Vous n'avez aucun frais caché ou supplément à prévoir. C'est l'un de nos engagements 
                pour une tarification transparente.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Y a-t-il une période d'essai gratuite ?
              </h3>
              <p className="text-gray-600">
                Le plan gratuit vous permet de tester nos fonctionnalités de base avec 3 audits par jour. 
                Les plans payants incluent une garantie de remboursement de 30 jours sans question.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Comment fonctionne la facturation annuelle ?
              </h3>
              <p className="text-gray-600">
                La facturation annuelle vous fait économiser 20% par rapport au paiement mensuel. 
                Vous payez une fois par an et bénéficiez d'une réduction automatique.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Proposez-vous des réductions pour les étudiants ou les associations ?
              </h3>
              <p className="text-gray-600">
                Oui ! Nous offrons des réductions spéciales pour les étudiants, les associations 
                et les organisations à but non lucratif. 
                <Link href="/contact" className="text-blue-600 hover:text-blue-700 ml-1">
                  Contactez-nous pour plus d'informations.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à améliorer l'accessibilité de vos sites ?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Rejoignez des milliers de développeurs qui font confiance à RGAA Audit 
            pour auditer l'accessibilité de leurs sites web.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-blue-300 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Parler à un expert
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 