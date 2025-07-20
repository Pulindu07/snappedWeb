export interface Photo {
    id: string;
    fileName: string;
    url: string;
    dimensions: {
      width: number;
      height: number;
    };
    uploadDate: string;
    tags: string[];
    description?: string;
    likeCount: number;
    comments: Comment[];
  }
  export interface GridPhoto {
    id: string;
    fileName: string;
    url:string;
    prevUrl: string;
    likeCount: number;
    description:string;
  }
  
  export interface Comment {
    id: string;
    text: string;
    timestamp: string;
    sessionId: string;
  }

  export interface ChatMessage {
    id?: number;
    role: 'user' | 'assistant';
    content: string;
    createdAt?: string;
  }
  
  export interface PhotoReference {
    id: number;
    title: string;
    blobUrl: string;
    relevanceScore: number;
  }
  
  export interface ChatResponse {
    response: string;
    sessionId: string;
    referencedPhotos?: PhotoReference[];
  }
  
  export interface ChatRequest {
    message: string;
    sessionId?: string;
  }