import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ReactionButtonProps } from "./../types/types";

const ReactionButton: React.FC<ReactionButtonProps> = ({ isLiked, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="text-xl text-gray-600 hover:text-red-500 focus:outline-none"
    >
      {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
    </button>
  );
};

export default ReactionButton;
