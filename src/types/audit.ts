export interface AuditRequest {
  url?: string;
  htmlContent?: string;
  language: 'fr' | 'en';
  engine?: 'wave' | 'axe' | 'rgaa' | 'all';
}

export interface RGAAViolation {
  criterion: string;
  level: 'A' | 'AA' | 'AAA';
  description: string;
  element?: string;
  htmlSnippet?: string;
  recommendation: string;
  impact: 'low' | 'medium' | 'moderate' | 'high' | 'serious' | 'critical';
  ruleId?: string; // ID de la règle WAVE ou custom
  context?: string; // Contexte additionnel ou failureSummary
}

export interface AuditResult {
  url?: string;
  timestamp: Date;
  totalViolations: number;
  violationsByLevel: {
    A: number;
    AA: number;
    AAA: number;
  };
  violationsByImpact: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  violations: RGAAViolation[];
  summary?: string;
  score: number; // Score sur 100
  engine?: 'wave' | 'axe' | 'rgaa'; // Moteur d'analyse utilisé
}

export interface EngineResult {
  engine: 'wave' | 'axe' | 'rgaa';
  result: AuditResult;
  analysisTime: number; // Temps d'analyse en ms
  success: boolean;
  error?: string;
}

export interface ComparativeResult {
  url: string;
  timestamp: Date;
  engines: EngineResult[];
  totalUniqueViolations: number;
  commonViolations: RGAAViolation[]; // Violations détectées par plusieurs moteurs
  engineSpecificViolations: {
    wave: RGAAViolation[];
    axe: RGAAViolation[];
    rgaa: RGAAViolation[];
  };
  summary: {
    bestScore: number;
    worstScore: number;
    averageScore: number;
    mostReliableEngine: 'wave' | 'axe' | 'rgaa';
    consensusLevel: number; // Pourcentage d'accord entre les moteurs
  };
}

export interface ComparativeViolation {
  violation: RGAAViolation;
  detectedBy: ('wave' | 'axe' | 'rgaa')[];
  confidence: 'high' | 'medium' | 'low'; // Basé sur le nombre de moteurs qui l'ont détecté
}

export interface AuditHistory {
  id: string;
  url?: string;
  timestamp: string;
  score: number;
  totalViolations: number;
}

export interface AnalysisProgress {
  step: 'idle' | 'fetching' | 'parsing' | 'analyzing' | 'complete' | 'error';
  message: string;
  progress: number; // 0-100
} 