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