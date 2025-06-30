'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, ExternalLink } from 'lucide-react';

interface Criterion {
  id: string;
  title: string;
  level: 'A' | 'AA' | 'AAA';
  description: string;
  examples?: string[];
}

interface Theme {
  id: string;
  title: string;
  description: string;
  criteria: Criterion[];
}

const rgaaData: Theme[] = [
  {
    id: "images",
    title: "1. Images",
    description: "Chaque image porteuse d'information a-t-elle une alternative textuelle ?",
    criteria: [
      {
        id: "1.1",
        title: "Chaque image porteuse d'information a-t-elle une alternative textuelle ?",
        level: "A",
        description: "Toute image porteuse d'information doit avoir une alternative textuelle appropriée.",
        examples: ["Images avec attribut alt", "Images objets avec alternative", "Images SVG avec title ou desc"]
      },
      {
        id: "1.2",
        title: "Chaque image de décoration est-elle correctement ignorée par les technologies d'assistance ?",
        level: "A",
        description: "Les images décoratives ne doivent pas être restituées par les lecteurs d'écran.",
        examples: ["Images avec alt vide", "Images CSS de fond", "Images avec role='presentation'"]
      },
      {
        id: "1.3",
        title: "Pour chaque image porteuse d'information ayant une alternative textuelle, cette alternative est-elle pertinente ?",
        level: "A",
        description: "L'alternative textuelle doit décrire le contenu informatif de l'image."
      },
      {
        id: "1.4",
        title: "Pour chaque image utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d'identifier la nature et la fonction de l'image ?",
        level: "A",
        description: "Les CAPTCHA doivent avoir une alternative expliquant leur fonction."
      },
      {
        id: "1.5",
        title: "Pour chaque image utilisée comme CAPTCHA, une solution d'accès alternatif au contenu ou à la fonctionnalité sécurisée par le CAPTCHA est-elle présente ?",
        level: "A",
        description: "Alternative au CAPTCHA visuel (audio, logique, etc.)."
      },
      {
        id: "1.6",
        title: "Chaque image porteuse d'information a-t-elle, si nécessaire, une description détaillée ?",
        level: "A",
        description: "Images complexes nécessitant une description étendue."
      },
      {
        id: "1.7",
        title: "Pour chaque image porteuse d'information ayant une description détaillée, cette description est-elle pertinente ?",
        level: "A",
        description: "La description détaillée doit être complète et exacte."
      },
      {
        id: "1.8",
        title: "Chaque image texte est-elle, si possible, remplacée par du texte stylé ?",
        level: "AA",
        description: "Privilégier le texte HTML avec CSS aux images de texte."
      },
      {
        id: "1.9",
        title: "Chaque légende d'image est-elle, si nécessaire, correctement reliée à l'image correspondante ?",
        level: "A",
        description: "Association correcte image/légende avec figure/figcaption."
      }
    ]
  },
  {
    id: "cadres",
    title: "2. Cadres",
    description: "Les cadres sont-ils correctement titrés ?",
    criteria: [
      {
        id: "2.1",
        title: "Chaque cadre a-t-il un titre de cadre ?",
        level: "A",
        description: "Tout élément frame ou iframe doit avoir un attribut title.",
        examples: ["<iframe title='Carte interactive'>", "<frame title='Menu de navigation'>"]
      },
      {
        id: "2.2",
        title: "Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent ?",
        level: "A",
        description: "Le titre doit décrire le contenu ou la fonction du cadre."
      }
    ]
  },
  {
    id: "couleurs",
    title: "3. Couleurs",
    description: "L'information véhiculée par la couleur est-elle accessible ?",
    criteria: [
      {
        id: "3.1",
        title: "Dans chaque page web, l'information ne doit pas être donnée uniquement par la couleur.",
        level: "A",
        description: "L'information ne doit jamais reposer uniquement sur la couleur.",
        examples: ["Texte + icône", "Forme + couleur", "Position + couleur"]
      },
      {
        id: "3.2",
        title: "Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé ?",
        level: "AA",
        description: "Ratio de contraste minimum : 4.5:1 pour le texte normal, 3:1 pour le texte de grande taille."
      },
      {
        id: "3.3",
        title: "Dans chaque page web, les couleurs utilisées dans les composants d'interface ou les éléments graphiques porteurs d'informations sont-elles suffisamment contrastées ?",
        level: "AA",
        description: "Ratio de contraste minimum de 3:1 pour les éléments d'interface."
      }
    ]
  },
  {
    id: "multimedia",
    title: "4. Multimédia",
    description: "Chaque média temporel a-t-il une alternative ?",
    criteria: [
      {
        id: "4.1",
        title: "Chaque média temporel pré-enregistré a-t-il, si nécessaire, une transcription textuelle ou une audio-description ?",
        level: "A",
        description: "Les vidéos avec information audio doivent avoir une transcription ou audio-description."
      },
      {
        id: "4.2",
        title: "Pour chaque média temporel pré-enregistré ayant une transcription textuelle ou une audio-description, celles-ci sont-elles pertinentes ?",
        level: "A",
        description: "La transcription doit être complète et fidèle."
      },
      {
        id: "4.3",
        title: "Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés ?",
        level: "A",
        description: "Vidéos avec contenu audio informatif doivent avoir des sous-titres."
      },
      {
        id: "4.4",
        title: "Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ?",
        level: "A",
        description: "Les sous-titres doivent transcrire fidèlement les dialogues et sons importants."
      },
      {
        id: "4.5",
        title: "Chaque média temporel en direct a-t-il, si nécessaire, des sous-titres synchronisés ?",
        level: "AA",
        description: "Diffusions en direct avec audio informatif doivent avoir des sous-titres."
      },
      {
        id: "4.6",
        title: "Pour chaque média temporel en direct ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ?",
        level: "AA",
        description: "Qualité et pertinence des sous-titres en direct."
      },
      {
        id: "4.7",
        title: "Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audio-description synchronisée ?",
        level: "AA",
        description: "Audio-description pour les contenus visuels informatifs."
      },
      {
        id: "4.8",
        title: "Pour chaque média temporel pré-enregistré ayant une audio-description synchronisée, cette audio-description est-elle pertinente ?",
        level: "AA",
        description: "L'audio-description doit décrire les éléments visuels importants."
      },
      {
        id: "4.9",
        title: "Chaque média temporel seulement audio pré-enregistré a-t-il, si nécessaire, une transcription textuelle ?",
        level: "A",
        description: "Fichiers audio doivent avoir une transcription textuelle."
      },
      {
        id: "4.10",
        title: "Pour chaque média temporel seulement audio pré-enregistré ayant une transcription textuelle, cette transcription est-elle pertinente ?",
        level: "A",
        description: "La transcription audio doit être complète et exacte."
      },
      {
        id: "4.11",
        title: "Chaque média temporel seulement vidéo a-t-il, si nécessaire, une alternative ?",
        level: "A",
        description: "Vidéos sans audio doivent avoir une alternative textuelle ou audio."
      },
      {
        id: "4.12",
        title: "Pour chaque média temporel seulement vidéo ayant une alternative, cette alternative est-elle pertinente ?",
        level: "A",
        description: "L'alternative doit décrire le contenu informatif de la vidéo."
      },
      {
        id: "4.13",
        title: "Chaque média temporel synchronisé ou seulement vidéo est-il contrôlable par le clavier et tout dispositif de pointage ?",
        level: "A",
        description: "Contrôles de lecture accessibles au clavier."
      }
    ]
  },
  {
    id: "tableaux",
    title: "5. Tableaux",
    description: "Les tableaux restituent-ils correctement leur structure de données ?",
    criteria: [
      {
        id: "5.1",
        title: "Chaque tableau de données complexe a-t-il un résumé ?",
        level: "A",
        description: "Tableaux complexes doivent avoir un résumé de leur structure."
      },
      {
        id: "5.2",
        title: "Pour chaque tableau de données complexe ayant un résumé, ce résumé est-il pertinent ?",
        level: "A",
        description: "Le résumé doit expliquer la structure du tableau."
      },
      {
        id: "5.3",
        title: "Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?",
        level: "A",
        description: "Éviter les tableaux pour la mise en page, utiliser CSS."
      },
      {
        id: "5.4",
        title: "Chaque tableau de données a-t-il un titre ?",
        level: "A",
        description: "Élément caption ou aria-labelledby pour identifier le tableau."
      },
      {
        id: "5.5",
        title: "Pour chaque tableau de données ayant un titre, ce titre est-il pertinent ?",
        level: "A",
        description: "Le titre doit décrire le contenu ou la fonction du tableau."
      },
      {
        id: "5.6",
        title: "Pour chaque tableau de données, chaque en-tête de colonnes et chaque en-tête de lignes sont-ils correctement déclarés ?",
        level: "A",
        description: "Utilisation appropriée des éléments th et scope.",
        examples: ["<th scope='col'>", "<th scope='row'>", "headers et id pour tableaux complexes"]
      },
      {
        id: "5.7",
        title: "Pour chaque tableau de données, la technique appropriée permettant d'associer chaque cellule avec ses en-têtes est-elle utilisée ?",
        level: "A",
        description: "Association correcte cellules/en-têtes dans les tableaux complexes."
      },
      {
        id: "5.8",
        title: "Chaque tableau de mise en forme ne doit pas utiliser d'éléments propres aux tableaux de données ?",
        level: "A",
        description: "Pas de th, caption, summary dans les tableaux de mise en page."
      }
    ]
  },
  {
    id: "liens",
    title: "6. Liens",
    description: "Les liens sont-ils explicites ?",
    criteria: [
      {
        id: "6.1",
        title: "Chaque lien est-il explicite ?",
        level: "A",
        description: "L'intitulé du lien doit permettre de comprendre sa fonction et sa destination.",
        examples: ["'Télécharger le PDF' au lieu de 'Cliquez ici'", "Contexte fourni par title ou aria-label"]
      },
      {
        id: "6.2",
        title: "Dans chaque page web, chaque lien a-t-il un intitulé ?",
        level: "A",
        description: "Aucun lien ne doit être vide ou sans texte accessible."
      }
    ]
  },
  {
    id: "scripts",
    title: "7. Scripts",
    description: "Les scripts sont-ils compatibles avec les technologies d'assistance ?",
    criteria: [
      {
        id: "7.1",
        title: "Chaque script est-il, si nécessaire, compatible avec les technologies d'assistance ?",
        level: "A",
        description: "Les interactions JavaScript doivent être accessibles au clavier."
      },
      {
        id: "7.2",
        title: "Pour chaque script ayant une alternative, cette alternative est-elle pertinente ?",
        level: "A",
        description: "Alternative fonctionnelle équivalente pour les scripts."
      },
      {
        id: "7.3",
        title: "Chaque script est-il contrôlable par le clavier et par tout dispositif de pointage ?",
        level: "A",
        description: "Toutes les fonctionnalités doivent être accessibles au clavier."
      },
      {
        id: "7.4",
        title: "Pour chaque script qui initie un changement de contexte, l'utilisateur est-il averti ou en a-t-il le contrôle ?",
        level: "A",
        description: "Changements de contexte doivent être prévisibles ou contrôlables."
      },
      {
        id: "7.5",
        title: "Dans chaque page web, les messages de statut sont-ils correctement restitués par les technologies d'assistance ?",
        level: "AA",
        description: "Utilisation appropriée d'aria-live, role='status', role='alert'.",
        examples: ["aria-live='polite'", "aria-live='assertive'", "role='status'"]
      }
    ]
  },
  {
    id: "elements-obligatoires",
    title: "8. Éléments obligatoires",
    description: "La page web est-elle définie par un type de document ?",
    criteria: [
      {
        id: "8.1",
        title: "Chaque page web est-elle définie par un type de document ?",
        level: "A",
        description: "Déclaration DOCTYPE valide en début de page."
      },
      {
        id: "8.2",
        title: "Pour chaque page web, le code source généré est-il valide selon le type de document spécifié ?",
        level: "A",
        description: "HTML valide selon le DOCTYPE déclaré."
      },
      {
        id: "8.3",
        title: "Dans chaque page web, la langue par défaut est-elle présente ?",
        level: "A",
        description: "Attribut lang sur l'élément html.",
        examples: ["<html lang='fr'>", "<html lang='en'>"]
      },
      {
        id: "8.4",
        title: "Pour chaque page web ayant une langue par défaut, le code de langue est-il pertinent ?",
        level: "A",
        description: "Le code de langue doit correspondre à la langue principale du contenu."
      },
      {
        id: "8.5",
        title: "Chaque page web a-t-elle un titre de page ?",
        level: "A",
        description: "Élément title obligatoire et non vide."
      },
      {
        id: "8.6",
        title: "Pour chaque page web ayant un titre de page, ce titre est-il pertinent ?",
        level: "A",
        description: "Le titre doit décrire le contenu ou la fonction de la page."
      },
      {
        id: "8.7",
        title: "Dans chaque page web, chaque changement de langue est-il indiqué dans le code source ?",
        level: "A",
        description: "Attribut lang pour indiquer les changements de langue.",
        examples: ["<span lang='en'>Hello</span>", "<blockquote lang='es'>"]
      },
      {
        id: "8.8",
        title: "Dans chaque page web, le code de langue de chaque changement de langue est-il valide et pertinent ?",
        level: "A",
        description: "Codes de langue conformes aux normes ISO."
      },
      {
        id: "8.9",
        title: "Dans chaque page web, les balises ne doivent pas être utilisées uniquement à des fins de présentation ?",
        level: "A",
        description: "Sémantique HTML respectée, éviter le détournement de balises."
      },
      {
        id: "8.10",
        title: "Dans chaque page web, les changements du sens de lecture sont-ils correctement indiqués ?",
        level: "A",
        description: "Attribut dir pour les changements de direction de lecture.",
        examples: ["dir='rtl'", "dir='ltr'"]
      }
    ]
  },
  {
    id: "structuration",
    title: "9. Structuration de l'information",
    description: "L'information est-elle structurée par l'utilisation appropriée de titres ?",
    criteria: [
      {
        id: "9.1",
        title: "Dans chaque page web, l'information est-elle structurée par l'utilisation appropriée de titres ?",
        level: "A",
        description: "La hiérarchie des titres doit être respectée (h1, h2, h3...).",
        examples: ["h1 unique par page", "Hiérarchie logique h1>h2>h3", "Pas de saut de niveau"]
      },
      {
        id: "9.2",
        title: "Dans chaque page web, la structure du document est-elle cohérente ?",
        level: "A",
        description: "Utilisation appropriée des balises de structure HTML5."
      },
      {
        id: "9.3",
        title: "Dans chaque page web, chaque liste est-elle correctement structurée ?",
        level: "A",
        description: "Utilisation des balises ul, ol, li pour les listes."
      },
      {
        id: "9.4",
        title: "Dans chaque page web, chaque citation est-elle correctement indiquée ?",
        level: "A",
        description: "Utilisation des balises blockquote, q, cite pour les citations."
      }
    ]
  },
  {
    id: "presentation",
    title: "10. Présentation de l'information",
    description: "Dans le site web, les informations sont-elles lisibles ?",
    criteria: [
      {
        id: "10.1",
        title: "Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l'information ?",
        level: "A",
        description: "Séparation du contenu et de la présentation avec CSS."
      },
      {
        id: "10.2",
        title: "Dans chaque page web, le contenu visible reste-t-il présent lorsque les feuilles de styles sont désactivées ?",
        level: "A",
        description: "Le contenu doit rester accessible sans CSS."
      },
      {
        id: "10.3",
        title: "Dans chaque page web, l'information reste-t-elle compréhensible lorsque les feuilles de styles sont désactivées ?",
        level: "A",
        description: "La structure logique doit être préservée sans CSS."
      },
      {
        id: "10.4",
        title: "Dans chaque page web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu'à 200% au moins ?",
        level: "AA",
        description: "Le texte doit pouvoir être agrandi à 200% sans perte d'information.",
        examples: ["Zoom navigateur", "Taille de police CSS", "Unités relatives (em, rem)"]
      },
      {
        id: "10.5",
        title: "Dans chaque page web, les déclarations CSS de couleurs de fond d'élément et de police sont-elles correctement utilisées ?",
        level: "A",
        description: "Éviter les couleurs en dur, utiliser des valeurs contrastées."
      },
      {
        id: "10.6",
        title: "Dans chaque page web, chaque lien dont la nature n'est pas évidente est-il visible par rapport au texte environnant ?",
        level: "A",
        description: "Les liens doivent être visuellement distinguables."
      },
      {
        id: "10.7",
        title: "Dans chaque page web, pour chaque élément recevant le focus, la prise de focus est-elle visible ?",
        level: "AA",
        description: "Indicateur visuel du focus clavier obligatoire."
      },
      {
        id: "10.8",
        title: "Pour chaque page web, les contenus cachés sont-ils correctement restitués par les technologies d'assistance ?",
        level: "A",
        description: "Utilisation appropriée de display:none, visibility:hidden, aria-hidden."
      },
      {
        id: "10.9",
        title: "Dans chaque page web, l'information ne doit pas être donnée uniquement par la forme, taille ou position ?",
        level: "A",
        description: "L'information doit être accessible sans perception visuelle."
      },
      {
        id: "10.10",
        title: "Dans chaque page web, l'information reste-t-elle compréhensible même sans les couleurs ?",
        level: "A",
        description: "L'information ne doit pas reposer uniquement sur la couleur."
      },
      {
        id: "10.11",
        title: "Pour chaque page web, les contenus peuvent-ils être présentés sans avoir recours à la fois à un défilement vertical et horizontal ?",
        level: "AA",
        description: "Éviter le double défilement sur mobile et desktop."
      },
      {
        id: "10.12",
        title: "Dans chaque page web, les propriétés d'espacement du texte peuvent-elles être redéfinies par l'utilisateur sans perte de contenu ou de fonctionnalité ?",
        level: "AA",
        description: "Respect des espacements personnalisés utilisateur."
      },
      {
        id: "10.13",
        title: "Dans chaque page web, les contenus additionnels apparaissant à la prise de focus ou au survol d'un composant d'interface sont-ils contrôlables par l'utilisateur ?",
        level: "AA",
        description: "Contrôle des contenus apparaissant au hover/focus."
      },
      {
        id: "10.14",
        title: "Dans chaque page web, les fonctionnalités utilisables ou disponibles au clavier le sont-elles également avec tout dispositif de pointage ?",
        level: "A",
        description: "Équivalence entre interactions clavier et souris."
      }
    ]
  },
  {
    id: "formulaires",
    title: "11. Formulaires",
    description: "Chaque champ de formulaire a-t-il une étiquette ?",
    criteria: [
      {
        id: "11.1",
        title: "Chaque champ de formulaire a-t-il une étiquette ?",
        level: "A",
        description: "Tout champ de saisie doit avoir une étiquette associée.",
        examples: ["<label for='email'>", "aria-label", "aria-labelledby"]
      },
      {
        id: "11.2",
        title: "Chaque étiquette associée à un champ de formulaire est-elle pertinente ?",
        level: "A",
        description: "L'étiquette doit décrire clairement le champ."
      },
      {
        id: "11.3",
        title: "Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ?",
        level: "A",
        description: "Cohérence des étiquettes similaires."
      },
      {
        id: "11.4",
        title: "Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés ?",
        level: "A",
        description: "Proximité visuelle étiquette-champ."
      },
      {
        id: "11.5",
        title: "Dans chaque formulaire, les champs de même nature sont-ils regroupés, si nécessaire ?",
        level: "A",
        description: "Utilisation de fieldset et legend pour les groupes."
      },
      {
        id: "11.6",
        title: "Dans chaque formulaire, chaque regroupement de champs de formulaire a-t-il une légende ?",
        level: "A",
        description: "Élément legend obligatoire dans fieldset."
      },
      {
        id: "11.7",
        title: "Dans chaque formulaire, chaque légende associée à un regroupement de champs de même nature est-elle pertinente ?",
        level: "A",
        description: "La légende doit décrire le groupe de champs."
      },
      {
        id: "11.8",
        title: "Dans chaque formulaire, les items de même nature d'une liste de choix sont-ils regroupés de manière pertinente ?",
        level: "A",
        description: "Regroupement logique des options."
      },
      {
        id: "11.9",
        title: "Dans chaque formulaire, l'intitulé de chaque bouton est-il pertinent ?",
        level: "A",
        description: "Le texte du bouton doit décrire son action.",
        examples: ["'Valider' au lieu de 'Ok'", "'Rechercher' au lieu de 'Go'"]
      },
      {
        id: "11.10",
        title: "Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente ?",
        level: "AA",
        description: "Validation appropriée des données saisies."
      },
      {
        id: "11.11",
        title: "Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ?",
        level: "AA",
        description: "Aide à la correction des erreurs."
      },
      {
        id: "11.12",
        title: "Dans chaque formulaire, les données à caractère financier, juridique ou personnel peuvent-elles être modifiées, mises à jour ou récupérées par l'utilisateur ?",
        level: "AA",
        description: "Contrôle utilisateur sur les données sensibles."
      },
      {
        id: "11.13",
        title: "Dans chaque formulaire, la finalité d'un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l'utilisateur ?",
        level: "AA",
        description: "Attributs autocomplete appropriés."
      }
    ]
  },
  {
    id: "navigation",
    title: "12. Navigation",
    description: "La navigation dans un ensemble de pages est-elle cohérente ?",
    criteria: [
      {
        id: "12.1",
        title: "Chaque ensemble de pages dispose-t-il de deux systèmes de navigation différents, au moins ?",
        level: "AA",
        description: "Menu principal + plan du site ou moteur de recherche."
      },
      {
        id: "12.2",
        title: "Dans chaque ensemble de pages, le menu et les barres de navigation sont-ils toujours à la même place ?",
        level: "AA",
        description: "Position cohérente de la navigation."
      },
      {
        id: "12.3",
        title: "La page d'accueil et les principales sections du site sont-elles accessibles depuis toutes les pages ?",
        level: "AA",
        description: "Navigation globale accessible partout."
      },
      {
        id: "12.4",
        title: "Dans chaque ensemble de pages, la page en cours de consultation est-elle indiquée dans le menu de navigation ?",
        level: "AA",
        description: "Indication visuelle de la page courante."
      },
      {
        id: "12.5",
        title: "Dans chaque ensemble de pages, des liens d'évitement ou d'accès rapide aux groupes de liens importants et à la zone de contenu sont-ils présents ?",
        level: "A",
        description: "Liens 'Aller au contenu principal' obligatoires."
      },
      {
        id: "12.6",
        title: "Les liens d'évitement ou d'accès rapide sont-ils fonctionnels ?",
        level: "A",
        description: "Les liens de navigation rapide doivent fonctionner."
      },
      {
        id: "12.7",
        title: "Dans chaque page d'un ensemble de pages, des liens de navigation interne sont-ils présents ?",
        level: "A",
        description: "Navigation interne à la page (sommaire, ancres)."
      },
      {
        id: "12.8",
        title: "Dans chaque page web, l'ordre de tabulation est-il cohérent ?",
        level: "A",
        description: "Ordre logique de navigation au clavier."
      },
      {
        id: "12.9",
        title: "Dans chaque page web, la navigation ne doit pas contenir de piège au clavier ?",
        level: "A",
        description: "Éviter les pièges de focus clavier."
      },
      {
        id: "12.10",
        title: "Dans chaque page web, les raccourcis clavier n'utilisent-ils que des caractères (lettres, chiffres, ponctuation) ?",
        level: "A",
        description: "Raccourcis clavier appropriés."
      },
      {
        id: "12.11",
        title: "Dans chaque page web, les contenus additionnels apparaissant via les styles CSS uniquement peuvent-ils être rendus visibles au clavier et par tout dispositif de pointage ?",
        level: "A",
        description: "Accessibilité des contenus CSS cachés."
      }
    ]
  },
  {
    id: "consultation",
    title: "13. Consultation",
    description: "L'utilisateur a-t-il le contrôle de la consultation ?",
    criteria: [
      {
        id: "13.1",
        title: "Pour chaque page web, l'utilisateur a-t-il le contrôle de chaque limite de temps modifiant le contenu ?",
        level: "A",
        description: "Contrôle des délais d'expiration.",
        examples: ["Bouton pause", "Extension de délai", "Arrêt du minuteur"]
      },
      {
        id: "13.2",
        title: "Dans chaque page web, l'ouverture d'une nouvelle fenêtre ne doit pas être déclenchée sans action de l'utilisateur ?",
        level: "A",
        description: "Pas d'ouverture automatique de fenêtres."
      },
      {
        id: "13.3",
        title: "Dans chaque page web, chaque document bureautique en téléchargement possède-t-il, si nécessaire, une version accessible ?",
        level: "A",
        description: "Alternative accessible pour les documents PDF, Word..."
      },
      {
        id: "13.4",
        title: "Pour chaque document bureautique ayant une version accessible, cette version offre-t-elle la même information ?",
        level: "A",
        description: "Équivalence de contenu entre versions."
      },
      {
        id: "13.5",
        title: "Dans chaque page web, chaque contenu cryptique (art ascii, émoticône, syntaxe cryptique) a-t-il une alternative ?",
        level: "A",
        description: "Alternative textuelle pour contenu cryptique."
      },
      {
        id: "13.6",
        title: "Dans chaque page web, pour chaque contenu cryptique (art ascii, émoticône, syntaxe cryptique) ayant une alternative, cette alternative est-elle pertinente ?",
        level: "A",
        description: "Pertinence de l'alternative au contenu cryptique."
      },
      {
        id: "13.7",
        title: "Dans chaque page web, les changements brusques de luminosité ou les effets de flash sont-ils correctement utilisés ?",
        level: "A",
        description: "Éviter les flashs dangereux (épilepsie)."
      },
      {
        id: "13.8",
        title: "Dans chaque page web, chaque contenu en mouvement ou clignotant est-il contrôlable par l'utilisateur ?",
        level: "A",
        description: "Contrôle des animations et clignotements."
      },
      {
        id: "13.9",
        title: "Dans chaque page web, le contenu proposé est-il consultable quelle que soit l'orientation de l'écran ?",
        level: "AA",
        description: "Support portrait et paysage obligatoire."
      },
      {
        id: "13.10",
        title: "Dans chaque page web, les fonctionnalités utilisables ou disponibles au geste complexe peuvent-elles être également disponibles au geste simple ?",
        level: "A",
        description: "Alternative aux gestes complexes (pincement, rotation)."
      },
      {
        id: "13.11",
        title: "Dans chaque page web, les actions déclenchées au moyen d'un dispositif de pointage peuvent-elles faire l'objet d'une annulation ?",
        level: "A",
        description: "Possibilité d'annuler les actions de pointage."
      },
      {
        id: "13.12",
        title: "Dans chaque page web, la taille de la zone d'activation des composants d'interface est-elle suffisante ?",
        level: "AAA",
        description: "Taille minimum de 44x44 pixels pour les zones de clic."
      }
    ]
  },
  {
    id: "criteres-aaa",
    title: "Critères AAA (Excellence)",
    description: "Critères de niveau AAA pour une accessibilité exemplaire",
    criteria: [
      {
        id: "1.2.6",
        title: "Langue des signes (préenregistrée)",
        level: "AAA",
        description: "Fournir une interprétation en langue des signes pour tout contenu audio préenregistré."
      },
      {
        id: "1.2.7",
        title: "Audio-description étendue (pré-enregistrée)",
        level: "AAA",
        description: "Fournir une audio-description étendue pour les vidéos préenregistrées."
      },
      {
        id: "1.2.8",
        title: "Version de remplacement pour un média temporel (pré-enregistré)",
        level: "AAA",
        description: "Alternative textuelle complète pour tous les médias temporels préenregistrés."
      },
      {
        id: "1.2.9",
        title: "Seulement audio (en direct)",
        level: "AAA",
        description: "Alternative équivalente en temps réel pour le contenu audio diffusé en direct."
      },
      {
        id: "1.3.6",
        title: "Identifier la fonction",
        level: "AAA",
        description: "Dans un contenu implémenté en utilisant des langages de balisage, le but de chaque champ de saisie collectant des informations sur l'utilisateur peut être déterminé par un programme informatique."
      },
      {
        id: "1.4.6",
        title: "Contraste (amélioré)",
        level: "AAA",
        description: "Rapport de contraste de 7:1 pour le texte normal et 4.5:1 pour le texte de grande taille."
      },
      {
        id: "1.4.7",
        title: "Arrière-plan sonore de faible volume ou absent",
        level: "AAA",
        description: "Pour un contenu audio préenregistré qui contient principalement un discours en avant-plan et qui n'est pas un CAPTCHA audio ou un logo audio, au moins une des conditions suivantes est vraie : pas d'arrière-plan, arrière-plan désactivable, arrière-plan de faible volume."
      },
      {
        id: "1.4.8",
        title: "Présentation visuelle",
        level: "AAA",
        description: "Pour la présentation visuelle de blocs de texte : largeur de ligne max 80 caractères, texte non justifié, espacement des lignes au moins 1.5x, espacement des paragraphes au moins 2.25x."
      },
      {
        id: "1.4.9",
        title: "Texte sous forme d'image (sans exception)",
        level: "AAA",
        description: "Les images de texte ne sont utilisées que pour la décoration pure ou lorsqu'une présentation particulière du texte est essentielle."
      },
      {
        id: "2.1.3",
        title: "Clavier (pas d'exception)",
        level: "AAA",
        description: "Toutes les fonctionnalités du contenu sont utilisables au clavier sans exception."
      },
      {
        id: "2.2.3",
        title: "Pas de délai d'exécution",
        level: "AAA",
        description: "Le chronométrage n'est pas un élément essentiel de l'événement ou de l'activité présentée par le contenu."
      },
      {
        id: "2.2.4",
        title: "Interruptions",
        level: "AAA",
        description: "Les interruptions peuvent être reportées ou supprimées par l'utilisateur, sauf les interruptions qui impliquent une urgence."
      },
      {
        id: "2.2.5",
        title: "Nouvelle authentification",
        level: "AAA",
        description: "Quand une session authentifiée expire, l'utilisateur peut continuer l'activité sans perte de données après une nouvelle authentification."
      },
      {
        id: "2.2.6",
        title: "Délais d'expiration",
        level: "AAA",
        description: "Les utilisateurs sont avertis de la durée de toute inactivité qui pourrait causer une perte de données."
      },
      {
        id: "2.3.2",
        title: "Trois flashs",
        level: "AAA",
        description: "Les pages web ne contiennent aucun élément qui flashe plus de trois fois dans n'importe quel intervalle d'une seconde."
      },
      {
        id: "2.3.3",
        title: "Animation résultant d'interactions",
        level: "AAA",
        description: "L'animation peut être désactivée, sauf quand l'animation est essentielle à la fonctionnalité ou à l'information véhiculée."
      },
      {
        id: "2.4.8",
        title: "Localisation",
        level: "AAA",
        description: "De l'information sur la localisation de l'utilisateur dans un ensemble de pages web est disponible."
      },
      {
        id: "2.4.9",
        title: "Fonction du lien (lien uniquement)",
        level: "AAA",
        description: "Un mécanisme est disponible pour permettre d'identifier la fonction de chaque lien à partir du seul texte du lien."
      },
      {
        id: "2.4.10",
        title: "En-têtes de section",
        level: "AAA",
        description: "Les en-têtes de section sont utilisés pour organiser le contenu."
      },
      {
        id: "2.5.5",
        title: "Taille de la cible",
        level: "AAA",
        description: "La taille de la cible pour les entrées du pointeur est d'au moins 44 par 44 pixels CSS."
      },
      {
        id: "2.5.6",
        title: "Modalités d'entrées concurrentes",
        level: "AAA",
        description: "Le contenu web ne restreint pas l'utilisation des modalités d'entrée disponibles sur une plateforme."
      },
      {
        id: "3.1.3",
        title: "Mots rares",
        level: "AAA",
        description: "Un mécanisme est disponible pour identifier la définition spécifique des mots ou expressions utilisées de façon inhabituelle."
      },
      {
        id: "3.1.4",
        title: "Abréviations",
        level: "AAA",
        description: "Un mécanisme permettant d'identifier la forme étendue ou la signification des abréviations est disponible."
      },
      {
        id: "3.1.5",
        title: "Niveau de lecture",
        level: "AAA",
        description: "Quand le texte exige des aptitudes de lecture plus avancées que le niveau d'études secondaires de premier cycle, un contenu supplémentaire ou une version qui n'exige pas d'aptitudes de lecture plus avancées que le niveau d'études secondaires de premier cycle, est disponible."
      },
      {
        id: "3.1.6",
        title: "Prononciation",
        level: "AAA",
        description: "Un mécanisme est disponible pour identifier la prononciation spécifique des mots quand la signification des mots, dans le contexte, est ambiguë sans la connaissance de leur prononciation."
      },
      {
        id: "3.2.5",
        title: "Changement à la demande",
        level: "AAA",
        description: "Les changements de contexte sont initiés seulement sur demande de l'utilisateur ou un mécanisme est disponible pour désactiver de tels changements."
      },
      {
        id: "3.3.5",
        title: "Aide",
        level: "AAA",
        description: "Une aide contextuelle est disponible."
      },
      {
        id: "3.3.6",
        title: "Prévention des erreurs (toutes)",
        level: "AAA",
        description: "Pour les pages web qui exigent que l'utilisateur soumette des informations, au moins une des conditions suivantes est vraie : réversible, vérifiée, confirmée."
      }
    ]
  }
];

