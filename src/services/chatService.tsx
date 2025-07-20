import axios from "axios";

const configProcess = {
    API_URL: import.meta.env.VITE_BASE_API_URL,
    DEFAULT_PAGE_SIZE: Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE),
    CHAT_URL: import.meta.env.VITE_CHAT_API_URL,
  };

export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

interface SendMessageRequest {
  message: string;
  sessionId: string;
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

const chatServiceSendMessage = {
  async sendMessage(data: SendMessageRequest): Promise<ChatResponse> {
    console.log("url: ",  `${configProcess.CHAT_URL}/api/Chat/message`);
    const response = await axios.post<ChatResponse>(
      `${configProcess.CHAT_URL}/api/Chat/message`,
      data
    );
    return response.data;
  },
};

const chatServiceGetChatHistory = {
  async sendMessage(sessionId: string): Promise<ChatMessage[]> {
    const response = await axios.get<ChatMessage[]>(
      `${configProcess.CHAT_URL}/api/Chat/history/${sessionId}`
    );
    return response.data;
  },
};


export { chatServiceSendMessage, chatServiceGetChatHistory };
