import React, { useState } from 'react';
import { FaHeart, FaRegComment } from 'react-icons/fa';
import {CommentButtonProps} from "./../types/types";


const CommentButton: React.FC<CommentButtonProps> = ({ onClick }) => {
    return (
      <button
        onClick={onClick}
        className="text-xl text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        <FaRegComment />
      </button>
    );
  };

export default CommentButton;