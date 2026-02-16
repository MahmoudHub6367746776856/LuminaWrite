export type AppView = 'landing' | 'studio' | 'library' | 'analytics';

export interface ContentDraft {
  id: string;
  title: string;
  body: string;
  status: 'draft' | 'published' | 'generated';
  createdAt: string;
  tags: string[];
  thumbnail: string;
  generatedImage?: string;
}

export interface ContentSuggestions {
  headlines: string[];
  keywords: string[];
  summary: string;
  sentiment: string;
}

export interface AnalyticsData {
  reach: number;
  engagement: number;
  efficiency: number;
  contentVolume: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
