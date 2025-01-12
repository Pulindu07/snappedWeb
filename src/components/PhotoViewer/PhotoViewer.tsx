import React,{useEffect, useCallback} from 'react';
import { ModalProps } from './../types/types';

const PhotoViewer: React.FC<{ isOpen: boolean, onClose: () => void, children: React.ReactNode }> = ({ isOpen, onClose, children }) => {
    
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === "Escape") {
              onClose(); // Close the modal
          }
      };

      if (isOpen) {
          document.addEventListener("keydown", handleKeyDown);
      }

      return () => {
          document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md" 
        onClick={onClose}
      >
        <div 
          className="bg-transparent rounded-lg shadow-lg w-[600px] h-[600px]"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <div className="flex justify-end p-2">
            
          </div>
          <div className="w-full h-full">{children}</div>
        </div>
      </div>
    );
  };
  
  
export default PhotoViewer;