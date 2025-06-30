'use client';

import { useState } from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { useAuth, PRICING_PLANS } from '@/contexts/AuthContext';
import { 
  Check, Crown, Zap, Shield, Users, BarChart3, 
  Clock, Star, ArrowRight, Sparkles, Building2,
  HeadphonesIcon, Key, Globe, Palette
} from 'lucide-react';

export default function PricingPage() {
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
    if (feature.includes('audit')) return <BarChart3 className="w-4 h-4" />;
    if (feature.includes('équipe') || feature.includes('membre')) return <Users className="w-4 h-4" />;
    if (feature.includes('support')) return <HeadphonesIcon className="w-4 h-4" />;
    if (feature.includes('API')) return <Key className="w-4 h-4" />;
    if (feature.includes('white-label') || feature.includes('White-label')) return <Palette className="w-4 h-4" />;
    if (feature.includes('SLA') || feature.includes('on-premise')) return <Shield className="w-4 h-4" />;
    if (feature.includes('historique') || feature.includes('Historique')) return <Clock className="w-4 h-4" />;
    return <Check className="w-4 h-4" />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
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

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
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

                  {/* Badge plan actuel */}
                  {isCurrentPlan && (
                    <div className="absolute -top-4 right-4">
                      <div className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-full shadow-lg">
                        <Check className="w-4 h-4 mr-1" />
                        Plan actuel
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
                Nous vous notifierons lorsque vous approchez de votre limite. 
                Vous pouvez soit attendre le mois suivant, soit passer à un plan supérieur pour continuer.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Y a-t-il une période d'essai gratuite ?
              </h3>
              <p className="text-gray-600">
                Le plan gratuit vous permet de tester nos fonctionnalités de base. 
                Les plans payants incluent une garantie de remboursement de 30 jours.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Comment fonctionne la facturation annuelle ?
              </h3>
              <p className="text-gray-600">
                La facturation annuelle vous fait économiser 20%. 
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