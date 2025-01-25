import React, { useEffect, useState, useRef } from "react";
import { HubConnectionBuilder, HubConnectionState, HttpTransportType } from "@microsoft/signalr";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./../../redux/store";
import { addUserMessage, addBotMessage } from "./../../redux/chatSlice";

const ChatBot: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, loading } = useSelector((state: RootState) => state.chat);
  const [input, setInput] = useState("");
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [connection, setConnection] = useState<any>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const configProcess = {
    BASE_API_URL: import.meta.env.VITE_BASE_API_URL,
  };

  useEffect(() => {
    const initializeSignalRConnection = async () => {
      try {
        const hubConnection = new HubConnectionBuilder()
          .withUrl(`${configProcess.BASE_API_URL}/chat-bot`, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets
          })
          .withAutomaticReconnect()
          .build();

        hubConnection.on("ReceiveMessage", (message: string) => {
          dispatch(addBotMessage(message));
        });

        await hubConnection.start();
        setConnection(hubConnection);
      } catch (error) {
        console.error("SignalR Connection Error:", error);
      }
    };

    if (!connection) {
      initializeSignalRConnection();
    }

    return () => {
      if (connection?.state === HubConnectionState.Connected) {
        connection.stop();
      }
    };
  }, [dispatch, connection]);

  const handleSendMessage = async () => {
    if (input.trim() && connection) {
      try {
        dispatch(addUserMessage(input));
        await connection.invoke("SendMessage", input, "conversation-1");
        setInput("");
      } catch (error) {
        console.error("Message send error:", error);
      }
    }
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
            <h3 className="text-lg font-semibold">ChatBot</h3>
            <button 
              onClick={() => setIsChatVisible(false)}
              className="hover:bg-blue-600 p-1 rounded"
            >
              X
            </button>
          </div>

          <div className="h-[300px] overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-lg max-w-[80%] w-fit ${
                  msg.role === "user" 
                    ? "bg-blue-100 ml-auto text-left" 
                    : "bg-gray-100 mr-auto text-left"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 italic text-center">Typing...</div>
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
              className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button 
              onClick={handleSendMessage} 
              disabled={loading}
              className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;