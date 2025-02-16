import React,{useEffect, useCallback} from 'react';
import { ModalProps } from './../types/types';
import { XCircle } from 'lucide-react';

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
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md" 
        onClick={onClose}
      >
        <div 
          className="bg-transparent rounded-lg shadow-lg"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <button
            className="absolute top-0 right-0 p-2 rounded-full bg-black/20 hover:bg-white/20 transition-colors z-[9999]"
            onClick={onClose}
            title="Close"
          >
            <XCircle className="w-6 h-6 text-white" />
          </button>
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </div>
    );
  };
  
  
export default PhotoViewer;