'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, Plus, Edit3, Trash2, Tag, Calendar, 
  Clock, CheckCircle, Circle, AlertCircle, Target, 
  BarChart3, FileText, Kanban, Settings,
  MessageSquare, Flag, User, Archive, Image, Upload, X, Palette, Lightbulb,
  Filter, Search, Download, Share2, Eye, EyeOff, Star, StarOff, AlertTriangle, Info, HelpCircle, Zap, Shield, Cpu, BookOpen
} from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { AuditResult, ComparativeResult, RGAAViolation } from '@/types/audit';
import ManualAuditPage from '@/components/ManualAuditPage';
import { useAuth } from '@/contexts/AuthContext';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';
import RGAAReference from '@/components/RGAAReference';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';

// Interface étendue pour les violations avec source
interface ExtendedRGAAViolation extends RGAAViolation {
  source?: 'manual' | 'automatic';
}

interface AuditNote {
  id: string;
  content: string;
  timestamp: string;
  tags: string[];
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'gray' | 'orange' | 'teal';
}

interface KanbanCard {
  id: string;
  violation: ExtendedRGAAViolation;
  status: 'todo' | 'inprogress' | 'validated' | 'postponed';
  assignee?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
  updatedAt: string;
  // Nouveaux champs de personnalisation
  customTitle?: string;
  customDescription?: string;
  colorTag?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'gray';
  screenshot?: {
    name: string;
    data: string; // Base64 data URL
    uploadedAt: string;
  };
}

interface AuditManagement {
  auditId: string;
  notes: AuditNote[];
  kanbanCards: KanbanCard[];
  settings: {
    assignees: string[];
    tags: string[];
  };
  lastUpdated: string;
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800 border-gray-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

const colorTagStyles = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  indigo: 'bg-indigo-500',
  gray: 'bg-gray-500'
};

const noteColorStyles = {
  red: { bg: 'bg-red-50', border: 'border-red-200', accent: 'bg-red-500' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'bg-blue-500' },
  green: { bg: 'bg-green-50', border: 'border-green-200', accent: 'bg-green-500' },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', accent: 'bg-yellow-500' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'bg-purple-500' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', accent: 'bg-pink-500' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', accent: 'bg-indigo-500' },
  gray: { bg: 'bg-gray-50', border: 'border-gray-200', accent: 'bg-gray-500' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', accent: 'bg-orange-500' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', accent: 'bg-teal-500' }
};

const statusConfig = {
  todo: { 
    title: 'À traiter', 
    color: 'bg-gray-50 border-gray-200', 
    icon: Circle,
    textColor: 'text-gray-700'
  },
  inprogress: { 
    title: 'En cours', 
    color: 'bg-blue-50 border-blue-200', 
    icon: Clock,
    textColor: 'text-blue-700'
  },
  validated: { 
    title: 'Validé', 
    color: 'bg-green-50 border-green-200', 
    icon: CheckCircle,
    textColor: 'text-green-700'
  },
  postponed: { 
    title: 'Reporté', 
    color: 'bg-orange-50 border-orange-200', 
    icon: AlertCircle,
    textColor: 'text-orange-700'
  }
};

// Composant pour ajouter manuellement des violations
interface ManualViolationFormProps {
  onAddViolation: (violation: ExtendedRGAAViolation) => void;
}

