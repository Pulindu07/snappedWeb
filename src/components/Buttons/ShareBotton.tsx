import React, { useState } from "react";
import { FaHeart, FaShare } from "react-icons/fa";
import {ShareButtonProps} from "./../types/types";

const ShareButton: React.FC<ShareButtonProps> = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="text-xl text-gray-600 hover:text-blue-500 focus:outline-none"
      >
        <FaShare />
      </button>
    );
  };
  

export default ShareButton;