import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  role: "user" | "bot";
  content: string;
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({ role: "user", content: action.payload });
    },
    addBotMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({ role: "bot", content: action.payload });
    },
    clearChat: (state) => {
      state.messages = [];
    }
  },
});

export const { 
  addUserMessage, 
  addBotMessage,
  clearChat 
} = chatSlice.actions;
export default chatSlice.reducer;