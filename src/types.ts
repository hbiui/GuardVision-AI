/**
 * 类型定义
 */

export enum OCRProvider {
  GEMINI = 'GEMINI',
  DOUBAO = 'DOUBAO',
  BAIDU = 'BAIDU',
  ALIBABA = 'ALIBABA',
  OPENAI = 'OPENAI'
}

export enum LLMProvider {
  GEMINI = 'GEMINI',
  DOUBAO = 'DOUBAO',
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  QWEN = 'QWEN',
  DEEPSEEK = 'DEEPSEEK'
}

export interface OCRConfig {
  provider: OCRProvider;
  language?: string;
}

export interface LLMConfig {
  provider: LLMProvider;
  modelName?: string;
}

export interface SecurityTerm {
  term: string;
  category: string;
  definition: string;
  preferredAlternative?: string;
}

export interface DetectionError {
  text: string;
  type: 'spelling' | 'grammar' | 'terminology' | 'style';
  suggestion: string;
  alternatives: string[];
  explanation: string;
  location?: [number, number, number, number];
}

export interface DetectionResult {
  originalText: string;
  errors: DetectionError[];
  isProfessional: boolean;
  score: number;
}

export interface ProcessedImage {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  currentStep?: string;
  result?: DetectionResult;
  rawOcrText?: string;
  selected?: boolean;
  ocrProvider?: OCRProvider;
  errorMessage?: string;
}