export default function RGAAReference() {
  const [expandedThemes, setExpandedThemes] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'A' | 'AA' | 'AAA'>('all');

  const toggleTheme = (themeId: string) => {
    setExpandedThemes(prev => 
      prev.includes(themeId) 
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    );
  };

  const filteredThemes = rgaaData.map(theme => ({
    ...theme,
    criteria: theme.criteria.filter(criterion => 
      selectedLevel === 'all' || criterion.level === selectedLevel
    )
  })).filter(theme => theme.criteria.length > 0);

  const getLevelColor = (level: 'A' | 'AA' | 'AAA') => {
    switch (level) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'AA': return 'bg-yellow-100 text-yellow-800';
      case 'AAA': return 'bg-red-100 text-red-800';
    }
  };

  const getLevelDescription = (level: 'A' | 'AA' | 'AAA') => {
    switch (level) {
      case 'A': return 'Niveau minimal d\'accessibilité';
      case 'AA': return 'Niveau standard légal en France';
      case 'AAA': return 'Niveau excellence d\'accessibilité';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center mb-6">
            <BookOpen className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Référentiel RGAA 4.1</h1>
              <p className="text-gray-600 mt-2">
                Référentiel Général d'Amélioration de l'Accessibilité - Version 4.1
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="font-medium text-green-800">Niveau A</span>
              </div>
              <p className="text-green-700 text-sm mt-1">Critères de base obligatoires</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                <span className="font-medium text-yellow-800">Niveau AA</span>
              </div>
              <p className="text-yellow-700 text-sm mt-1">Standard légal français/européen</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span className="font-medium text-red-800">Niveau AAA</span>
              </div>
              <p className="text-red-700 text-sm mt-1">Excellence accessibilité</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label htmlFor="level-filter" className="font-medium text-gray-700">
                Filtrer par niveau :
              </label>
              <select
                id="level-filter"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as 'all' | 'A' | 'AA' | 'AAA')}
                className="border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="all">Tous les niveaux</option>
                <option value="A">Niveau A</option>
                <option value="AA">Niveau AA</option>
                <option value="AAA">Niveau AAA</option>
              </select>
            </div>
            
            <a
              href="https://rgaa.numerique.gouv.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Documentation officielle
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

        {/* Themes */}
        <div className="space-y-6">
          {filteredThemes.map((theme) => (
            <div key={theme.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleTheme(theme.id)}
                className="w-full px-8 py-6 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{theme.title}</h2>
                    <p className="text-gray-600">{theme.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {theme.criteria.length} critère{theme.criteria.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center justify-center flex-shrink-0 ml-6 mr-2">
                    {expandedThemes.includes(theme.id) ? (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {expandedThemes.includes(theme.id) && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="px-8 py-6 space-y-6">
                    {theme.criteria.map((criterion) => (
                      <div key={criterion.id} className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded mr-3">
                                {criterion.id}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(criterion.level)}`}>
                                Niveau {criterion.level}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {criterion.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {criterion.description}
                            </p>
                          </div>
                        </div>

                        {criterion.examples && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Exemples :</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {criterion.examples.map((example, index) => (
                                <li key={index} className="text-gray-600 text-sm">{example}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredThemes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun critère trouvé pour ce niveau.</p>
          </div>
        )}
      </div>
    </div>
  );
} 