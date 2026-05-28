export type PanelType = 'color_accent' | 'image_reference' | 'typography_spec' | 'abstract_graphic' | 'concept_words';

export interface MoodboardPanel {
  id: string;
  type: PanelType;
  title: string;
  subtitle: string;
  content: string; // color hex, text phrase, etc.
  imageKeywords: string[];
  colSpan: number; // 1 or 2
  rowSpan: number; // 1 or 2
  // Visual asset properties generated on the client for rendering
  imageUrl?: string;
  patternType?: 'grid' | 'waves' | 'circles' | 'dots' | 'diagonal';
}

export interface EditorialSpecs {
  typographyPairing: string;
  photographyStyle: string;
  layoutConcept: string;
}

export interface Moodboard {
  id: string;
  title: string;
  tagline: string;
  adjectives: string[];
  colors: {
    hex: string;
    name: string;
    role: string;
  }[];
  editorialSpecs: EditorialSpecs;
  panels: MoodboardPanel[];
  createdBy: string;
  createdAt: string;
  likesCount: number;
  likedByMe?: boolean;
  savedByMe?: boolean;
  industry: string;
  creativeDirection: string;
}

export interface UserSession {
  isGuest: boolean;
  isLoggedIn: boolean;
  mobileNumber?: string;
  fullName?: string;
  email?: string;
  location?: string;
  interests?: string[];
  username?: string;
}

export type ScreenView = 
  | 'splash' 
  | 'login' 
  | 'otp' 
  | 'auth-loading' 
  | 'onboarding' 
  | 'feed' 
  | 'generate' 
  | 'loading-gen' 
  | 'result' 
  | 'saved' 
  | 'profile';
