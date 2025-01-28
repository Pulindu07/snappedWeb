import React, { useState } from "react";
import { SendButtonProps } from "../types/types";

const SendButton:React.FC<SendButtonProps> = ({handleSendMessage, loading}) => {
    return (
        <button 
            onClick={handleSendMessage} 
            disabled={loading}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
        </button>
    )
}

export default SendButton;