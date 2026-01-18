
export interface DatingProfile {
  location: string;
  time: string;
  occasion: string;
  birthday: string;
  instagram: string;
  extraDetails?: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  groundingUrls?: { title: string; uri: string }[];
}

export interface RecommendationResponse {
  advice: string;
  groundingUrls: { title: string; uri: string }[];
}
