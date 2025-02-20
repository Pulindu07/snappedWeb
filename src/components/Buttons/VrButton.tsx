import React from "react"
import { ClickButtonProps } from "../types/types"

const VrButton:React.FC<ClickButtonProps> = ({handleButtonClick}) =>{
    return(
        <button 
            onClick={handleButtonClick}
            className="hover:bg-white p-1 rounded-full transition-colors"
        >
            <svg fill="black" height="48px" width="48px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <g>
                    <path d="M21.7,18H10.3C7.9,18,6,16.1,6,13.7V9.3C6,6.9,7.9,5,10.3,5h11.5C24.1,5,26,6.9,26,9.3v4.5C26,16.1,24.1,18,21.7,18z
                        M10.3,7C9,7,8,8,8,9.3v4.5C8,15,9,16,10.3,16h11.5c1.3,0,2.3-1,2.3-2.3V9.3C24,8,23,7,21.7,7H10.3z"/>
                </g>
                <g>
                    <path d="M19,11h-6c-0.6,0-1-0.4-1-1s0.4-1,1-1h6c0.6,0,1,0.4,1,1S19.6,11,19,11z"/>
                </g>
                <path d="M9.4,7.1h13.3c0.3,0,0.7-0.2,0.8-0.5c0.2-0.3,0.2-0.6,0.1-1C22.1,2.6,19.6,1,16,1c-3.6,0-6.1,1.6-7.5,4.7
                    C8.3,6,8.3,6.4,8.5,6.7C8.7,7,9,7.1,9.4,7.1z"/>
                <g>
                    <path d="M12,20.3v1.5c-0.9,0.2-1.8,0.5-2.6,0.8c1.6,1,4,1.6,6.6,1.6c2.6,0,5-0.6,6.6-1.6c-0.8-0.3-1.7-0.6-2.6-0.8v-1.5
                        c0.9-0.7,1.7-1.7,2.4-2.8c0.2-0.3,0.2-0.7,0-1S21.9,16,21.5,16h-11c-0.4,0-0.7,0.2-0.9,0.5s-0.2,0.7,0,1
                        C10.4,18.6,11.1,19.6,12,20.3z"/>
                    <path d="M24.6,23.7c-1.9,1.6-5,2.6-8.6,2.6c-3.5,0-6.6-1-8.6-2.6c-2.5,1.6-4.1,3.8-4.4,6.2c0,0.3,0.1,0.6,0.2,0.8S3.8,31,4,31H28
                        c0.3,0,0.6-0.1,0.7-0.3s0.3-0.5,0.2-0.8C28.7,27.4,27,25.2,24.6,23.7z"/>
                </g>
            </svg>
        </button>
    )
}

export default VrButton;