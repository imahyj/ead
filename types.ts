export interface Scene {
  sceneNumber: number;
  description: string; // For the AI image generator
  storyText: string; // To be printed on the page
  imagePrompt: string; // Refined prompt for image gen
  imageData?: string; // Base64 string
}

export interface Story {
  title: string;
  moral: string;
  childName: string;
  theme: string;
  scenes: Scene[];
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING_STORY = 'GENERATING_STORY',
  GENERATING_IMAGES = 'GENERATING_IMAGES',
  COMPILING_PDF = 'COMPILING_PDF',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export interface GenerationProgress {
  currentStep: string;
  completedImages: number;
  totalImages: number;
}