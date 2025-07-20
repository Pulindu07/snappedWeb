import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage, ChatResponse } from "../utils/types";
import { chatServiceGetChatHistory, chatServiceSendMessage } from "../services/chatService";

interface ChatState {
  messages: ChatMessage[];
  chatLoading: boolean;
  chatError: string | null;
  sessionId: string | null;
}

const initialState: ChatState = {
  messages: [],
  chatLoading: false,
  chatError: null,
  sessionId: null,
};

export const sendChatMessage = createAsyncThunk<ChatResponse, { message: string; sessionId: string }>(
  'chat/sendMessage',
  async (data) => {
    const response = await chatServiceSendMessage.sendMessage(data);
    return response;
  }
);

export const fetchChatHistory = createAsyncThunk<ChatMessage[], string>(
  'chat/fetchHistory',
  async (sessionId) => {
    const response = await chatServiceGetChatHistory.sendMessage(sessionId);
    return response;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({ role: "user", content: action.payload });
      state.chatLoading = true;
    },
    addBotMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({ role: "assistant", content: action.payload });
      state.chatLoading = false;
    },
    clearChat: (state) => {
      state.messages = [];
      state.sessionId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.chatLoading = true;
        state.chatError = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.chatLoading = false;
        state.sessionId = action.payload.sessionId;
        state.messages.push({ role: "assistant", content: action.payload.response });
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.chatLoading = false;
        state.chatError = action.error.message || 'Failed to send message';
      })
      .addCase(fetchChatHistory.pending, (state) => {
        state.chatLoading = true;
        state.chatError = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.chatLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.chatLoading = false;
        state.chatError = action.error.message || 'Failed to fetch chat history';
      });
  },
});

export const { 
  addUserMessage, 
  addBotMessage,
  clearChat 
} = chatSlice.actions;
export default chatSlice.reducer;