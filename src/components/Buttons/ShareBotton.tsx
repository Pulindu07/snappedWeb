import React, { useState } from "react";
import {ShareButtonProps} from "./../types/types";

const ShareButton: React.FC<ShareButtonProps> = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="text-xl text-gray-600 hover:text-blue-500 focus:outline-none"
      >
        Share
      </button>
    );
  };
  

export default ShareButton;