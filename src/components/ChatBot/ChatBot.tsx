import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addUserMessage, sendChatMessage, fetchChatHistory } from "../../redux/chatSlice";
import { SendButton, CloseButton } from "../Buttons";
import LoadingDots from "../LoadingDots";
import Markdown from "react-markdown";

const ChatBot: React.FC = () => {
  const dispatch = useAppDispatch();
  const { messages, chatLoading, sessionId } = useAppSelector((state) => state.chat);
  const [input, setInput] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Load chat history when opening chat
  useEffect(() => {
    if (isChatVisible && sessionId && messages.length === 0) {
      dispatch(fetchChatHistory(sessionId));
    }
  }, [isChatVisible, sessionId, messages.length, dispatch]);

  const handleSendMessage = () => {
    if (input.trim()) {
      dispatch(addUserMessage(input));
      dispatch(sendChatMessage({ message: input, sessionId: sessionId || Date.now().toString() }));
      setInput("");
    }
  };

  const closeChat = () => {
    setIsChatVisible(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsChatVisible(false);
      }
    };

    if (isChatVisible) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isChatVisible]);

  return (
    <div className="fixed bottom-14 right-0 z-50 w-80">
      {!isChatVisible ? (
        <div className="absolute right-4 top-0">
          <button 
            onClick={() => setIsChatVisible(true)}
            className="bg-blue-500 text-white p-3 rounded-full shadow-xl hover:bg-blue-600 transition-all"
          >
            Let's Chat
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
            <h3 className="text-lg font-semibold">Snap Bot</h3>
            <CloseButton handleCloseChat={closeChat} />
          </div>

          <div className="h-[300px] overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && !chatLoading && (
              <div className="text-gray-400 text-center">Say hi to Snap Bot!</div>
            )}
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-lg max-w-[80%] w-fit ${
                  msg.role === "user" 
                    ? "bg-blue-100 ml-auto text-left" 
                    : "bg-gray-100 mr-auto text-left"
                }`}
              >
                <Markdown>{msg.content}</Markdown>
              </div>
            ))}
            {chatLoading && messages.length > 0 && (
              <LoadingDots />
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex p-3 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-grow p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all mr-1"
            />
            <SendButton handleSendMessage={handleSendMessage} loading={chatLoading} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;