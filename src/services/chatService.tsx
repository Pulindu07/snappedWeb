import axios from "axios";

const configProcess = {
    API_URL: import.meta.env.VITE_BASE_API_URL,
    DEFAULT_PAGE_SIZE: Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE)
  };

interface SendMessageRequest {
  content: string;
  conversationId: string;
}

interface SendMessageResponse {
  reply: string;
}

const chatService = {
  async sendMessage(data: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await axios.post<SendMessageResponse>(
      `${configProcess.API_URL}/chat-bot`,
      data
    );
    return response.data;
  },
};

export default chatService;