function ManualViolationForm({ onAddViolation }: ManualViolationFormProps) {
  const [criterion, setCriterion] = useState('');
  const [description, setDescription] = useState('');
  const [element, setElement] = useState('');
  const [htmlSnippet, setHtmlSnippet] = useState('');
  const [impact, setImpact] = useState<'moderate' | 'serious' | 'critical'>('moderate');
  const [level, setLevel] = useState<'A' | 'AA' | 'AAA'>('AA');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!criterion.trim() || !description.trim()) {
      return;
    }

    const violation: ExtendedRGAAViolation = {
      criterion: criterion.trim(),
      description: description.trim(),
      level,
      impact,
      recommendation: '', // Ajout d'une valeur par défaut
      source: 'manual',
      ...(element.trim() && { element: element.trim() }),
      ...(htmlSnippet.trim() && { htmlSnippet: htmlSnippet.trim() })
    };

    onAddViolation(violation);
    
    // Reset form
    setCriterion('');
    setDescription('');
    setElement('');
    setHtmlSnippet('');
    setImpact('moderate');
    setLevel('AA');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="criterion" className="block text-sm font-medium text-gray-700 mb-1">
            Critère RGAA *
          </label>
          <input
            type="text"
            id="criterion"
            value={criterion}
            onChange={(e) => setCriterion(e.target.value)}
            placeholder="Ex: 1.1, 3.2, 11.1..."
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
            Niveau
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value as 'A' | 'AA' | 'AAA')}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="A">A</option>
            <option value="AA">AA</option>
            <option value="AAA">AAA</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description de la violation *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez précisément la violation constatée..."
          required
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="impact" className="block text-sm font-medium text-gray-700 mb-1">
          Impact
        </label>
        <select
          id="impact"
          value={impact}
          onChange={(e) => setImpact(e.target.value as 'moderate' | 'serious' | 'critical')}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="moderate">Modéré</option>
          <option value="serious">Sérieux</option>
          <option value="critical">Critique</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="element" className="block text-sm font-medium text-gray-700 mb-1">
          Sélecteur CSS (optionnel)
        </label>
        <input
          type="text"
          id="element"
          value={element}
          onChange={(e) => setElement(e.target.value)}
          placeholder="Ex: .header img, #main-nav a..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="htmlSnippet" className="block text-sm font-medium text-gray-700 mb-1">
          Code HTML concerné (optionnel)
        </label>
        <textarea
          id="htmlSnippet"
          value={htmlSnippet}
          onChange={(e) => setHtmlSnippet(e.target.value)}
          placeholder="<img src='...' /> ou autre code HTML..."
          rows={2}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!criterion.trim() || !description.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter la violation
        </button>
      </div>
    </form>
  );
}

// Composant pour zone de drop vide
function EmptyDropZone({ status, isOver }: { status: string; isOver: boolean }) {
  const { setNodeRef } = useDroppable({ 
    id: `empty-${status}` 
  });

  return (
    <div 
      ref={setNodeRef}
      className={`text-center py-8 text-gray-400 text-sm ${
        isOver ? 'text-blue-500 font-medium' : ''
      }`}
    >
      {isOver ? '↓ Déposer ici' : 'Glissez des cartes ici'}
    </div>
  );
}

