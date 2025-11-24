export interface Station {
  id: string;
  name: string;
  streamUrl: string;
  genre: string;
  location: string;
  imageUrl: string;
  tags: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum PlayerState {
  STOPPED = 'STOPPED',
  BUFFERING = 'BUFFERING',
  PLAYING = 'PLAYING',
  ERROR = 'ERROR'
}

export interface GeminiRecommendation {
  stationIds: string[];
  reasoning: string;
}