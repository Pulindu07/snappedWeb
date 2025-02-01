import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WallArtSection from "../WallArtSection/index";

interface WallArtProps{
    isOpen:boolean;
    photoUrl:string|undefined;
}
const WallArtButton:React.FC<WallArtProps> = ({ isOpen, photoUrl}) => {
    
    const navigate = useNavigate();

    const handleClick=()=>{
        // navigate("/photo-section", { state: { imgSrc: {photoUrl} } });
        window.open('https://www.google.com', '_blank');
    }

    if (!isOpen) {
        return null;
    }
    return (
        <div>
            <button
                className="z-[9999] fixed bottom-2 right-2 bg-white text-black px-4 py-2 rounded-full shadow-md hover:bg-gray-200"
                onClick={()=>handleClick()}
                >
                Buy Wall Art
            </button>
        </div>
        
    );
}

export default WallArtButton;