// Composant de carte draggable
function DraggableCard({ card, onCardClick }: { card: KanbanCard; onCardClick: (card: KanbanCard) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Empêcher la propagation si on clique sur la zone de drag
    if ((e.target as HTMLElement).closest('[data-drag-handle]')) {
      return;
    }
    onCardClick(card);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* En-tête avec handle de drag compact */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 mb-1 flex items-center">
            {/* Handle de drag compact - seulement les icônes */}
            <span 
              {...attributes}
              {...listeners}
              data-drag-handle
              className="mr-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 -m-1 rounded hover:bg-gray-100"
              title="Glisser pour déplacer"
              onClick={(e) => e.stopPropagation()}
            >
              ⋮⋮
            </span>
            {/* Pastille de couleur si définie */}
            {card.colorTag && (
              <span className={`w-3 h-3 rounded-full mr-2 ${colorTagStyles[card.colorTag]}`}></span>
            )}
            {/* Titre personnalisé ou critère par défaut */}
            {card.customTitle || `Critère ${card.violation.criterion}`}
          </div>
          <div className="text-xs text-gray-500 ml-6">
            {card.customDescription ? (
              <span className="italic">{card.customDescription}</span>
            ) : (
              `Niveau ${card.violation.level}`
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[card.priority]}`}>
            {card.priority}
          </span>
        </div>
      </div>
      
      {/* Contenu de la carte (entièrement cliquable) */}
      <div className="pl-6">
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {card.violation.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{new Date(card.updatedAt).toLocaleDateString('fr-FR')}</span>
          {/* Indicateur de screenshot */}
          {card.screenshot && (
            <div 
              className="flex items-center justify-center w-5 h-5 bg-blue-100 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-200 transition-colors" 
              title="Screenshot attaché"
            >
              <Image className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant de colonne droppable
function DroppableColumn({ 
  id, 
  status, 
  config, 
  cards, 
  onCardClick 
}: { 
  id: string;
  status: string;
  config: any;
  cards: KanbanCard[];
  onCardClick: (card: KanbanCard) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ 
    id: status // Utiliser le status comme ID pour faciliter la détection
  });
  const Icon = config.icon;

  return (
    <div 
      ref={setNodeRef}
      className={`rounded-lg border-2 ${config.color} min-h-96 transition-all duration-200 ${
        isOver ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50 bg-opacity-50' : ''
      }`}
    >
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Icon className={`w-5 h-5 mr-2 ${config.textColor}`} />
            <h3 className={`font-medium ${config.textColor}`}>{config.title}</h3>
          </div>
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${priorityColors.low}`}>
            {cards.length}
          </span>
        </div>
      </div>

      {/* Zone de contenu droppable pour les cartes vides */}
      <div className={`p-4 min-h-64 ${isOver ? 'bg-blue-50 bg-opacity-30' : ''}`}>
        <SortableContext 
          items={cards.map(card => card.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {cards.map(card => (
              <DraggableCard 
                key={card.id} 
                card={card} 
                onCardClick={onCardClick}
              />
            ))}
          </div>
        </SortableContext>
        
        {/* Zone de drop vide avec son propre droppable */}
        {cards.length === 0 && (
          <EmptyDropZone status={status} isOver={isOver} />
        )}
      </div>
    </div>
  );
}

export default function AuditManagementPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const auditId = params.id as string;
  
  // États pour la gestion des données
  const [auditData, setAuditData] = useState<AuditResult | ComparativeResult | null>(null);
  const [management, setManagement] = useState<AuditManagement | null>(null);
  const [activeTab, setActiveTab] = useState<'kanban' | 'notes' | 'manual' | 'guide' | 'rgaa'>('kanban');
  const [selectedCard, setSelectedCard] = useState<KanbanCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les notes
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteColor, setNewNoteColor] = useState<AuditNote['color']>();
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editNoteContent, setEditNoteContent] = useState('');
  const [editNoteColor, setEditNoteColor] = useState<AuditNote['color']>();

  // États pour le drag & drop
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // États pour les violations manuelles
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualViolations, setManualViolations] = useState<ExtendedRGAAViolation[]>([]);

  // États pour les cartes
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editCardTitle, setEditCardTitle] = useState('');
  const [editCardDescription, setEditCardDescription] = useState('');
  const [editCardColor, setEditCardColor] = useState<KanbanCard['colorTag']>();
  const [uploadingScreenshot, setUploadingScreenshot] = useState<string | null>(null);

  // Référence pour les modales
  const modalRef = useRef<HTMLDivElement>(null);

  // Navigation toujours cachée en gestion d'audit
  const hideNav = true;
  const showContent = true;

  // Charger les données d'audit et de gestion
  useEffect(() => {
    const loadAuditData = async () => {
      try {
        if (!user) {
          setError('Utilisateur non connecté');
          setIsLoading(false);
          return;
        }

        console.log('🔍 Chargement audit depuis API pour gestion:', user?.email, 'auditId:', auditId);
        
        let audit = null;

        // D'abord essayer de charger depuis l'API Supabase (comme AuditHistory)
        try {
          const response = await fetch(`/api/audit-history?userEmail=${encodeURIComponent(user?.email || '')}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Historique API chargé pour gestion:', data.total, 'audits');
            
            if (data.success && data.audits) {
              audit = data.audits.find((a: any) => a.id === auditId);
              console.log('🔍 Audit trouvé dans API:', !!audit);
            }
          } else {
            console.error('❌ Erreur API historique pour gestion:', response.status, response.statusText);
          }
        } catch (apiError) {
          console.error('❌ Erreur lors du chargement API pour gestion:', apiError);
        }

        // Fallback vers localStorage si pas trouvé dans l'API
        if (!audit) {
          console.log('📂 Fallback vers localStorage pour gestion...');
          const historyKey = `rgaa-audit-history-${user.email}`;
          const stored = localStorage.getItem(historyKey);
          
          if (stored) {
            const audits: any[] = JSON.parse(stored);
            audit = audits.find(a => a.id === auditId);
            console.log('🔍 Audit trouvé dans localStorage:', !!audit);
          }
        }

        if (audit) {
          setAuditData(audit.result);
          
          // Charger ou créer les données de gestion
          const managementKey = `audit-management-${auditId}-${user.email}`;
          const storedManagement = localStorage.getItem(managementKey);
          
          if (storedManagement) {
            setManagement(JSON.parse(storedManagement));
          } else {
            // Créer de nouvelles données de gestion
            const newManagement: AuditManagement = {
              auditId,
              notes: [],
              kanbanCards: audit.result.violations?.map((violation: RGAAViolation, index: number) => ({
                id: `card-${index}`,
                violation: { ...violation, source: 'automatic' as const },
                status: 'todo' as const,
                priority: violation.impact === 'critical' ? 'critical' : 
                         violation.impact === 'serious' ? 'high' : 
                         violation.impact === 'moderate' ? 'medium' : 'low',
                notes: '',
                updatedAt: new Date().toISOString(),
                customTitle: `Critère ${violation.criterion}`,
                customDescription: violation.description,
                colorTag: violation.impact === 'critical' ? 'red' : 
                         violation.impact === 'serious' ? 'red' : 
                         violation.impact === 'moderate' ? 'yellow' : 'gray'
              })) || [],
              settings: {
                assignees: [],
                tags: []
              },
              lastUpdated: new Date().toISOString()
            };
            
            setManagement(newManagement);
            localStorage.setItem(managementKey, JSON.stringify(newManagement));
          }
        } else {
          setError('Audit non trouvé dans l\'historique');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de gestion:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    loadAuditData();
  }, [auditId, user]);

  // Sauvegarder les données de gestion
  const saveManagement = (updatedManagement: AuditManagement) => {
    try {
      if (!user) return;
      
      const managementKey = `audit-management-${auditId}-${user.email}`;
      localStorage.setItem(managementKey, JSON.stringify(updatedManagement));
      setManagement(updatedManagement);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Fonctions pour les notes
  const addNote = () => {
    if (!management || !newNoteContent.trim()) return;
    
    const newNote: AuditNote = {
      id: `note-${Date.now()}`,
      content: newNoteContent.trim(),
      timestamp: new Date().toISOString(),
      tags: [],
      color: newNoteColor
    };
    
    const updatedManagement = {
      ...management,
      notes: [...management.notes, newNote],
      lastUpdated: new Date().toISOString()
    };
    
    saveManagement(updatedManagement);
    setNewNoteContent('');
    setNewNoteColor(undefined);
  };

  const deleteNote = (noteId: string) => {
    if (!management) return;
    
    const updatedManagement = {
      ...management,
      notes: management.notes.filter(note => note.id !== noteId),
      lastUpdated: new Date().toISOString()
    };
    
    saveManagement(updatedManagement);
  };

  const startEditNote = (note: AuditNote) => {
    setEditingNote(note.id);
    setEditNoteContent(note.content);
  };

  const cancelEditNote = () => {
    setEditingNote(null);
    setEditNoteContent('');
  };

  const saveEditNote = (noteId: string) => {
    if (!management || !editNoteContent.trim()) return;
    
    const updatedManagement = {
      ...management,
      notes: management.notes.map(note => 
        note.id === noteId 
          ? { ...note, content: editNoteContent.trim() }
          : note
      ),
      lastUpdated: new Date().toISOString()
    };
    
    saveManagement(updatedManagement);
    setEditingNote(null);
    setEditNoteContent('');
  };

  const updateNoteColor = (noteId: string, color: AuditNote['color']) => {
    if (!management) return;
    
    const updatedManagement = {
      ...management,
      notes: management.notes.map(note => 
        note.id === noteId 
          ? { ...note, color }
          : note
      ),
      lastUpdated: new Date().toISOString()
    };
    
    saveManagement(updatedManagement);
  };

  // Fonctions pour les cartes Kanban
  const moveCard = (cardId: string, newStatus: KanbanCard['status']) => {
    if (!management) return;
    
    const updatedManagement = {
      ...management,
      kanbanCards: management.kanbanCards.map(card => 
        card.id === cardId 
          ? { ...card, status: newStatus, updatedAt: new Date().toISOString() }
          : card
      ),
      lastUpdated: new Date().toISOString()
    };
    
    saveManagement(updatedManagement);
  };

  // Gestion du drag & drop
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const cardId = active.id as string;
      let newStatus = over.id as string;
      if (newStatus.startsWith('empty-')) {
        newStatus = newStatus.replace('empty-', '');
      }
      if (["todo", "inprogress", "validated", "postponed"].includes(newStatus)) {
        moveCard(cardId, newStatus as KanbanCard['status']);
      }
    }
    
    setActiveId(null);
  };

  // Gestion des clics en dehors des modales
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.modal-content') && !target.closest('.card-actions')) {
        setSelectedCard(null);
        setEditingCard(null);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedCard(null);
        setEditingCard(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Fonctions pour la personnalisation des cartes
  const updateCardPriority = (cardId: string, priority: KanbanCard['priority']) => {
    if (!management) return;
    
    const updatedManagement = {
      ...management,
      kanbanCards: management.kanbanCards.map(card => 
        card.id === cardId 
          ? { ...card, priority, updatedAt: new Date().toISOString() }
          : card
      ),
      lastUpdated: new Date().toISOString()
    };
    
    saveManagement(updatedManagement);
  };

  const updateCardTitle = (cardId: string, customTitle: string) => {
    if (!management) return;
    
    const updatedManagement = {
      ...management,
      kanbanCards: management.kanbanCards.map(card => 
        card.id === cardId 
          ? { ...card, customTitle, updatedAt: new Date().toISOString() }
          : card
      ),
      lastUpdated: new Date().toISOString()
    };
    
    saveManagement(updatedManagement);
  };

  const updateCardDescription = (cardId: string, customDescription: string) => {
    if (!management) return;
    
    const updatedManagement = {
      ...management,
      kanbanCards: management.kanbanCards.map(card => 
        card.id === cardId 
          ? { ...card, customDescription, updatedAt: new Date().toISOString() }
          : card
      ),
      lastUpdated: new Date().toISOString()
    };
    
    saveManagement(updatedManagement);
  };

  const updateCardColor = (cardId: string, colorTag: KanbanCard['colorTag']) => {
    if (!management) return;
    
    const updatedManagement = {
      ...management,
      kanbanCards: management.kanbanCards.map(card => 
        card.id === cardId 
          ? { ...card, colorTag, updatedAt: new Date().toISOString() }
          : card
      ),
      lastUpdated: new Date().toISOString()
    };
    
    saveManagement(updatedManagement);
  };

  const updateCardScreenshot = (cardId: string, screenshot: KanbanCard['screenshot']) => {
    if (!management) return;
    
    const updatedManagement = {
      ...management,
      kanbanCards: management.kanbanCards.map(card => 
        card.id === cardId 
          ? { ...card, screenshot, updatedAt: new Date().toISOString() }
          : card
      ),
      lastUpdated: new Date().toISOString()
    };
    
    saveManagement(updatedManagement);
  };

  // Gestion des uploads de fichiers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadingScreenshot) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const screenshot = {
        name: file.name,
        data: e.target?.result as string,
        uploadedAt: new Date().toISOString()
      };
      
      updateCardScreenshot(uploadingScreenshot, screenshot);
      setUploadingScreenshot(null);
    };
    reader.readAsDataURL(file);
  };

  const removeScreenshot = () => {
    if (!selectedCard) return;
    updateCardScreenshot(selectedCard.id, undefined);
  };

  // Calculer les statistiques
  const getStats = () => {
    if (!management) return { total: 0, todo: 0, inprogress: 0, validated: 0, postponed: 0 };
    
    const cards = management.kanbanCards;
    return {
      total: cards.length,
      todo: cards.filter(card => card.status === 'todo').length,
      inprogress: cards.filter(card => card.status === 'inprogress').length,
      validated: cards.filter(card => card.status === 'validated').length,
      postponed: cards.filter(card => card.status === 'postponed').length
    };
  };

  const stats = getStats();

  // Gestion des violations manuelles
  const addManualViolation = (violation: ExtendedRGAAViolation) => {
    if (!management) return;
    
    const newCard: KanbanCard = {
      id: `manual-${Date.now()}`,
      violation,
      status: 'todo',
      priority: violation.impact === 'critical' ? 'critical' : 
               violation.impact === 'serious' ? 'high' : 
               violation.impact === 'moderate' ? 'medium' : 'low',
      notes: '',
      updatedAt: new Date().toISOString(),
      customTitle: `Critère ${violation.criterion}`,
      customDescription: violation.description
    };
    
    const updatedManagement = {
      ...management,
      kanbanCards: [...management.kanbanCards, newCard],
      lastUpdated: new Date().toISOString()
    };
    
    saveManagement(updatedManagement);
    setManualViolations([...manualViolations, violation]);
    setShowManualForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la gestion d'audit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/?section=history')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour à l'historique
          </button>
        </div>
      </div>
    );
  }

  if (!auditData || !management) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit non trouvé</h2>
          <p className="text-gray-600 mb-4">L'audit demandé n'existe pas ou n'est plus disponible.</p>
          <button
            onClick={() => router.push('/?section=history')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour à l'historique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Topbar Navigation masquée */}
      <div className={`${hideNav ? 'hidden' : ''} sticky top-0 z-50`}>
        <TopBar activeSection="home" onSectionChange={() => {}} onAnalyzeClick={() => {}} />
      </div>
      {/* Sidebar masquée */}
      <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 ${hideNav ? 'hidden' : ''}`}>
        <Sidebar activeSection="history" onSectionChange={() => {}} />
      </div>
      {/* Main Content */}
      <main className={`w-full min-h-screen`}>
        {/* En-tête avec bouton de retour */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/?section=history')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Retour à l'historique"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestion d'Audit</h1>
                  <p className="text-sm text-gray-500">
                    {auditData.url} • {new Date(management.lastUpdated).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-500">
                  Dernière modification: {new Date(management.lastUpdated).toLocaleString('fr-FR')}
                </div>
              </div>
            </div>

            {/* Navigation par onglets */}
            <div className="mt-6 border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { id: 'kanban', label: 'Tableau Kanban', icon: Kanban },
                  { id: 'notes', label: 'Notes', icon: FileText },
                  { id: 'manual', label: 'Audit manuel', icon: User },
                  { id: 'guide', label: 'Guide d\'audit manuel', icon: Lightbulb },
                  { id: 'rgaa', label: 'Référentiel RGAA', icon: BookOpen },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Statistiques rapides */}
          {/* Bloc supprimé : synthèse des violations */}

          {/* Contenu des onglets */}
          {activeTab === 'kanban' && (
            <DndContext
              sensors={sensors}
              collisionDetection={rectIntersection}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const cards = (management?.kanbanCards && Array.isArray(management.kanbanCards)) 
                    ? management.kanbanCards.filter(card => card.status === status)
                    : [];
                  
                  return (
                    <DroppableColumn
                      key={status}
                      id={status}
                      status={status}
                      config={config}
                      cards={cards}
                      onCardClick={setSelectedCard}
                    />
                  );
                })}
              </div>

              <DragOverlay>
                {activeId ? (
                  <div className="bg-white rounded-lg border-2 border-blue-400 p-3 shadow-2xl opacity-95 rotate-2 scale-105 transition-transform">
                    {(() => {
                      const draggedCard = (management?.kanbanCards && Array.isArray(management.kanbanCards))
                        ? management.kanbanCards.find(card => card.id === activeId)
                        : null;
                      return draggedCard ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            Critère {draggedCard.violation.criterion}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            📦 En cours de déplacement...
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          Glisser pour déplacer...
                        </div>
                      );
                    })()}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}

          {activeTab === 'notes' && (
            <div className="max-w-4xl mx-auto">
              {/* Ajouter une note */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une note</h3>
                <div className="space-y-4">
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Écrivez votre note ici... (Markdown supporté)"
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  {/* Sélecteur de couleur pour nouvelle note */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Palette className="w-4 h-4 inline mr-1" />
                      Couleur de la note
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setNewNoteColor(undefined)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${
                          !newNoteColor ? 'border-gray-600 bg-white shadow-md' : 'border-gray-300 bg-gray-100 hover:border-gray-400'
                        }`}
                        title="Aucune couleur"
                      >
                        {!newNoteColor && <X className="w-3 h-3 text-gray-600" />}
                      </button>
                      {Object.entries(noteColorStyles).map(([color, styles]) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewNoteColor(color as AuditNote['color'])}
                          className={`w-8 h-8 rounded-full ${styles.accent} border-2 transition-all hover:scale-110 ${
                            newNoteColor === color ? 'border-gray-800 shadow-lg' : 'border-gray-300 hover:border-gray-500'
                          }`}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={addNote}
                      disabled={!newNoteContent.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter la note
                    </button>
                  </div>
                </div>
              </div>

              {/* Liste des notes */}
              <div className="space-y-4">
                {management.notes.filter(note => note && note.id && note.content).length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune note</h3>
                    <p className="text-gray-500">Commencez par ajouter une note ci-dessus.</p>
                  </div>
                ) : (
                  management.notes.filter(note => note && note.id && note.content).map(note => {
                    const isEditing = editingNote === note.id;
                    const noteStyle = note.color ? noteColorStyles[note.color] : { bg: 'bg-white', border: 'border-gray-200', accent: 'bg-gray-500' };
                    
                    return (
                      <div key={note.id} className={`rounded-lg border p-6 ${noteStyle.bg} ${noteStyle.border}`}>

                        
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-sm text-gray-500">
                              {new Date(note.timestamp).toLocaleString('fr-FR')}
                            </div>
                            {note.color && (
                              <div className="flex items-center space-x-1">
                                <div className={`w-3 h-3 rounded-full ${noteStyle.accent}`}></div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {!isEditing && (
                              <>
                                <button
                                  onClick={() => startEditNote(note)}
                                  className="text-blue-500 hover:text-blue-700 p-1 rounded transition-colors"
                                  title="Modifier"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                
                                {/* Sélecteur rapide de couleur */}
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => updateNoteColor(note.id, undefined)}
                                    className="w-4 h-4 border border-gray-400 rounded-full bg-white hover:bg-gray-100 transition-colors"
                                    title="Supprimer la couleur"
                                  >
                                    <X className="w-2 h-2 text-gray-400 mx-auto" />
                                  </button>
                                  {Object.entries(noteColorStyles).slice(0, 5).map(([color, styles]) => (
                                    <button
                                      key={color}
                                      onClick={() => updateNoteColor(note.id, color as AuditNote['color'])}
                                      className={`w-4 h-4 rounded-full ${styles.accent} hover:scale-110 transition-transform ${
                                        note.color === color ? 'ring-2 ring-gray-400' : ''
                                      }`}
                                      title={`Couleur ${color}`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                            
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {isEditing ? (
                          <div className="space-y-4">
                            <textarea
                              value={editNoteContent}
                              onChange={(e) => setEditNoteContent(e.target.value)}
                              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            
                            {/* Sélecteur de couleur pour édition */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Palette className="w-4 h-4 inline mr-1" />
                                Couleur de la note
                              </label>
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={(e) => setEditNoteColor(undefined)}
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${
                                    !editNoteColor ? 'border-gray-600 bg-white shadow-md' : 'border-gray-300 bg-gray-100 hover:border-gray-400'
                                  }`}
                                  title="Aucune couleur"
                                >
                                  {!editNoteColor && <X className="w-2 h-2 text-gray-600" />}
                                </button>
                                {Object.entries(noteColorStyles).map(([color, styles]) => (
                                  <button
                                    key={color}
                                    type="button"
                                    onClick={(e) => setEditNoteColor(color as AuditNote['color'])}
                                    className={`w-6 h-6 rounded-full ${styles.accent} border-2 transition-all hover:scale-110 ${
                                      editNoteColor === color ? 'border-gray-800 shadow-lg' : 'border-gray-300 hover:border-gray-500'
                                    }`}
                                    title={color}
                                  />
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={cancelEditNote}
                                className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => saveEditNote(note.id)}
                                disabled={!editNoteContent.trim()}
                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Sauvegarder
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap text-gray-700">
                              {note.content}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="space-y-6">
              {/* En-tête de l'audit manuel */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Audit manuel</h3>
                    <p className="text-sm text-gray-600">
                      Vérifiez manuellement chaque critère RGAA pour ce site web. 
                      Utilisez cette section pour ajouter des violations personnalisées ou vérifier des aspects non couverts par l'analyse automatique.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {(management?.kanbanCards || []).filter(card => card.violation.source === 'manual' && card.status === 'validated').length}
                      </div>
                      <div className="text-gray-500">Conformes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {(management?.kanbanCards || []).filter(card => card.violation.source === 'manual' && card.status !== 'validated').length}
                      </div>
                      <div className="text-gray-500">Non conformes</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulaire d'ajout de violation manuelle */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Ajouter une violation manuelle</h4>
                <ManualViolationForm 
                  onAddViolation={addManualViolation}
                />
              </div>

              {/* Liste des violations manuelles */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900">Violations ajoutées manuellement</h4>
                </div>
                <div className="p-6">
                  {(management?.kanbanCards || [])
                    .filter(card => card.violation.source === 'manual')
                    .length === 0 ? (
                    <div className="text-center py-8">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune violation manuelle</h3>
                      <p className="text-gray-500">Ajoutez des violations personnalisées avec le formulaire ci-dessus.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(management?.kanbanCards || [])
                        .filter(card => card.violation.source === 'manual')
                        .map(card => (
                          <div key={card.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-medium text-gray-900">
                                    Critère {card.violation.criterion}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs border ${priorityColors[card.priority]}`}>
                                    {card.priority}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    card.status === 'validated' ? 'bg-green-100 text-green-800' :
                                    card.status === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                                    card.status === 'postponed' ? 'bg-orange-100 text-orange-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {statusConfig[card.status].title}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{card.violation.description}</p>
                                {card.violation.element && (
                                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {card.violation.element}
                                  </code>
                                )}
                              </div>
                              <button
                                onClick={() => setSelectedCard(card)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Modifier
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="h-full">
              <ManualAuditPage />
            </div>
          )}

          {activeTab === 'rgaa' && (
            <RGAAReference />
          )}
        </div>
      </main>

      {/* Modal de détail de carte */}
      {selectedCard && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4" 
          style={{backgroundColor: 'rgba(0,0,0,0.05)'}}
          onClick={(e) => {
            // Fermer le modal si on clique sur l'arrière-plan
            if (e.target === e.currentTarget) {
              setSelectedCard(null);
            }
          }}
        >
          <div 
            ref={modalRef}
            className="modal-content bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Critère {selectedCard.violation.criterion}
                  </h3>
                  <p className="text-sm text-gray-500">Niveau {selectedCard.violation.level}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCard(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  title="Fermer"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Personnalisation */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-3">Personnalisation</h4>
                  
                  <div className="space-y-3">
                    {/* Titre personnalisé */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Titre personnalisé</label>
                      <input
                        type="text"
                        value={selectedCard.customTitle || ''}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateCardTitle(selectedCard.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        placeholder={`Critère ${selectedCard.violation.criterion}`}
                        className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Description personnalisée */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description personnalisée</label>
                      <textarea
                        value={selectedCard.customDescription || ''}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateCardDescription(selectedCard.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        placeholder={`Niveau ${selectedCard.violation.level}`}
                        rows={2}
                        className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Pastilles de couleur */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Pastille de couleur</label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCardColor(selectedCard.id, undefined);
                          }}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${
                            !selectedCard.colorTag ? 'border-gray-600 bg-white shadow-md' : 'border-gray-300 bg-gray-100 hover:border-gray-400'
                          }`}
                          title="Aucune couleur"
                        >
                          {!selectedCard.colorTag && <span className="text-gray-600 text-xs font-bold">×</span>}
                        </button>
                        {Object.entries(colorTagStyles).map(([color, className]) => (
                          <button
                            key={color}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateCardColor(selectedCard.id, color as KanbanCard['colorTag']);
                            }}
                            className={`w-6 h-6 rounded-full ${className} border-2 transition-all hover:scale-110 ${
                              selectedCard.colorTag === color ? 'border-gray-800 shadow-lg ring-2 ring-gray-400 ring-opacity-50' : 'border-gray-300 hover:border-gray-500'
                            }`}
                            title={color.charAt(0).toUpperCase() + color.slice(1)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Screenshot */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">Screenshot</label>
                      {selectedCard.screenshot ? (
                        <div className="space-y-2">
                          <div className="relative">
                            <img 
                              src={selectedCard.screenshot.data} 
                              alt={selectedCard.screenshot.name}
                              className="w-full max-h-48 object-contain rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeScreenshot();
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                              title="Supprimer le screenshot"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xs text-gray-500">
                            <p className="font-medium">{selectedCard.screenshot.name}</p>
                            <p>Ajouté le {new Date(selectedCard.screenshot.uploadedAt).toLocaleString('fr-FR')}</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            id="screenshot-upload"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="screenshot-upload"
                            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                          >
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                              <p className="text-xs text-gray-600">
                                Cliquez pour importer un screenshot
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                PNG, JPG, JPEG (max. 5MB)
                              </p>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description originale</label>
                  <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    {selectedCard.violation.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                  <select
                    value={selectedCard.priority}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateCardPriority(selectedCard.id, e.target.value as KanbanCard['priority']);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                    <option value="critical">Critique</option>
                  </select>
                </div>

                {selectedCard.violation.element && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sélecteur CSS</label>
                    <code className="block text-xs bg-gray-100 p-2 rounded-lg overflow-x-auto">
                      {selectedCard.violation.element}
                    </code>
                  </div>
                )}

                {selectedCard.violation.htmlSnippet && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code HTML</label>
                    <pre className="text-xs bg-gray-100 p-2 rounded-lg overflow-x-auto">
                      {selectedCard.violation.htmlSnippet}
                    </pre>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCard(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Les modifications sont automatiquement sauvegardées
                    setSelectedCard(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 